import { createSignal, onCleanup, For } from 'solid-js';
import { OcStopwatch2 } from 'solid-icons/oc'
import styles from './FlipClock.module.css';

const DigitBox = (props: { digit: string; animate: boolean; index: number; isCurrentPrayer: boolean, isPrayerTimePast: boolean, isCountdown: boolean }) => (
  <div class={`${styles.digitBox} ${props.animate ? styles.animate : ''} ${props.isCurrentPrayer ? styles.currentPrayer : ''} ${props.isPrayerTimePast ? styles.past : ''}  ${props.isCountdown ? styles.countdown : ''}`} style={{ "--index": props.index }}>
    <div class={styles.upperHalf} data-digit={props.digit}></div>
    <div class={styles.lowerHalf} data-digit={props.digit}></div>
    <div class={styles.flipCard}>
      <div class={styles.flipCardFront} data-digit={props.digit}></div>
      <div class={styles.flipCardBack} data-digit={props.digit}></div>
    </div>
  </div>
);

const FlipClock = (props: { time: string; isCurrentPrayer: boolean, isPrayerTimePast: boolean }) => {
  const [animate, setAnimate] = createSignal(false);

  const animationInterval = setInterval(() => {
    setAnimate(true);
    setTimeout(() => setAnimate(false), 1500); // Reset animation after 1500ms
  }, 60000);

  onCleanup(() => clearInterval(animationInterval));

  return (
    <div class={styles.flipClock}>
      <For each={props.time}>
        {(digit, index) => {
          if (digit !== ' ' && !props.isCountdown) return (
            <DigitBox
              digit={digit}
              animate={animate()}
              index={index()}
              isCurrentPrayer={props.isCurrentPrayer}
              isCountdown={props.isCountdown}
              isPrayerTimePast={props.isPrayerTimePast}
            />
          )
        }}
      </For>
    </div>
  );
};

export default FlipClock;