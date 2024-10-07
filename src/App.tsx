import { Component, createSignal, createEffect, createMemo, Suspense, Show, createResource, onCleanup } from 'solid-js';
import * as i18n from "@solid-primitives/i18n";
import 'bootstrap/dist/css/bootstrap.min.css';
import { format, addDays, addMinutes, addSeconds, subHours, subMinutes, subSeconds, isValid, parse } from 'date-fns';
import styles from './App.module.scss';
import Header from './components/headers';
import { Footer } from './components/footers';
import Hadiths from './components/hadiths';
import Settings from './components/settings';
import { Credits } from './components/legal';
import PrayersList from './components/prayers';
import Adhan from './components/adhan';
import Iqamah from './components/iqamah';
import { formatPrayerTime, formatCountdown, formatTime, getFormattedDate } from './utils/formatter';
import { getPrayerName } from './utils/prayername';
import { Hadith, HadithApiResponse } from './types/hadith';
import { isPrayerTimePast } from './utils/helper';
import getWindowDimensions from './utils/getWindowDimensions';

const API_KEY = import.meta.env.VITE_HADITH_API_KEY;
const SHOW_LASTTHIRD = import.meta.env.VITE_SHOW_LASTTHIRD === 'true';
const ROTATE_BETWEEN_PRAYERTIMES_HADITHS_INTERVAL_MS = Math.max(0, parseInt(import.meta.env.VITE_ROTATE_BETWEEN_PRAYERTIMES_HADITHS_INTERVAL_MS || '10000', 10));
const BEFORE_DISPLAY_ADHAN_MINS = Math.max(0, parseInt(import.meta.env.VITE_BEFORE_DISPLAY_ADHAN_MINS || '15', 10));
const BETWEEN_ADHAN_IQAMAH_MINS = Math.max(0, parseInt(import.meta.env.VITE_BETWEEN_ADHAN_IQAMAH_MINS || '10', 10));
const LOCATION = import.meta.env.VITE_LOCATION;
const LATITUDE = import.meta.env.VITE_LATITUDE;
const LONGITUDE = import.meta.env.VITE_LONGITUDE;
const TIMEZONE = import.meta.env.VITE_TIMEZONE;
const TUNE = import.meta.env.VITE_TUNE;
const DISPLAY_HADITH: boolean = import.meta.env.VITE_DISPLAY_HADITH === 'true';
const API_URL = `https://api.aladhan.com/v1/timings/today?latitude=${LATITUDE}&longitude=${LONGITUDE}&method=17&timezonestring=${TIMEZONE}&tune=${TUNE}`;
const API_HIJRI = "https://api.aladhan.com/v1/gToH/";
const LANGUAGE = import.meta.env.VITE_LANGUAGE;

export type DisplayMode = 'prayerslist' | 'hadiths' | 'credits' | 'settings' | 'adhan' | 'iqamah';

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
  const [time, setTime] = createSignal(new Date());
  const [prayers, setPrayers] = createSignal([]);
  const [location] = createSignal(LOCATION);
  const [displayMode, setDisplayMode] = createSignal<DisplayMode>('prayerslist');

  createEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  });

  const toggleDisplayMode = (mode: DisplayMode) => {
    setDisplayMode(prev => prev === mode ? 'prayerTimes' : mode);
  };

  const toggleTestSubuh = () => {
  };

  const fetchPrayers = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      const timings = data.data.timings;
      if (SHOW_LASTTHIRD) {
        setPrayers([
          { name: getPrayerName(LANGUAGE, 'Fajr'), time: timings.Fajr },
          { name: getPrayerName(LANGUAGE, 'Sunrise'), time: timings.Sunrise },
          { name: getPrayerName(LANGUAGE, 'Dhuhr'), time: timings.Dhuhr },
          { name: getPrayerName(LANGUAGE, 'Asr'), time: timings.Asr },
          { name: getPrayerName(LANGUAGE, 'Maghrib'), time: timings.Maghrib },
          { name: getPrayerName(LANGUAGE, 'Isha'), time: timings.Isha },
          { name: getPrayerName(LANGUAGE, 'Las3rd'), time: timings.Lastthird },
        ]);
      } else {
        setPrayers([
          { name: getPrayerName(LANGUAGE, 'Fajr'), time: timings.Fajr },
          { name: getPrayerName(LANGUAGE, 'Sunrise'), time: timings.Sunrise },
          { name: getPrayerName(LANGUAGE, 'Dhuhr'), time: timings.Dhuhr },
          { name: getPrayerName(LANGUAGE, 'Asr'), time: timings.Asr },
          { name: getPrayerName(LANGUAGE, 'Maghrib'), time: timings.Maghrib },
          { name: getPrayerName(LANGUAGE, 'Isha'), time: timings.Isha },
        ]);
      }
    } catch (error) {
      console.error('Error fetching prayer times:', error);
    }
  };

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

  createEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    onCleanup(() => clearInterval(timer));
  });

  createEffect(() => {
    fetchPrayers();
  });

  return (
    <Show when={dict() && prayers().length > 0} fallback={<div>Loading...</div>}>
      <div class={styles.App}>
        <Header time={time()} t={t} toggleDisplayMode={toggleDisplayMode} toggleTestSubuh={toggleTestSubuh} />
        <div class={styles.contents} style={{ height: `${getWindowDimensions().height - 169}px` }}>
          {displayMode() === 'prayerslist' ? (
            <PrayersList
              t={t}
              prayers={prayers()}
              toggleDisplayMode={toggleDisplayMode}
            />
          ) : displayMode() === 'adhan' ? (
            <Adhan prayers={prayers()} />
          ) : displayMode() === 'iqamah' ? (
            <Iqamah prayers={prayers()} />
          ) : (
            <PrayersList
              t={t}
              prayers={prayers()}
              toggleDisplayMode={toggleDisplayMode}
            />
          )}
        </div>
      </div>
    </Show>
  );
};

export default App;