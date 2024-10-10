import { Component, createSignal, createEffect, createMemo, Suspense, Show, createResource, onCleanup, onMount } from 'solid-js';
import * as i18n from "@solid-primitives/i18n";
import 'bootstrap/dist/css/bootstrap.min.css';
import { differenceInMinutes, differenceInSeconds, format, addDays, addSeconds, setHours, setMinutes, isAfter, isBefore, startOfDay, parse, set, subMinutes, subSeconds } from 'date-fns';
import styles from './App.module.scss';
import { formatPrayerTime, formatCountdown, formatTime, getFormattedDate } from './utils/formatter';
import { getPrayerName } from './utils/prayername';
import { Prayer, PrayerMode } from './types/prayer';
import { DisplayMode } from './types/displaymode';
import { isPrayerTimePast } from './utils/helper';
import getWindowDimensions from './utils/getWindowDimensions';
import { NextPrayerLayout } from './components/layouts';

const API_KEY = import.meta.env.VITE_HADITH_API_KEY;
const LOCATION = import.meta.env.VITE_LOCATION;
const LATITUDE = import.meta.env.VITE_LATITUDE;
const LONGITUDE = import.meta.env.VITE_LONGITUDE;
const TIMEZONE = import.meta.env.VITE_TIMEZONE;
const TUNE = import.meta.env.VITE_TUNE;
const API_URL = `https://api.aladhan.com/v1/timings/today?latitude=${LATITUDE}&longitude=${LONGITUDE}&method=17&timezonestring=${TIMEZONE}&tune=${TUNE}`;
const API_HIJRI = "https://api.aladhan.com/v1/gToH/";
const LANGUAGE = import.meta.env.VITE_LANGUAGE;
const ADHAN_LEAD_MINS = parseInt(import.meta.env.VITE_ADHAN_LEAD_MINS || '30', 10);
const ADHAN_LEAD_MINS_TEST = parseInt(import.meta.env.VITE_ADHAN_LEAD_MINS_TEST || '1', 10);

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

  const t = i18n.translator(dict);
  const [isDemo, setIsDemo] = createSignal(false);
  const [location] = createSignal(LOCATION);
  const [currentTime, setCurrentTime] = createSignal(new Date());
  const memoizedCurrentTime = createMemo(() => currentTime());

  const [displayMode, setDisplayMode] = createSignal<DisplayMode>(DisplayMode.DEFAULT);
  const memoizedDisplayMode = createMemo(() => displayMode());

  const [prayers, setPrayers] = createSignal<Prayer[]>([]);
  const [leadPrayer, setLeadPrayer] = createSignal<Prayer | null>(null);
  const memoizedLeadPrayer = createMemo(() => leadPrayer());

  const [lastApiTimestamp, setLastApiTimestamp] = createSignal<number>(0);
  const memoizedLastApiTimestamp = createMemo(() => lastApiTimestamp());

  const [lastFetchDate, setLastFetchDate] = createSignal<Date>(new Date());
  const [secondsLeft, setSecondsLeft] = createSignal<number>(0);

  const [isTestMode, setIsTestMode] = createSignal(false);
  const memoizedIsTestMode = createMemo(() => isTestMode());
  const [testStartTime, setTestStartTime] = createSignal<Date | null>(null);

  const toggleTestScreenIqamah = () => {
    setDisplayMode(DisplayMode.IQAMAH);
  };

  const checkAndFetchPrayers = () => {
    const now = new Date();
    if (isAfter(now, startOfDay(addDays(lastFetchDate(), 1)))) {
      fetchPrayers();
    }
  };

  const checkPrayerProgress = () => {
    const leadPrayer = prayers().find(prayer => prayer.mode === PrayerMode.IMMEDIATE_NEXT && prayer.name !== 'Syuruk');
    if (leadPrayer) {
      setLeadPrayer(leadPrayer);
      const leadPrayerTime = parse(leadPrayer.time, 'HH:mm', currentTime());
      const secLeft = differenceInSeconds(leadPrayerTime, currentTime());
      setSecondsLeft(secLeft);

      const leadMins = isTestMode() ? ADHAN_LEAD_MINS_TEST : ADHAN_LEAD_MINS;
      if (displayMode() !== DisplayMode.IQAMAH && displayMode() !== DisplayMode.ADHAN && leadMins === differenceInMinutes(leadPrayerTime, currentTime()) + 1) {
        console.log('toggleDisplayMode - adhan', leadPrayer.name);
        setDisplayMode(DisplayMode.ADHAN);
      }
      if (displayMode() === DisplayMode.ADHAN && secondsLeft() === 0) {
        console.log('toggleDisplayMode - iqamah', leadPrayer.name);
        setDisplayMode(DisplayMode.IQAMAH);
      }
      if (secLeft <= 0 && displayMode() !== DisplayMode.IQAMAH) {
        console.log('toggleDisplayMode - iqamah', leadPrayer.name);
        setDisplayMode(DisplayMode.IQAMAH);
      }
    }
  };

  createEffect(() => {
    // Initial fetch
    fetchPrayers();
    // Set up interval to check and fetch prayers daily
    const dailyCheckInterval = setInterval(checkAndFetchPrayers, 60000); // Check every minute
  });

  createEffect(() => {
    memoizedLeadPrayer()
    memoizedCurrentTime();
    memoizedLastApiTimestamp();
    memoizedIsTestMode();
  });

  onMount(() => {
    fetchPrayers();

    const dailyCheckInterval = setInterval(checkAndFetchPrayers, 60000);

    const updateTimeInterval = setInterval(() => {
      if (isTestMode()) {
        setCurrentTime(prevTime => addSeconds(prevTime, 1));
      } else {
        setCurrentTime(new Date());
      }
    }, 1000);

    const checkPrayerProgIntval = setInterval(() => {
      checkPrayerProgress();
    }, 1000);

    onCleanup(() => {
      clearInterval(dailyCheckInterval);
      clearInterval(updateTimeInterval);
      clearInterval(checkPrayerProgIntval);
    });
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

  const toggleTestSubuh = () => {
    const newTestMode = !isTestMode();
    setIsTestMode(newTestMode);

    if (newTestMode) {
      const subuhPrayer = prayers().find(prayer => prayer.name === 'Fajr' || prayer.name === 'Subuh');

      if (subuhPrayer) {
        const now = new Date();
        const [hours, minutes] = subuhPrayer.time.split(':').map(Number);

        let subuhTime = set(now, { hours, minutes, seconds: 0, milliseconds: 0 });

        if (subuhTime < now) {
          subuhTime = set(subuhTime, { date: subuhTime.getDate() + 1 });
        }
        let nMinuteBeforeSubuh = subMinutes(subuhTime, ADHAN_LEAD_MINS_TEST);
        nMinuteBeforeSubuh = addSeconds(nMinuteBeforeSubuh, 55); // Make it quicker I can't wait one minute!
        setTestStartTime(nMinuteBeforeSubuh);
        setCurrentTime(nMinuteBeforeSubuh);
        setPrayers(prev => updatedPrayers());
        // console.log('Test mode activated. Current time set to:', oneMinuteBeforeSubuh.toLocaleString());
      } else {
        console.error('Subuh prayer not found');
        setIsTestMode(false);
      }
    } else {
      setCurrentTime(new Date());
      setTestStartTime(null);
      console.log('Test mode deactivated. Returned to current time.');
    }
  };

  const fetchPrayers = async () => {
    console.log('fetchPrayers')
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      console.log(data);
      const timings = data.data.timings;
      setPrayers([
        { name: getPrayerName(LANGUAGE, 'Fajr'), time: timings.Fajr, mode: PrayerMode.INACTIVE },
        { name: getPrayerName(LANGUAGE, 'Sunrise'), time: timings.Sunrise, mode: PrayerMode.INACTIVE },
        { name: getPrayerName(LANGUAGE, 'Dhuhr'), time: timings.Dhuhr, mode: PrayerMode.INACTIVE },
        { name: getPrayerName(LANGUAGE, 'Asr'), time: timings.Asr, mode: PrayerMode.INACTIVE },
        { name: getPrayerName(LANGUAGE, 'Maghrib'), time: timings.Maghrib, mode: PrayerMode.INACTIVE },
        { name: getPrayerName(LANGUAGE, 'Isha'), time: timings.Isha, mode: PrayerMode.INACTIVE },
      ]);
      setLastFetchDate(new Date());
      const timestamp = parseInt(data.data.date.timestamp, 10);
      console.log(`timestamp: ${timestamp}`);
      setLastApiTimestamp(timestamp);
    } catch (error) {
      console.error('Error fetching prayer times:', error);
    }
  };

  const toggleRefetch = () => {
    console.log('toggleRefetch');
    fetchPrayers();
  };

  const updatedPrayers = createMemo(() => {
    const now = currentTime();
    // console.log('Updating prayers. Current time:', format(now, 'HH:mm:ss'));
    let activeIndex = -1;

    // Find the active prayer
    for (let i = 0; i < prayers().length; i++) {
      const prayer = prayers()[i];
      const nextPrayer = prayers()[(i + 1) % prayers().length];

      const prayerTime = parse(prayer.time, 'HH:mm', now);
      const nextPrayerTime = parse(nextPrayer.time, 'HH:mm',
        i === prayers().length - 1 ? addDays(now, 1) : now
      );

      if (isAfter(now, prayerTime) && isBefore(now, nextPrayerTime)) {
        activeIndex = i;
        // console.log(`Active prayer found: ${prayer.name}`);
        break;
      }
    }

    // Update prayer modes
    return prayers().map((prayer, index) => {
      let mode;
      if (index === activeIndex) {
        mode = PrayerMode.ACTIVE;
      } else if (index === (activeIndex + 1) % prayers().length && prayer.name !== 'Syuruk') {
        setLeadPrayer(prayer);
        mode = PrayerMode.IMMEDIATE_NEXT;
      } else if (index > activeIndex || (activeIndex === -1 && index < prayers().length - 1)) {
        mode = PrayerMode.NEXT;
      } else {
        mode = PrayerMode.INACTIVE;
      }
      return { ...prayer, mode };
    });
  });

  return (
    <Show when={dict() && prayers().length > 0} fallback={<div>Loading...</div>}>
      <div class={styles.App}>
        <div class={styles.contents} style={{ height: `${getWindowDimensions().height}px` }}>
          <NextPrayerLayout
            isTestMode={memoizedIsTestMode()}
            displayMode={memoizedDisplayMode()}
            prayers={updatedPrayers()}
            leadPrayer={memoizedLeadPrayer()}
            currentTime={memoizedCurrentTime()}
            lastApiTimestamp={memoizedLastApiTimestamp()}
            toggleTestSubuh={toggleTestSubuh}
            toggleRefetch={toggleRefetch}
            toggleTestScreenIqamah={toggleTestScreenIqamah}
          />
        </div>
      </div>
    </Show>
  );
};

export default App;