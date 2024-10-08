import { createSignal } from 'solid-js';
import Countdown from '../countdown';
import styles from './PrayersList.module.scss';
import PrayerTimeItem from './PrayerTimeItem';
import { DisplayMode } from '../App';
import { formatPrayerTime } from '../../utils/formatter';

interface PrayersProps {
  prayers: Prayer[];
  activePrayer: Prayer;
  nextPrayer: Prayer;
}

const PrayersList = (props: PrayersProps) => {
  const { prayers, activePrayer, nextPrayer } = props;
  return (
    <div class={styles.container}>
      {prayers.map((prayer) => (
        <PrayerTimeItem
          prayer={prayer}
        />
      ))}
    </div>
  );
};

export default PrayersList;