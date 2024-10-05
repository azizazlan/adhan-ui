import { Component, createSignal, createEffect } from 'solid-js';
import { ProgressBar } from 'solid-bootstrap';
import { format } from 'date-fns';
import styles from './App.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Header';
import FlipClock from './components/FlipClock';
import Footer from './components/Footer';
import Hadiths from './components/Hadiths';
import Settings from './components/Settings';
import CountdownTimer from './components/CountdownTimer';
import Credits from './components/Credits';
import Prayers from './components/Prayers';
import Adhan from './components/Adhan';
import Iqamah from './components/Iqamah';
import { formatPrayerTime, formatCountdown, formatTime } from './utils/formatter';
import { getPrayerName } from './utils/prayername';
import { Hadith, HadithApiResponse } from './types/hadith';

const API_KEY = import.meta.env.VITE_HADITH_API_KEY;
const SHOW_LASTTHIRD = import.meta.env.VITE_SHOW_LASTTHIRD === 'true';
const ROTATE_BETWEEN_PRAYERTIMES_HADITHS_INTERVAL_MS = Math.max(0, parseInt(import.meta.env.VITE_ROTATE_BETWEEN_PRAYERTIMES_HADITHS_INTERVAL_MS || '10000', 10));
const REMINDER_AFTER_PRAYER_MINS = Math.max(0, parseInt(import.meta.env.VITE_REMINDER_AFTER_PRAYER_MINS || '10', 10));
const LOCATION = import.meta.env.VITE_LOCATION;
const LATITUDE = import.meta.env.VITE_LATITUDE;
const LONGITUDE = import.meta.env.VITE_LONGITUDE;
const TIMEZONE = import.meta.env.VITE_TIMEZONE;
const TUNE = import.meta.env.VITE_TUNE;
const DISPLAY_HADITH: boolean = import.meta.env.VITE_DISPLAY_HADITH === 'true';
const API_URL = `https://api.aladhan.com/v1/timings/today?latitude=${LATITUDE}&longitude=${LONGITUDE}&method=17&timezonestring=${TIMEZONE}&tune=${TUNE}`;
const API_HIJRI = "https://api.aladhan.com/v1/gToH/";
const LANGUAGE = import.meta.env.VITE_LANGUAGE;

export type DisplayMode = 'prayerTimes' | 'hadiths' | 'credits' | 'settings' | 'adhan' | 'iqamah';

const App: Component = () => {
  const [currentDateTime, setCurrentDateTime] = createSignal(new Date());
  const [currentPrayer, setCurrentPrayer] = createSignal('');
  const [nextPrayer, setNextPrayer] = createSignal({ name: '', time: '', countdown: '' });

  const [currentPrayerProgress, setCurrentPrayerProgress] = createSignal(0);
  const [currentPrayerRemaining, setCurrentPrayerRemaining] = createSignal('');
  const [prayerTimes, setPrayerTimes] = createSignal([]);
  const [location] = createSignal(LOCATION);
  const [showPrayerTimes, setShowPrayerTimes] = createSignal(true);
  const [hijriDate, setHijriDate] = createSignal<HijriDate | null>(null);
  const [displayMode, setDisplayMode] = createSignal<DisplayMode>('prayerTimes');
  const [contentsHeight, setContentsHeight] = createSignal(700);

  const toggleDisplayMode = (mode: DisplayMode) => {
    setDisplayMode(prev => prev === mode ? 'prayerTimes' : mode);
  };

  const isPrayerTimePast = (prayerTime: string, prayerName: string) => {
    const now = currentDateTime();
    const [hours, minutes] = prayerTime.split(':').map(Number);
    let prayerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

    // If it's Lastthird and the time is before the current time, assume it's for the next day
    if (SHOW_LASTTHIRD && prayerName === 'Las3rd' && prayerDate < now) {
      prayerDate.setDate(prayerDate.getDate() + 1);
    }

    // The prayer time has passed more than 10 minutes ago
    const afterMinutesAgo = new Date(now.getTime() - REMINDER_AFTER_PRAYER_MINS * 60 * 1000);
    return prayerDate < afterMinutesAgo;
  };

  const updateCurrentAndNextPrayer = () => {
    const now = currentDateTime();
    let currentPrayerInfo = { name: '', date: new Date(0) };
    let nextPrayerInfo = { name: '', date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 59) };

    prayerTimes().forEach(prayer => {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      let prayerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

      // If the prayer time is before the current time and it's Lastthird, it's for the next day
      if (prayer.name === 'Las3rd' && prayerDate < now) {
        prayerDate.setDate(prayerDate.getDate() + 1);
      }

      if (prayerDate <= now && prayerDate > currentPrayerInfo.date) {
        currentPrayerInfo = { name: prayer.name, date: prayerDate };
      } else if (prayerDate > now && prayerDate < nextPrayerInfo.date) {
        nextPrayerInfo = { name: prayer.name, date: prayerDate };
      }
    });

    // Special case: If it's after Isha and before midnight, set Las3rd as next prayer
    if (SHOW_LASTTHIRD && currentPrayerInfo.name === 'Isha' && nextPrayerInfo.name !== 'Las3rd') {
      const las3rdPrayer = prayerTimes().find(p => p.name === 'Las3rd');
      if (las3rdPrayer) {
        const [hours, minutes] = las3rdPrayer.time.split(':').map(Number);
        nextPrayerInfo = {
          name: 'Las3rd',
          date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, hours, minutes)
        };
      }
    }

    setCurrentPrayer(currentPrayerInfo.name);

    if (nextPrayerInfo.name) {
      const timeDiff = nextPrayerInfo.date.getTime() - now.getTime();
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      setNextPrayer({
        name: nextPrayerInfo.name,
        time: formatPrayerTime(nextPrayerInfo.date.toTimeString()),
        countdown: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      });
    }
  };

  const updateCurrentPrayerProgress = () => {
    if (currentPrayer()) {
      const currentTime = currentDateTime();
      const currentPrayerTime = prayerTimes().find(prayer => prayer.name === currentPrayer());
      const nextPrayerTime = prayerTimes().find(prayer => prayer.name === nextPrayer().name);

      if (currentPrayerTime && nextPrayerTime) {
        const [currentHours, currentMinutes] = currentPrayerTime.time.split(':').map(Number);
        const [nextHours, nextMinutes] = nextPrayerTime.time.split(':').map(Number);

        const currentPrayerDate = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), currentHours, currentMinutes);
        const nextPrayerDate = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), nextHours, nextMinutes);

        if (nextPrayerDate < currentPrayerDate) {
          nextPrayerDate.setDate(nextPrayerDate.getDate() + 1);
        }

        const totalDuration = nextPrayerDate.getTime() - currentPrayerDate.getTime();
        const elapsedDuration = currentTime.getTime() - currentPrayerDate.getTime();
        const remainingDuration = totalDuration - elapsedDuration;
        const progress = (elapsedDuration / totalDuration) * 100;

        setCurrentPrayerProgress(Math.min(progress, 100));
        setCurrentPrayerRemaining(formatCountdown(remainingDuration));
      }
    }
  };

  const fetchPrayerTimes = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      const timings = data.data.timings;
      if (SHOW_LASTTHIRD) {
        setPrayerTimes([
          { name: getPrayerName(LANGUAGE, 'Fajr'), time: timings.Fajr },
          { name: getPrayerName(LANGUAGE, 'Sunrise'), time: timings.Sunrise },
          { name: getPrayerName(LANGUAGE, 'Dhuhr'), time: timings.Dhuhr },
          { name: getPrayerName(LANGUAGE, 'Asr'), time: timings.Asr },
          { name: getPrayerName(LANGUAGE, 'Maghrib'), time: timings.Maghrib },
          { name: getPrayerName(LANGUAGE, 'Isha'), time: timings.Isha },
          { name: getPrayerName(LANGUAGE, 'Las3rd'), time: timings.Lastthird },
        ]);
      } else {
        setPrayerTimes([
          { name: getPrayerName(LANGUAGE, 'Fajr'), time: timings.Fajr },
          { name: getPrayerName(LANGUAGE, 'Sunrise'), time: timings.Sunrise },
          { name: getPrayerName(LANGUAGE, 'Dhuhr'), time: timings.Dhuhr },
          { name: getPrayerName(LANGUAGE, 'Asr'), time: timings.Asr },
          { name: getPrayerName(LANGUAGE, 'Maghrib'), time: timings.Maghrib },
          { name: getPrayerName(LANGUAGE, 'Isha'), time: timings.Isha },
        ]);
      }
      updateCurrentAndNextPrayer();
    } catch (error) {
      console.error('Error fetching prayer times:', error);
    }
  };

  const fetchHijriDate = async (today: Date) => {
    try {
      const formattedDate = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;
      const response = await fetch(API_HIJRI + formattedDate);
      const data = await response.json();
      setHijriDate(data.data.hijri);
    } catch (error) {
      console.error('Error fetching hijri date:', error);
    }
  };

  createEffect(() => {
    const logBrowserDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      console.log(`Browser dimensions: ${width}px x ${height}px`);
      setContentsHeight(height - 275); // value 275 is by trials and erros
    };

    logBrowserDimensions();
    window.addEventListener('resize', logBrowserDimensions);
    return () => window.removeEventListener('resize', logBrowserDimensions);
  }, []);

  createEffect(() => {
    fetchPrayerTimes();
    fetchHijriDate(new Date());
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
      updateCurrentAndNextPrayer();
      updateCurrentPrayerProgress();
    }, 1000);

    const toggleInterval = setInterval(() => {
      if (DISPLAY_HADITH) {
        toggleDisplayMode();
      } else {
        setShowPrayerTimes(true);
      }
    }, ROTATE_BETWEEN_PRAYERTIMES_HADITHS_INTERVAL_MS);

    return () => {
      clearInterval(timer);
      clearInterval(toggleInterval);
    };
  });

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.log(`Error attempting to enable full-screen mode: ${e.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div class={styles.App}>
      {displayMode() === 'adhan' ? (
        <Adhan prayer={nextPrayer()} onClose={() => toggleDisplayMode('prayerTimes')} />
      ) : displayMode() === 'iqamah' ? (
        <Iqamah prayer={nextPrayer()} onClose={() => toggleDisplayMode('prayerTimes')} />
      ) : (
        <>
          <Header
            toggleFullScreen={toggleFullScreen}
            toggleDisplayMode={(mode: DisplayMode) => toggleDisplayMode(mode)}
            location={location()}
            formattedDate={format(currentDateTime(), 'dd/MM/yyyy').toUpperCase()}
            displayMode={displayMode()}
            currentPrayer={currentPrayer()}
            nextPrayer={nextPrayer()}
            hijriDate={hijriDate()}
          />
          <div class={styles.contents} style={{ height: `${contentsHeight()}px` }}>
            {displayMode() === 'prayerTimes' && (
              <Prayers
                prayerTimes={prayerTimes()}
                currentPrayer={currentPrayer()}
                nextPrayer={nextPrayer()}
                isPrayerTimePast={isPrayerTimePast}
                toggleDisplayMode={toggleDisplayMode}
              />
            )}
            {displayMode() === 'hadiths' && <Hadiths apiKey={API_KEY} onClose={() => toggleDisplayMode('prayerTimes')} />}
            {displayMode() === 'credits' && <Credits onClose={() => toggleDisplayMode('prayerTimes')} />}
            {displayMode() === 'settings' && <Settings onClose={() => toggleDisplayMode('prayerTimes')} />}
          </div>
          <Footer
            onCreditsClick={() => toggleDisplayMode('credits')}
            onHadithsClick={() => toggleDisplayMode('hadiths')}
            onSettingsClick={() => toggleDisplayMode('settings')}
          />
        </>
      )}
    </div>
  );
};

export default App;