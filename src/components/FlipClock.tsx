import { createSignal, onCleanup, For } from 'solid-js';
import styles from './FlipClock.module.css';

const DigitBox = (props: { digit: string; animate: boolean; index: number; isCurrentPrayer: boolean, isCountdown: boolean }) => (
  <div class={`${styles.digitBox} ${props.animate ? styles.animate : ''} ${props.isCurrentPrayer ? styles.currentPrayer : ''} ${props.isCountdown ? styles.countdown : ''}`} style={{ "--index": props.index }}>
    <div class={styles.upperHalf} data-digit={props.digit}></div>
    <div class={styles.lowerHalf} data-digit={props.digit}></div>
    <div class={styles.flipCard}>
      <div class={styles.flipCardFront} data-digit={props.digit}></div>
      <div class={styles.flipCardBack} data-digit={props.digit}></div>
    </div>
  </div>
);

const CountdownDigitBox = (props: { digit: string; animate: boolean; index: number; isCurrentPrayer: boolean, isCountdown: boolean }) => (
  <div class={`${styles.countdownDigitBox} ${props.animate ? styles.animate : ''} ${props.isCurrentPrayer ? styles.currentPrayer : ''} ${props.isCountdown ? styles.countdown : ''}`} style={{ "--index": props.index }}>
    <div class={styles.countdownUpperHalf} data-digit={props.digit}></div>
    <div class={styles.countdownLowerHalf} data-digit={props.digit}></div>
    <div class={styles.countdownFlipCard}>
      <div class={styles.countdownFlipCardFront} data-digit={props.digit}></div>
      <div class={styles.countdownFlipCardBack} data-digit={props.digit}></div>
    </div>
  </div>
);

const FlipClock = (props: { time: string; isCurrentPrayer: boolean, isCountdown: boolean }) => {
  const [animate, setAnimate] = createSignal(false);
  const digits = () => {
    if (props.isCountdown) {
      // Format countdown time as hh:mm:ss
      const [hours, minutes, seconds] = props.time.split(':');
      return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`.split('');
    }
    return props.time.replace(':', '').split('');
  };
  const animationInterval = setInterval(() => {
    setAnimate(true);
    setTimeout(() => setAnimate(false), 1500); // Reset animation after 1500ms
  }, 60000);

  onCleanup(() => clearInterval(animationInterval));

  if (props.isCountdown) {
    return (
      <div class={styles.countdownContainer}>
        <div class={styles.countdownText}>DEPARTURE</div>
        <div class={styles.flipClock}>
          <For each={digits()}>
            {(digit, index) => {
              return (
                <>
                  <CountdownDigitBox
                    digit={digit}
                    animate={animate()}
                    index={index()}
                    isCurrentPrayer={props.isCurrentPrayer}
                    isCountdown={props.isCountdown}
                  />
                </>
              )
            }}
          </For>
        </div>
      </div>
    )
  }

  return (
    <div class={styles.flipClock}>
      <For each={digits()}>
        {(digit, index) => {
          if (digit !== ' ' && !props.isCountdown) return (
            <>
              <DigitBox
                digit={digit}
                animate={animate()}
                index={index()}
                isCurrentPrayer={props.isCurrentPrayer}
                isCountdown={props.isCountdown}
              />
              {(index() === 1) && <div class={`${styles.separator} ${props.isCurrentPrayer ? styles.currentPrayer : ''}`}>:</div>}
            </>
          )
        }}
      </For>
    </div>
  );
};

export default FlipClock;