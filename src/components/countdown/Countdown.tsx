import { Component } from 'solid-js';
import styles from './Countdown.module.scss';

const REMINDER_BEFORE_PRAYER_MINS = parseInt(import.meta.env.VITE_REMINDER_BEFORE_PRAYER_MINS || '60', 10);

const Countdown: Component = (props: { onClose: () => void }) => {

  const isCountdownUnderThreshold = (countdown: string) => {
    const [hours, minutes] = countdown.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    return totalMinutes < REMINDER_BEFORE_PRAYER_MINS;
  };

  return (
    <div class={styles.countdown}>
      {props.nextPrayer.countdown.split('').map((letter, index) => (
        letter !== ' ' && (
          <span
            class={styles.countdownLetterBox}
            style={{ color: isCountdownUnderThreshold(props.nextPrayer.countdown) ? 'red' : 'inherit' }}
            key={index}
          >
            {letter}
          </span>
        )
      ))}
    </div>
  );
};

export default Countdown;