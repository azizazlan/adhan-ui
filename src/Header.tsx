import { Component, createSignal, createEffect } from 'solid-js';
import HeaderClock from './components/HeaderClock';
import styles from './Header.module.css';
import FlipClock from './components/FlipClock';
import { HijriDate } from './types/hijri';

const REMINDER_BEFORE_PRAYER_MINS = parseInt(import.meta.env.VITE_REMINDER_BEFORE_PRAYER_MINS || '60', 10);

const Header = (props: {
  toggleFullScreen: () => void,
  location: string,
  displayMode: string,
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
    return totalMinutes < REMINDER_BEFORE_PRAYER_MINS;
  };

  return (
    <div class={styles.container}>
      <div class={styles.headerTitleContainer}>
        <div class={styles.headerTitle} onClick={props.toggleFullScreen}>PRAYER TIMES</div>
        <HeaderClock />
      </div>
      <div class={styles.locationAndDateContainer}>
        <div class={styles.location}>{props.location}</div>
        <div class={styles.dateContainer}>
          <span class={styles.gregorianDate}>{props.formattedDate}</span>
          {props.hijriDate &&
            <>
              <span class={styles.hijriDate}>{props.hijriDate.day} {props.hijriDate.month.en} / {props.hijriDate.date}</span>
            </>
          }
        </div>
      </div>
      <div class={styles.prayerTimeContainer}>
        <div class={styles.prayerName}>
          {`▸${props.nextPrayer.name + " "}`.split('').map((letter, index) => (
            <span class={styles.yellowLetterBox} key={index}>{letter.toUpperCase()}</span>
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

        <div class={styles.prayerName}>
          <span class={styles.letterBox} key={999}>{" "}</span>
        </div>

        <div class={styles.prayerName}>
          {props.nextPrayer.countdown.split('').map((letter, index) => {
            if (letter !== ' ') {
              return (
                <span
                  style={{ color: isCountdownUnderThreshold(props.nextPrayer.countdown) ? 'red' : 'gold' }}
                  class={styles.yellowLetterBox} key={index}>{letter}</span>
              )
            }
          })}
        </div>
      </div>
    </div>
  )
}

export default Header;