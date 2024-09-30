import { Component, createSignal, createEffect } from 'solid-js';
import { ProgressBar } from 'solid-bootstrap';
import styles from './App.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PrayerTimeItem from './components/PrayerTimeItem';
import ClockHeader from './ClockHeader';
import FlipClock from './components/FlipClock';
import HadithDisplay from './components/HadithDisplay';
import { Hadith, HadithApiResponse } from './types/hadith';

const API_KEY = import.meta.env.VITE_HADITH_API_KEY;
const SHOW_PRAYER_TIMES_INTERVAL_MS = Math.max(0, parseInt(import.meta.env.VITE_SHOW_PRAYER_TIMES_INTERVAL_MS || '10000', 10));
const LOCATION = import.meta.env.VITE_LOCATION;
const LATITUDE = import.meta.env.VITE_LATITUDE;
const LONGITUDE = import.meta.env.VITE_LONGITUDE;
const TIMEZONE = import.meta.env.VITE_TIMEZONE;
const TUNE = import.meta.env.VITE_TUNE;
const DISPLAY_HADITH: boolean = import.meta.env.VITE_DISPLAY_HADITH === 'true';
const API_URL = `http://api.aladhan.com/v1/timings/today?latitude=${LATITUDE}&longitude=${LONGITUDE}&method=17&timezonestring=${TIMEZONE}&tune=${TUNE}`;

const App: Component = () => {
  const [currentDateTime, setCurrentDateTime] = createSignal(new Date());
  const [currentPrayerProgress, setCurrentPrayerProgress] = createSignal(0);
  const [currentPrayerRemaining, setCurrentPrayerRemaining] = createSignal('');
  const [prayerTimes, setPrayerTimes] = createSignal([]);
  const [currentPrayer, setCurrentPrayer] = createSignal('');
  const [nextPrayer, setNextPrayer] = createSignal({ name: '', time: '', countdown: '' });
  const [location] = createSignal(LOCATION);
  const [showPrayerTimes, setShowPrayerTimes] = createSignal(true);

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

  const isPrayerTimePast = (prayerTime: string) => {
    const now = currentDateTime();
    const [hours, minutes] = prayerTime.split(':').map(Number);
    const prayerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    return prayerDate < now;
  };

  const updateCurrentAndNextPrayer = () => {
    const now = currentDateTime();
    let currentPrayerInfo = { name: '', date: new Date(0) };
    let nextPrayerInfo = { name: '', date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) };

    prayerTimes().forEach(prayer => {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

      if (prayerDate <= now && prayerDate > currentPrayerInfo.date) {
        currentPrayerInfo = { name: prayer.name, date: prayerDate };
      } else if (prayerDate > now && prayerDate < nextPrayerInfo.date) {
        nextPrayerInfo = { name: prayer.name, date: prayerDate };
      }
    });

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
        { name: 'Dhuhr', time: timings.Dhuhr },
        { name: 'Asr', time: timings.Asr },
        { name: 'Maghrib', time: timings.Maghrib },
        { name: 'Isha', time: timings.Isha },
      ]);
      updateCurrentAndNextPrayer();
    } catch (error) {
      console.error('Error fetching prayer times:', error);
    }
  };

  createEffect(() => {
    fetchPrayerTimes();
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
        <ClockHeader toggleFullScreen={toggleFullScreen} toggleDisplayHadith={toggleDisplayHadith} location={location()}
          formatDate={currentDateTime().toDateString()}
          showPrayerTimes={showPrayerTimes()}
          currentPrayer={currentPrayer()}
          nextPrayer={nextPrayer()}
        />
        {showPrayerTimes() ? (
          <div class={styles.prayerTimes}>
            {prayerTimes().map((prayer) => (
              <div>
                {prayer.name === nextPrayer().name && (
                  <div class={styles.countdown}>
                    <FlipClock
                      time={nextPrayer().countdown}
                      isCurrentPrayer={false}
                      isCountdown={true}
                    />
                  </div>
                )}
                <PrayerTimeItem
                  prayer={prayer}
                  currentPrayer={currentPrayer()}
                  nextPrayer={nextPrayer()}
                  isPrayerTimePast={isPrayerTimePast}
                  formatPrayerTime={formatPrayerTime}
                />
              </div>
            ))}
          </div>
        ) : (
          <div class={styles.prayerTimes}>
            <HadithDisplay apiKey={API_KEY} />
          </div>
        )}
      </header>
    </div>
  );
};

export default App;