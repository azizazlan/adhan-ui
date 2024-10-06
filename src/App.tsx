import { Component, createSignal, createEffect, createMemo, Suspense, Show, createResource } from 'solid-js';
import * as i18n from "@solid-primitives/i18n";

import { ProgressBar } from 'solid-bootstrap';
import { format, addDays, addMinutes, addSeconds, subHours, subMinutes, subSeconds, isValid, parse } from 'date-fns';
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
import { formatPrayerTime, formatCountdown, formatTime, getFormattedDate } from './utils/formatter';
import { getPrayerName } from './utils/prayername';
import { Hadith, HadithApiResponse } from './types/hadith';
import { isPrayerTimePast } from './utils/helper';
// import en from './translations/en.json';
// import ms from './translations/ms.json';

const API_KEY = import.meta.env.VITE_HADITH_API_KEY;
const SHOW_LASTTHIRD = import.meta.env.VITE_SHOW_LASTTHIRD === 'true';
const ROTATE_BETWEEN_PRAYERTIMES_HADITHS_INTERVAL_MS = Math.max(0, parseInt(import.meta.env.VITE_ROTATE_BETWEEN_PRAYERTIMES_HADITHS_INTERVAL_MS || '10000', 10));
const BEFORE_DISPLAY_ADHAN_MINS = Math.max(0, parseInt(import.meta.env.VITE_BEFORE_DISPLAY_ADHAN_MINS || '15', 10));
const VITE_ADHAN_MINS = Math.max(0, parseInt(import.meta.env.VITE_ADHAN_MINS || '10', 10));
const LOCATION = import.meta.env.VITE_LOCATION;
const LATITUDE = import.meta.env.VITE_LATITUDE;
const LONGITUDE = import.meta.env.VITE_LONGITUDE;
const TIMEZONE = import.meta.env.VITE_TIMEZONE;
const TUNE = import.meta.env.VITE_TUNE;
const DISPLAY_HADITH: boolean = import.meta.env.VITE_DISPLAY_HADITH === 'true';
const API_URL = `https://api.aladhan.com/v1/timings/today?latitude=${LATITUDE}&longitude=${LONGITUDE}&method=17&timezonestring=${TIMEZONE}&tune=${TUNE}`;
const API_HIJRI = "https://api.aladhan.com/v1/gToH/";
const LANGUAGE = import.meta.env.VITE_LANGUAGE;
const DEMO_ADHAN_MINS = Math.max(0, parseInt(import.meta.env.VITE_DEMO_ADHAN_MINS || '30', 10));

export type DisplayMode = 'prayerTimes' | 'hadiths' | 'credits' | 'settings' | 'adhan' | 'iqamah';

async function fetchDictionary(locale: Locale): Promise<Dictionary> {
  try {
    const module = await import(`./i18n/${locale}.ts`);
    if (module && module.dict) {
      const dict: RawDictionary = module.dict;
      return i18n.flatten(dict);
    } else {
      console.error(`Dictionary for locale ${locale} is undefined or missing 'dict' export`);
      return {}; // Return an empty object as fallback
    }
  } catch (error) {
    console.error(`Error loading dictionary for locale ${locale}:`, error);
    return {}; // Return an empty object as fallback
  }
}

const App: Component = () => {

  const [locale, setLocale] = createSignal<Locale>(LANGUAGE);

  const [dict] = createResource(locale, fetchDictionary);

  dict(); // => Dictionary | undefined
  // (undefined when the dictionary is not loaded yet)

  const t = i18n.translator(dict);

  // const [isDemo, setIsDemo] = createSignal(false);
  const [isDemo2, setIsDemo2] = createSignal(false);
  const [demoNextPrayer, setDemoNextPrayer] = createSignal(null);
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
  const [demoSecondCounter, setDemoSecondCounter] = createSignal(0);
  const [lastTriggeredPrayer, setLastTriggeredPrayer] = createSignal('');
  const [iqamahTriggerTime, setIqamahTriggerTime] = createSignal<Date | null>(null);


  const toggleDisplayMode = (mode: DisplayMode) => {
    setDisplayMode(prev => prev === mode ? 'prayerTimes' : mode);
  };

  const toggleDemo2 = () => {

    const today = new Date();
    const fajrTime = prayerTimes().find(prayer => prayer.name === getPrayerName(LANGUAGE, 'Fajr'))?.time;

    const [fajrHours, fajrMinutes] = fajrTime.split(':').map(Number);
    let demoDateTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), fajrHours, fajrMinutes);
    console.log("demoDateTime", demoDateTime);
    demoDateTime = subMinutes(demoDateTime, 1); // Set to 2 minutes before Fajr
    demoDateTime = subSeconds(demoDateTime, 3); // then, set to 10 seconds before Fajr
    setCurrentDateTime(demoDateTime);

    if (!isDemo2()) {
      // Entering demo mode
      const nextPrayerInfo = nextPrayer();
      if (nextPrayerInfo && nextPrayerInfo.time) {
        setCurrentDateTime(demoDateTime);
        setDemoNextPrayer(nextPrayerInfo);
        setDemoSecondCounter(0);

        // Update current prayer based on demo time
        const currentPrayerInfo = findCurrentPrayer(demoDateTime);
        setCurrentPrayer(currentPrayerInfo.name);

        // Force an update of prayer times
        updateCurrentAndNextPrayer();
      }
    } else {
      // Exiting demo mode
      setCurrentDateTime(new Date());
      setDemoNextPrayer(null);

      // Reset current prayer based on actual time
      const currentPrayerInfo = findCurrentPrayer(new Date());
      setCurrentPrayer(currentPrayerInfo.name);

      // Force an update of prayer times
      updateCurrentAndNextPrayer();
    }
    setIsDemo2(!isDemo2());
  };

  const findCurrentPrayer = (time: Date) => {
    let currentPrayerInfo = { name: '', time: '' };

    prayerTimes().forEach(prayer => {
      const [prayerHours, prayerMinutes] = prayer.time.split(':').map(Number);
      let prayerDate = new Date(time.getFullYear(), time.getMonth(), time.getDate(), prayerHours, prayerMinutes);

      if (prayer.name === 'Las3rd' && prayerDate < time) {
        prayerDate.setDate(prayerDate.getDate() + 1);
      }

      if (prayerDate <= time && (currentPrayerInfo.name === '' || prayerDate > new Date(time.getFullYear(), time.getMonth(), time.getDate(), ...currentPrayerInfo.time.split(':').map(Number)))) {
        currentPrayerInfo = prayer;
      }
    });

    return currentPrayerInfo;
  };

  const updateCurrentAndNextPrayer = () => {
    const now = currentDateTime();
    let currentPrayerInfo = findCurrentPrayer(now);
    let nextPrayerInfo = { name: '', time: '' };

    // if (isDemo() && demoNextPrayer()) {
    //   nextPrayerInfo = demoNextPrayer();
    // } else {
    // Find next prayer
    prayerTimes().forEach(prayer => {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      let prayerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

      if (prayer.name === 'Las3rd' && prayerDate < now) {
        prayerDate.setDate(prayerDate.getDate() + 1);
      }

      if (prayerDate > now && (nextPrayerInfo.name === '' || prayerDate < new Date(now.getFullYear(), now.getMonth(), now.getDate(), ...nextPrayerInfo.time.split(':').map(Number)))) {
        nextPrayerInfo = prayer;
      }
    });
    // }

    if (SHOW_LASTTHIRD && currentPrayerInfo.name === 'Isha' && nextPrayerInfo.name !== 'Las3rd') {
      const las3rdPrayer = prayerTimes().find(p => p.name === 'Las3rd');
      if (las3rdPrayer) {
        nextPrayerInfo = {
          name: 'Las3rd',
          time: las3rdPrayer.time
        };
      }
    }

    setCurrentPrayer(currentPrayerInfo.name);

    if (nextPrayerInfo.name) {
      const [nextHours, nextMinutes] = nextPrayerInfo.time.split(':').map(Number);
      const nextPrayerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), nextHours, nextMinutes);
      const timeDiff = nextPrayerDate.getTime() - now.getTime();
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      setNextPrayer({
        name: nextPrayerInfo.name,
        time: nextPrayerInfo.time,
        countdown: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      });

      const diffMinutes = Math.floor(timeDiff / (1000 * 60));
      const diffSeconds = Math.floor(timeDiff / 1000);
      console.log(`diffMinutes: ${diffMinutes}, diffSeconds: ${diffSeconds}`);
      // Check if it's time to show Adhan
      if ((diffMinutes < BEFORE_DISPLAY_ADHAN_MINS) && diffMinutes >= 0 && displayMode() !== 'adhan') {
        if (displayMode() !== 'adhan') {
          toggleDisplayMode('adhan');
          console.log('show adhan screen!');
        }
      }
      // Set iqamahTriggerTime when we're within VITE_ADHAN_MINS of the next prayer
      if (!iqamahTriggerTime() && timeDiff <= VITE_ADHAN_MINS * 60 * 1000) {
        setIqamahTriggerTime(nextPrayerDate);
        console.log('Set iqamahTriggerTime for', nextPrayerInfo.name, 'at', nextPrayerDate);
      }

      // Check if it's time to show Iqamah
      if (iqamahTriggerTime() && now >= iqamahTriggerTime()! && now < addMinutes(iqamahTriggerTime()!, VITE_ADHAN_MINS)) {
        if (displayMode() !== 'iqamah') {
          toggleDisplayMode('iqamah');
          setLastTriggeredPrayer(nextPrayerInfo.name);
          console.log('show iqamah screen for', nextPrayerInfo.name);
        }
      } else if (iqamahTriggerTime() && now >= addMinutes(iqamahTriggerTime()!, VITE_ADHAN_MINS)) {
        // Reset iqamahTriggerTime after VITE_ADHAN_MINS have passed
        setIqamahTriggerTime(null);
      }
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
      if (!isDemo2()) {
        setCurrentDateTime(new Date());
      } else {
        setCurrentDateTime(prevTime => {
          const newSecondCounter = (demoSecondCounter() + 1) % 60;
          setDemoSecondCounter(newSecondCounter);

          if (newSecondCounter === 0) {
            // Increment by one minute every 60 seconds
            return addMinutes(prevTime, 1);
          } else {
            // Just update seconds
            return addSeconds(prevTime, 1);
          }
        });
      }

      updateCurrentAndNextPrayer();
      updateCurrentPrayerProgress();
    }, 1000);

    const toggleInterval = setInterval(() => {
      if (DISPLAY_HADITH && !isDemo() && !isDemo2()) {
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
    <Suspense fallback={<div>Loading...</div>}>
      <Show when={dict()}>
        <div class={styles.App}>
          {displayMode() === 'adhan' ? (
            <Adhan t={t} prayer={nextPrayer()} currentDateTime={currentDateTime()} toggleDisplayMode={toggleDisplayMode} onClose={() => toggleDisplayMode('prayerTimes')} />
          ) : displayMode() === 'iqamah' ? (
            <Iqamah t={t} prayer={nextPrayer()} currentDateTime={currentDateTime()} onClose={() => toggleDisplayMode('prayerTimes')} />
          ) : (
            <>
              <Header
                toggleFullScreen={toggleFullScreen}
                toggleDisplayMode={(mode: DisplayMode) => toggleDisplayMode(mode)}
                toggleDemo2={toggleDemo2}
                isDemo2={isDemo2()}
                location={location()}
                formattedDate={getFormattedDate(currentDateTime())}
                currentDateTime={currentDateTime()}
                displayMode={displayMode()}
                currentPrayer={currentPrayer()}
                nextPrayer={nextPrayer()}
                hijriDate={hijriDate()}
                t={t}
              />
              <div class={styles.contents} style={{ height: `${contentsHeight()}px` }}>
                {displayMode() === 'prayerTimes' && (
                  <Prayers
                    prayerTimes={prayerTimes()}
                    currentDateTime={currentDateTime()}
                    currentPrayer={currentPrayer()}
                    nextPrayer={nextPrayer()}
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
      </Show>
    </Suspense>
  );
};

export default App;