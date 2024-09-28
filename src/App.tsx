import { Component, createSignal, createEffect } from 'solid-js';
import styles from './App.module.css';
import allahImage from './assets/allah.png';
import muhammadImage from './assets/muhammad.png';

const API_URL = 'http://api.aladhan.com/v1/timings/today?latitude=3.1579&longitude=101.5956&method=17&timezonestring=Asia/Kuala_Lumpur&tune=0,10,0,1,0,1,0,1,0';

const App: Component = () => {
  const [currentDateTime, setCurrentDateTime] = createSignal(new Date());
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
        countdown: `${hours}h ${minutes}m ${seconds}s`
      });
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
    }, 1000);
    return () => clearInterval(timer);
  });

  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <div class={styles.headerRow}>
          <img src={muhammadImage} alt="Muhammad" class={styles.headerImage} />
          <div class={styles.dateTimeDisplay}>
            <div class={styles.locationDateRow}>
              <span class={styles.location}>{location()}</span>
              <span class={styles.date}>{currentDateTime().toDateString()}</span>
            </div>
            <div class={styles.time}>{formatTime(currentDateTime())}</div>
          </div>
          <img src={allahImage} alt="Allah" class={styles.headerImage} />
        </div>
        <div class={styles.prayerTimes}>
          {prayerTimes().map((prayer) => (
            <div class={`${styles.prayerTime} 
                         ${prayer.name === currentPrayer() ? styles.currentPrayer :
                (isPrayerTimePast(prayer.time) ? styles.pastPrayer : '')}`}>
              <div class={styles.prayerInfo}>
                <span class={styles.prayerName}>{prayer.name}</span>
                <span class={`${styles.prayerTimeValue} 
                              ${prayer.name === currentPrayer() ? styles.currentPrayerTime : ''}`}>
                  {formatPrayerTime(prayer.time)}
                </span>
              </div>
              {prayer.name === nextPrayer().name && (
                <div class={styles.countdown}>{nextPrayer().countdown}</div>
              )}
            </div>
          ))}
        </div>
      </header>
    </div>
  );
};

export default App;