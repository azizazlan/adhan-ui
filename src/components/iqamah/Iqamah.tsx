import { Component, createEffect, createSignal, onCleanup } from 'solid-js';
import { Badge, Card } from 'solid-bootstrap';
import styles from './Iqamah.module.scss';
import PrayersCards from '../prayers/PrayersCards';
import { Countdown } from '../countdown';

interface IqamahProps {
  prayers: Prayer[];
}

const Iqamah: Component<AdhanProps> = (props) => {
  const [activePrayer, setActivePrayer] = createSignal("Subuh");
  const { prayers } = props;
  return (
    <div class={styles.container}>
      <div class={styles.message}>
        <Badge bg="success" text="white">Iqamah</Badge>
      </div>
      <div class={styles.countdown}>
        <Countdown />
      </div>
      <PrayersCards prayers={prayers} activePrayer={activePrayer()} />
    </div>
  );
};

export default Iqamah;
