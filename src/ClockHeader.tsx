import { Component, createSignal, createEffect } from 'solid-js';
import EnhancedDigitalClock from './components/EnhancedDigitalClock';
import logo from './assets/logo.png';
import styles from './ClockHeader.module.css';
import FlipClock from './components/FlipClock';

const ClockHeader = (props: { toggleFullScreen: () => void, location: string, formatDate: string, showPrayerTimes: boolean, currentPrayer: string, nextPrayer: string }) => {
  const [currentDateTime, setCurrentDateTime] = createSignal(new Date());

  createEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  });

  return (
    <div>
      <div>
        <div class={styles.headerRow}>
          <div class={styles.headerTitle} onClick={props.toggleFullScreen}>PRAYER TIMES</div>
          <EnhancedDigitalClock />
        </div>
        <div class={styles.locationRow}>
          <div class={styles.locationText}>{props.location}, {props.formatDate}</div>
        </div>
        {!props.showPrayerTimes && (
          <div class={styles.prayerTimeContainer}>
            <span class={styles.label}>ARRIVED</span>
            <div class={styles.prayerName}>
              {props.currentPrayer.split('').map((letter, index) => (
                <span class={styles.letterBox} key={index}>{letter.toUpperCase()}</span>
              ))}
            </div>
            <span class={styles.label}>DEPARTURE</span>
            <div class={styles.prayerName}>
              {props.nextPrayer.name.split('').map((letter, index) => (
                <span class={styles.letterBox} key={index}>{letter.toUpperCase()}</span>
              ))}
            </div>
            <div class={styles.prayerName}>
              {props.nextPrayer.time.split('').map((letter, index) => {
                if (letter !== ' ') {
                  return (
                    <span class={styles.letterBox} key={index}>{letter}</span>
                  )
                }
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ClockHeader;