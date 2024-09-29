import { createSignal, onCleanup, For } from 'solid-js';
import styles from './FlipClock.module.css';

const DigitBox = (props: { digit: string; animate: boolean; index: number; isCurrentPrayer: boolean }) => (
  <div class={`${styles.digitBox} ${props.animate ? styles.animate : ''} ${props.isCurrentPrayer ? styles.currentPrayer : ''}`} style={{ "--index": props.index }}>
    <div class={styles.upperHalf} data-digit={props.digit}></div>
    <div class={styles.lowerHalf} data-digit={props.digit}></div>
    <div class={styles.flipCard}>
      <div class={styles.flipCardFront} data-digit={props.digit}></div>
      <div class={styles.flipCardBack} data-digit={props.digit}></div>
    </div>
  </div>
);

const FlipClock = (props: { time: string; isCurrentPrayer: boolean }) => {
  const [animate, setAnimate] = createSignal(false);
  const digits = () => props.time.replace(':', '').split('');

  const animationInterval = setInterval(() => {
    setAnimate(true);
    setTimeout(() => setAnimate(false), 1500); // Reset animation after 1500ms
  }, 5000); // Trigger animation every 5 seconds

  onCleanup(() => clearInterval(animationInterval));

  return (
    <div class={styles.flipClock}>
      <For each={digits()}>
        {(digit, index) => {
          if (digit !== ' ') return (
            <>
              <DigitBox
                digit={digit}
                animate={animate()}
                index={index()}
                isCurrentPrayer={props.isCurrentPrayer}
              />
              {index() === 1 && <div class={`${styles.separator} ${props.isCurrentPrayer ? styles.currentPrayer : ''}`}>:</div>}
            </>
          )
        }}
      </For>
    </div>
  );
};

export default FlipClock;