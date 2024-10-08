import { Component, createEffect, createSignal, onCleanup } from 'solid-js';
import { Badge, Card } from 'solid-bootstrap';
import styles from './Adhan.module.scss';
import PrayersCards from '../prayers/PrayersCards';
import { Countdown } from '../countdown';
interface AdhanProps {
  prayers: Prayer[];
}

const Adhan: Component<AdhanProps> = (props) => {
  const { prayers } = props;
  const [activePrayer, setActivePrayer] = createSignal("Subuh");
  return (
    <div class={styles.container}>
      <div class={styles.message}>
        <Badge class={styles.badge} text="white">Adhan</Badge>
      </div>
      <div class={styles.countdown}>
        <Countdown />
      </div>
      <PrayersCards prayers={prayers} activePrayer={activePrayer()} />
    </div>
  );
};

export default Adhan;
