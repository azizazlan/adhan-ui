import { Component, createSignal, createEffect } from 'solid-js';
import { ProgressBar } from 'solid-bootstrap';
import styles from './App.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PrayerTimeItem from './components/PrayerTimeItem';
import ClockHeader from './ClockHeader';
import FlipClock from './components/FlipClock';

const API_URL = 'http://api.aladhan.com/v1/timings/today?latitude=3.1579&longitude=101.5956&method=17&timezonestring=Asia/Kuala_Lumpur&tune=0,10,0,1,0,1,0,1,0';

const App: Component = () => {
  const [currentDateTime, setCurrentDateTime] = createSignal(new Date());
  const [currentPrayerProgress, setCurrentPrayerProgress] = createSignal(0);
  const [currentPrayerRemaining, setCurrentPrayerRemaining] = createSignal('');
  const [prayerTimes, setPrayerTimes] = createSignal([]);
  const [currentPrayer, setCurrentPrayer] = createSignal('');
  const [nextPrayer, setNextPrayer] = createSignal({ name: '', time: '', countdown: '' });
  const [location] = createSignal('Shah Alam, Malaysia');

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
    return () => clearInterval(timer);
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
    <div class={styles.App} onClick={toggleFullScreen}>
      <header class={styles.header}>
        <ClockHeader location={location()} />
        <div class={styles.prayerTimes}>
          {prayerTimes().map((prayer) => (
            <div>
              <PrayerTimeItem
                prayer={prayer}
                currentPrayer={currentPrayer()}
                nextPrayer={nextPrayer()}
                isPrayerTimePast={isPrayerTimePast}
                formatPrayerTime={formatPrayerTime}
              />
              {prayer.name === nextPrayer().name && (
                <div class={styles.countdown}>
                  <FlipClock
                    time={nextPrayer().countdown}
                    isCurrentPrayer={false}
                    isCountdown={true}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </header>
    </div>
  );
};

export default App;