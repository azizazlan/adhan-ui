import { Component, createSignal, createEffect } from 'solid-js';
import { VsBook } from 'solid-icons/vs';
import { OcStopwatch2 } from 'solid-icons/oc'
import EnhancedDigitalClock from './components/EnhancedDigitalClock';
import logo from './assets/logo.png';
import styles from './ClockHeader.module.css';
import FlipClock from './components/FlipClock';
import { HijriDate } from './types/hijri';

const TIMER_THRESHOLD_MINS = parseInt(import.meta.env.VITE_TIMER_THRESHOLD_MINS || '60', 10);

const ClockHeader = (props: {
  toggleFullScreen: () => void,
  toggleDisplayHadith: () => void,
  location: string,
  showPrayerTimes: boolean,
  currentPrayer: string,
  nextPrayer: string,
  formattedDate: string,
  hijriDate: HijriDate
}) => {
  const [currentDateTime, setCurrentDateTime] = createSignal(new Date());

  createEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  });

  const isCountdownUnderThreshold = (countdown: string) => {
    const [hours, minutes] = countdown.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    return totalMinutes < TIMER_THRESHOLD_MINS;
  };

  // console.log(props.hijriDate.day);

  return (
    <div class={styles.container}>
      <div class={styles.headerTitleContainer}>
        <div class={styles.headerTitle} onClick={props.toggleFullScreen}>PRAYER TIMES</div>
        <EnhancedDigitalClock />
      </div>
      <div class={styles.toolbar}>
        <VsBook
          class={`${styles.bookIcon} ${!props.showPrayerTimes ? styles.activeBookIcon : ''}`}
          onClick={props.toggleDisplayHadith}
        />
        <div class={styles.locationAndDateContainer}>
          <div>
            <span class={styles.location}>{props.location}</span>
            &nbsp;
            <span class={styles.date}>{props.formattedDate}</span>
            &nbsp;
            {props.hijriDate &&
              <>
                <span class={styles.hijriDate}>{props.hijriDate.day} {props.hijriDate.month.en} / {props.hijriDate.date}</span>
              </>
            }
          </div>
        </div>
      </div>
      {!props.showPrayerTimes && (
        <div class={styles.prayerTimeContainer}>
          <span class={styles.label}>
            NEXT▸
          </span>
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
          <span class={styles.label2}>
            <OcStopwatch2 class={styles.icon2} />
          </span>
          <div class={styles.prayerName}>
            {props.nextPrayer.countdown.split('').map((letter, index) => {
              if (letter !== ' ') {
                return (
                  <span
                    style={{ color: isCountdownUnderThreshold(props.nextPrayer.countdown) ? 'red' : 'white' }}
                    class={styles.letterBox} key={index}>{letter}</span>
                )
              }
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default ClockHeader;