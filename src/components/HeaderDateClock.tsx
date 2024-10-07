import { Component } from 'solid-js';
import { getPrettyFormattedDate, formatPrayerTime } from '../utils/formatter';
import styles from './HeaderDateClock.module.scss';

interface HeaderDateClockProps {
  currentDateTime: Date;
  prayerTime: string;
  prayerName: string;
  isPrayerTimePassed: boolean;
}

const HeaderDateClock: Component<HeaderDateClockProps> = (props) => {
  return (
    <div class={styles.container}>
      <div class={styles.title}>{!props.isPrayerTimePassed ? `${props.prayerName} ${formatPrayerTime(props.prayerTime)} sebentar lagi...` : `Sebentar lagi...`}</div>
    </div>
  );
};

export default HeaderDateClock;
