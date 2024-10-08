import { Component, createEffect, createSignal, onCleanup } from 'solid-js';
import { Badge, Card } from 'solid-bootstrap';
import { differenceInSeconds, parse } from 'date-fns';
import styles from './Adhan.module.scss';
import PrayersCards from '../prayers/PrayersCards';
import { Countdown } from '../countdown';

interface AdhanProps {
  prayers: Prayer[];
  leadPrayer: Prayer;
  currentTime: Date;
}

const Adhan: Component<AdhanProps> = (props) => {
  const { prayers, leadPrayer, currentTime } = props;
  const leadPrayerTime = parse(leadPrayer.time, 'HH:mm', currentTime);
  const secondsLeft = differenceInSeconds(leadPrayerTime, currentTime);
  console.log(`secondsLeft: ${secondsLeft}`);
  return (
    <div class={styles.container}>
      <div class={styles.message}>
        <Badge class={styles.badge} text="white">Adhan</Badge>
      </div>
      <div class={styles.countdown}>
        <Countdown secondsLeft={secondsLeft} />
      </div>
      <PrayersCards prayers={prayers} activePrayer={activePrayer()} />
    </div>
  );
};

export default Adhan;
