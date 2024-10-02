import { Component, createSignal, createEffect } from 'solid-js';
import { ProgressBar } from 'solid-bootstrap';
import { format } from 'date-fns';
import styles from './App.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PrayerTimeItem from './components/PrayerTimeItem';
import ClockHeader from './ClockHeader';
import FlipClock from './components/FlipClock';
import HadithDisplay from './components/HadithDisplay';
import { Hadith, HadithApiResponse } from './types/hadith';
import Footer from './components/Footer';
import SettingsDisplay from './components/SettingsDisplay';
import CountdownTimer from './components/CountdownTimer';
const API_KEY = import.meta.env.VITE_HADITH_API_KEY;
const SHOW_PRAYER_TIMES_INTERVAL_MS = Math.max(0, parseInt(import.meta.env.VITE_SHOW_PRAYER_TIMES_INTERVAL_MS || '10000', 10));
const LOCATION = import.meta.env.VITE_LOCATION;
const LATITUDE = import.meta.env.VITE_LATITUDE;
const LONGITUDE = import.meta.env.VITE_LONGITUDE;
const TIMEZONE = import.meta.env.VITE_TIMEZONE;
const TUNE = import.meta.env.VITE_TUNE;
const DISPLAY_HADITH: boolean = import.meta.env.VITE_DISPLAY_HADITH === 'true';
const API_URL = `http://api.aladhan.com/v1/timings/today?latitude=${LATITUDE}&longitude=${LONGITUDE}&method=17&timezonestring=${TIMEZONE}&tune=${TUNE}`;
const API_HIJRI = "http://api.aladhan.com/v1/gToH/";

const App: Component = () => {
  const [currentDateTime, setCurrentDateTime] = createSignal(new Date());
  const [currentPrayerProgress, setCurrentPrayerProgress] = createSignal(0);
  const [currentPrayerRemaining, setCurrentPrayerRemaining] = createSignal('');
  const [prayerTimes, setPrayerTimes] = createSignal([]);
  const [currentPrayer, setCurrentPrayer] = createSignal('');
  const [nextPrayer, setNextPrayer] = createSignal({ name: '', time: '', countdown: '' });
  const [location] = createSignal(LOCATION);
  const [showPrayerTimes, setShowPrayerTimes] = createSignal(true);
  const [hijriDate, setHijriDate] = createSignal<HijriDate | null>(null);
  const [displayMode, setDisplayMode] = createSignal<DisplayMode>('prayerTimes');

  const toggleDisplayMode = () => {
    setDisplayMode(prev => {
      if (prev === 'prayerTimes') return 'hadith';
      if (prev === 'hadith') return 'prayerTimes';
      return prev; // Keep settings if it's already on settings
    });
  };

  const toggleSettings = () => {
    setDisplayMode(prev => prev === 'settings' ? 'prayerTimes' : 'settings');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).replace(/\s(AM|PM)/, (match) => match.toUpperCase());
  };

  const formatPrayerTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).replace(/\s(AM|PM)/, (match) => match.toUpperCase());
  };

  const formatCountdown = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const isPrayerTimePast = (prayerTime: string, prayerName: string) => {
    const now = currentDateTime();
    const [hours, minutes] = prayerTime.split(':').map(Number);
    let prayerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

    // If it's Lastthird and the time is before the current time, assume it's for the next day
    if (prayerName === 'Las3rd' && prayerDate < now) {
      prayerDate.setDate(prayerDate.getDate() + 1);
    }

    // The prayer time has passed more than 10 minutes ago
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
    return prayerDate < tenMinutesAgo;
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
    if (currentPrayerInfo.name === 'Isha' && nextPrayerInfo.name !== 'Las3rd') {
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
      setPrayerTimes([
        { name: 'Fajr', time: timings.Fajr },
        { name: 'Sunrise', time: timings.Sunrise },
        { name: 'Dhuhr', time: timings.Dhuhr },
        { name: 'Asr', time: timings.Asr },
        { name: 'Maghrib', time: timings.Maghrib },
        { name: 'Isha', time: timings.Isha },
        { name: 'Las3rd', time: timings.Lastthird },
      ]);
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
    fetchPrayerTimes();
    fetchHijriDate(new Date());
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
      updateCurrentAndNextPrayer();
      updateCurrentPrayerProgress();
    }, 1000);

    const toggleInterval = setInterval(() => {
      if (DISPLAY_HADITH) {
        setShowPrayerTimes((prev) => !prev);
        // setShowPrayerTimes(false);
        setCurrentHadith(getNextHadith());
      } else {
        setShowPrayerTimes(true);
      }
    }, SHOW_PRAYER_TIMES_INTERVAL_MS); // SHOW_PRAYER_TIMES_INTERVAL_MS

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

  const toggleDisplayHadith = () => {
    setShowPrayerTimes((prev) => !prev);
  };

  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <ClockHeader
          toggleFullScreen={toggleFullScreen}
          toggleDisplayMode={toggleDisplayMode}
          toggleSettings={toggleSettings}
          location={location()}
          formattedDate={format(currentDateTime(), 'EEE dd-MM-yyyy').toUpperCase()}
          displayMode={displayMode()}
          currentPrayer={currentPrayer()}
          nextPrayer={nextPrayer()}
          hijriDate={hijriDate()}
        />
        <div class={styles.contents}>
          {displayMode() === 'prayerTimes' && (
            // Prayer times content
            prayerTimes().map((prayer) => (
              <div>
                <PrayerTimeItem
                  prayer={prayer}
                  currentPrayer={currentPrayer()}
                  nextPrayer={nextPrayer()}
                  isPrayerTimePast={isPrayerTimePast}
                  formatPrayerTime={formatPrayerTime}
                  toggleDisplayMode={toggleDisplayMode}
                />
                {prayer.name === nextPrayer().name && (
                  <CountdownTimer nextPrayer={nextPrayer()} />
                )}
              </div>
            ))
          )}
          {displayMode() === 'hadith' && <HadithDisplay apiKey={API_KEY} onClose={toggleDisplayMode} />}
          {displayMode() === 'settings' && <SettingsDisplay onClose={toggleSettings} />}
        </div>
      </header>
      <Footer />
    </div>
  );
};

export default App;