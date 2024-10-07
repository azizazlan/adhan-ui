import { createSignal } from 'solid-js';
import Countdown from '../countdown';
import styles from './Prayers.module.scss';
import PrayerTimeItem from './PrayerTimeItem';
import { DisplayMode } from '../App';
import { formatPrayerTime } from '../../utils/formatter';
import Header from '../headers/Header';

interface PrayersProps {
  prayerTimes: Prayer[];
  t: i18n.TranslateFunction;
}

const Prayers = (props: PrayersProps) => {
  const { t, prayerTimes } = props;
  return (
    <div class={styles.container}>
      <Header t={t} />
      {prayerTimes.map((prayer) => (
        <PrayerTimeItem
          prayer={prayer}
        />
      ))}
    </div>
  );
};

export default Prayers;