import { FaSolidAngleRight } from 'solid-icons/fa'
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
    if (props.isPrayerTimePast(props.prayer.time, props.prayer.name) && props.prayer.name == props.currentPrayer) return styles.currentlyPassed;
    if (props.prayer.name === props.nextPrayer.name) return styles.next;
    if (props.isPrayerTimePast(props.prayer.time, props.prayer.name)) return styles.past;
    if (props.prayer.name === props.currentPrayer) return styles.current;
    return '';
  };

  const isCurrentPrayer = () => props.prayer.name === props.currentPrayer;

  const isPrayerTimePast = () => {
    return props.isPrayerTimePast(props.prayer.time, props.prayer.name);
  };

  return (
    <div class={`${styles.prayerTimeItem} ${getItemClass()}`}>
      <div>
        <div class={styles.prayerName}>
          {props.nextPrayer.name === props.prayer.name ? <span class={styles.nextPrayerLabel}>▸</span> : null}
          {props.prayer.name.split('').map((letter, index) => (
            <span class={styles.letterBox} key={index}>{letter}</span>
          ))}
          {props.prayer.name === 'Terbit' ? <span class={styles.letterBox}>🌤</span> : null}
          {props.prayer.name === 'Sun' ? <span class={styles.letterBox}>🌤</span> : null}
        </div>
      </div>
      <FlipClock
        time={props.formatPrayerTime(props.prayer.time)}
        isCurrentPrayer={isCurrentPrayer()}
        isCountdown={false}
        isPrayerTimePast={isPrayerTimePast()}
      />
    </div>
  );
};

export default PrayerTimeItem;