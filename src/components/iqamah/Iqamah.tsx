import { Component, createEffect, createSignal, onCleanup } from 'solid-js';
import { Badge, Card } from 'solid-bootstrap';
import styles from './Iqamah.module.scss';
import PrayersCards from '../prayers/PrayersCards';
import { Countdown } from '../countdown';

const IQAMAH_INTERVAL_MINS = parseInt(import.meta.env.VITE_IQAMAH_INTERVAL_MINS || '12', 10);

interface IqamahProps {
  prayers: Prayer[];
}

const Iqamah: Component<AdhanProps> = (props) => {
  const [activePrayer, setActivePrayer] = createSignal("Subuh");
  const { prayers } = props;
  return (
    <div class={styles.container}>
      <div class={styles.message}>
        <Badge class={styles.badge} text="white">Iqamah</Badge>
      </div>
      <div class={styles.countdown}>
        <Countdown secondsLeft={IQAMAH_INTERVAL_MINS * 60} />
      </div>
      <PrayersCards prayers={prayers} activePrayer={activePrayer()} />
    </div>
  );
};

export default Iqamah;
