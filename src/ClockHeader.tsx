import { Component, createSignal, createEffect } from 'solid-js';
import styles from './App.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import allahImage from './assets/allah.png';
import muhammadImage from './assets/muhammad.png';
import EnhancedDigitalClock from './components/EnhancedDigitalClock';

const ClockHeader = () => {
  const [currentDateTime, setCurrentDateTime] = createSignal(new Date());

  createEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  });

  return (
    <div class={styles.headerRow}>
      <img src={muhammadImage} alt="Muhammad" class={styles.headerImage} />
      <div class={styles.dateTimeDisplay}>
        <div class={styles.locationDateRow}>
          <span class={styles.location}>{location()}</span>
          <span class={styles.date}>{currentDateTime().toDateString()}</span>
        </div>
        <EnhancedDigitalClock />
      </div>
      <img src={allahImage} alt="Allah" class={styles.headerImage} />
    </div>
  )
}

export default ClockHeader;