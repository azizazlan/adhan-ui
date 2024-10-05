import { Component, createSignal, createEffect } from 'solid-js';
import HeaderClock from './components/HeaderClock';
import styles from './Header.module.css';
import FlipClock from './components/FlipClock';
import { HijriDate } from './types/hijri';
import { DisplayMode } from './App';

const REMINDER_BEFORE_PRAYER_MINS = parseInt(import.meta.env.VITE_REMINDER_BEFORE_PRAYER_MINS || '60', 10);
const IS_DEMO = import.meta.env.VITE_DEMO === 'true';

const Header = (props: {
  toggleFullScreen: () => void,
  toggleDisplayMode: (mode: DisplayMode) => void,
  toggleDemo: () => void,
  isDemo: boolean,
  toggleDemo2: () => void,
  isDemo2: boolean,
  location: string,
  displayMode: string,
  currentPrayer: string,
  nextPrayer: string,
  formattedDate: string,
  hijriDate: HijriDate,
  currentDateTime: Date
}) => {
  // const [currentDateTime, setCurrentDateTime] = createSignal(new Date());

  // createEffect(() => {
  //   const timer = setInterval(() => {
  //     setCurrentDateTime(new Date());
  //   }, 1000);
  //   return () => clearInterval(timer);
  // });

  const isCountdownUnderThreshold = (countdown: string) => {
    const [hours, minutes] = countdown.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    return totalMinutes < REMINDER_BEFORE_PRAYER_MINS;
  };

  return (
    <div class={styles.container}>
      <div class={styles.headerTitleContainer}>
        <div class={styles.headerTitle} onClick={props.toggleFullScreen}>{props.formattedDate}</div>
        {props.hijriDate &&
          <div class={styles.hijriDateContainer}>
            <span class={styles.hijriDate}>{props.hijriDate.date.replace(/-/g, '/')} AH</span>
          </div>
        }
        <HeaderClock currentDateTime={props.currentDateTime} />
      </div>
      <div class={styles.locationContainer}>
        <div class={styles.location}>{import.meta.env.VITE_MOSQUE_NAME}</div>
        {/* Testing buttons */}
        <button class={styles.testButton} onClick={() => props.toggleDisplayMode('adhan')}>Adhan</button>
        <button class={styles.testButton} onClick={() => props.toggleDisplayMode('iqamah')}>Iqamah</button>
        <button
          class={styles.demoButton}
          onClick={props.toggleDemo}
          style={{
            color: props.isDemo ? 'red' : 'inherit',
            fontWeight: props.isDemo ? 'bold' : 'normal'
          }}
        >
          {props.isDemo ? 'Exit Demo' : 'Enter Demo'}
        </button>
        <span style={{ width: '7px' }}></span>
        <button
          class={styles.demoButton}
          onClick={props.toggleDemo2}
          style={{
            color: props.isDemo2 ? 'red' : 'inherit',
            fontWeight: props.isDemo2 ? 'bold' : 'normal'
          }}
        >
          {props.isDemo2 ? 'Exit Demo 2' : 'Enter Demo 2'}
        </button>
      </div>
      {props.displayMode === 'hadiths' &&
        <div class={styles.prayerTimeContainer}>
          <div class={styles.prayerName}>
            {`▸${props.nextPrayer.name}`.split('').map((letter, index) => (
              <span class={styles.yellowLetterBox} key={index}>{letter.toUpperCase()}</span>
            ))}
            {props.nextPrayer.name === 'Terbit' ? <span class={styles.letterBox}>🌤</span> : null}
            {props.nextPrayer.name === 'Sun' ? <span class={styles.letterBox}>🌤</span> : null}
          </div>
          <div class={styles.prayerName}>
            <span class={styles.yellowLetterBox} key={999}>{" "}</span>
          </div>
          <div class={styles.prayerName}>
            {props.nextPrayer.time.split('').map((letter, index) => {
              if (letter !== ' ') {
                return (
                  <span class={styles.letterBox} key={index}>{letter}</span>
                )
              }
            })}
            {props.nextPrayer.name === 'Sun' ? <span class={styles.letterBox}>🌤</span> : null}
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
      }
    </div>
  )
}

export default Header;