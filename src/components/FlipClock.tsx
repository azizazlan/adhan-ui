// FlipClock.tsx
import { For } from 'solid-js';
import styles from './FlipClock.module.css';

const DigitBox = (props: { digit: string; isCurrentPrayer: boolean }) => (
  <div class={`${styles.digitBox} ${props.isCurrentPrayer ? styles.current : ''}`}>
    <div class={styles.digit}>{props.digit}</div>
  </div>
);

const FlipClock = (props: { time: string; isCurrentPrayer: boolean }) => {
  const digits = () => props.time.replace(':', '').split('');

  return (
    <div class={styles.flipClock}>
      <For each={digits()}>
        {(digit, index) => (
          <>
            <DigitBox digit={digit} isCurrentPrayer={props.isCurrentPrayer} />
            {index() === 1 && <div class={styles.separator}>:</div>}
          </>
        )}
      </For>
    </div>
  );
};

export default FlipClock;