import { createSignal } from 'solid-js';
import Countdown from '../countdown';
import styles from './Prayers.module.scss';
import PrayerTimeItem from './PrayerTimeItem';
import { DisplayMode } from '../App';
import { formatPrayerTime } from '../../utils/formatter';

interface PrayersProps {
  prayerTimes: Prayer[];
  toggleDisplayMode: (mode: DisplayMode) => void;
  currentPrayer: Prayer;
  nextPrayer: Prayer;
}

const Prayers = (props: PrayersProps) => {
  return (
    <>
      {props.prayerTimes.map((prayer) => (
        <div class={styles.prayerTimeContainer}>
          <PrayerTimeItem
            prayer={prayer}
            currentDateTime={props.currentDateTime}
            currentPrayer={props.currentPrayer}
            nextPrayer={props.nextPrayer}
            formatPrayerTime={formatPrayerTime}
            toggleDisplayMode={() => props.toggleDisplayMode('hadith')}
          />
          {prayer.name === props.nextPrayer.name && (
            <div class={styles.countdownContainer}>
              <Countdown nextPrayer={props.nextPrayer} />
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default Prayers;