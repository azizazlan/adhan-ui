import { createSignal, createEffect, onCleanup } from 'solid-js';
import { format } from 'date-fns';
import styles from './Countdown.module.scss';

const IQAMAH_INTERVAL_MINS = parseInt(import.meta.env.VITE_IQAMAH_INTERVAL_MINS || '12', 10);

interface CountdownProps {
  secondsLeft: number;
}

const Countdown: Component = (props: CountdownProps) => {
  const { secondsLeft } = props;
  const [timeLeft, setTimeLeft] = createSignal(secondsLeft); // Convert minutes to seconds

  createEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    onCleanup(() => clearInterval(timer));
  });

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div class={styles.container}>
      {formatTime(timeLeft())}
    </div>
  );
};

export default Countdown;
