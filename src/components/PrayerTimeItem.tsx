// PrayerTimeItem.tsx
import { Prayer } from './types';
import styles from './PrayerTimeItem.module.css';
import FlipClock from './FlipClock';

interface PrayerTimeItemProps {
  prayer: Prayer;
  currentPrayer: string;
  nextPrayer: string;
  isPrayerTimePast: (prayerTime: string) => boolean;
  formatPrayerTime: (time: string) => string;
}

const PrayerTimeItem = (props: PrayerTimeItemProps) => {
  const getItemClass = () => {
    if (props.prayer.name === props.currentPrayer) return styles.current;
    if (props.prayer.name === props.nextPrayer) return styles.next;
    if (props.isPrayerTimePast(props.prayer.time)) return styles.past;
    return '';
  };

  const isCurrentPrayer = () => props.prayer.name === props.currentPrayer;

  return (
    <div class={`${styles.prayerTimeItem} ${getItemClass()}`}>
      <span class={styles.prayerName}>{props.prayer.name}</span>
      <FlipClock
        time={props.formatPrayerTime(props.prayer.time)}
        isCurrentPrayer={isCurrentPrayer()}
      />
    </div>
  );
};

export default PrayerTimeItem;