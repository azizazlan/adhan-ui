import { createSignal } from 'solid-js';
import Countdown from '../countdown';
import styles from './PrayersList.module.scss';
import PrayerTimeItem from './PrayerTimeItem';
import { DisplayMode } from '../App';
import { formatPrayerTime } from '../../utils/formatter';

interface PrayersProps {
  prayers: Prayer[];
  t: i18n.TranslateFunction;
  toggleDisplayMode: (mode: DisplayMode) => void;
}

const PrayersList = (props: PrayersProps) => {
  const { t, prayers, toggleDisplayMode } = props;
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