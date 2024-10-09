import { Component, createEffect, createSignal, onCleanup } from 'solid-js';
import { Badge, Card } from 'solid-bootstrap';
import styles from './Iqamah.module.scss';
import { Countdown } from '../countdown';

const IQAMAH_INTERVAL_MINS = parseInt(import.meta.env.VITE_IQAMAH_INTERVAL_MINS || '12', 10);

interface IqamahProps {
  prayers: Prayer[];
}

const Iqamah: Component<AdhanProps> = (props) => {
  const { prayers } = props;

  const [timeLeft, setTimeLeft] = createSignal(IQAMAH_INTERVAL_MINS * 60);
  const [beginPrayer, setBeginPrayer] = createSignal(false);

  createEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          setBeginPrayer(true);
          return 0;
        }
        console.log('timeLeft', prev);
        return prev - 1;
      });
    }, 1000);

    onCleanup(() => clearInterval(timer));
  });

  return (
    <div class={styles.container}>
      {beginPrayer() ? (
        <div class={styles.beginPrayerContainer}>
          <div class={styles.message}>LURUS DAN RAPATKAN SAF</div>
        </div>
      ) :
        <div class={styles.iqamahContainer}>
          <div class={styles.iqamahMessage}>
            IQAMAH SEBENTAR LAGI
          </div>
          <div class={styles.countdown}>
            <Countdown secondsLeft={timeLeft()} />
          </div>
        </div>
      }
    </div>
  );
};

export default Iqamah;
