import { createEffect } from 'solid-js';
import Countdown from '../countdown';
import styles from './PrayersList.module.scss';
import PrayerTimeItem from './PrayerTimeItem';
import { DisplayMode } from '../App';
import { formatPrayerTime } from '../../utils/formatter';

interface PrayersProps {
  prayers: Prayer[];
}

const PrayersList = (props: PrayersProps) => {
  createEffect(() => {
    console.log('PrayersList received updated prayers:', props.prayers);
  });

  return (
    <div class={styles.container}>
      <For each={props.prayers}>
        {(prayer) => (
          <PrayerTimeItem prayer={prayer} />
        )}
      </For>
    </div>
  );
};

export default PrayersList;