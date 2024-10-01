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

  if (props.nextPrayer.name === props.prayer.name) {
    return (
      <div class={`${styles.prayerTimeItem} ${getItemClass()}`}>
        <div class={styles.nextPrayerNameContainer}>
          <div class={styles.nextPrayerLabel}>NEXT</div>
          <div class={styles.prayerName}>
            {props.prayer.name.split('').map((letter, index) => (
              <span class={styles.letterBox} key={index}>{letter}</span>
            ))}
          </div>
        </div>
        <FlipClock
          time={props.formatPrayerTime(props.prayer.time)}
          isCurrentPrayer={isCurrentPrayer()}
          isCountdown={false}
        />
      </div>
    );
  }

  return (
    <div class={`${styles.prayerTimeItem} ${getItemClass()}`}>
      <div>
        <div class={styles.prayerName}>
          {props.prayer.name.split('').map((letter, index) => (
            <span class={styles.letterBox} key={index}>{letter}</span>
          ))}
        </div>
      </div>
      <FlipClock
        time={props.formatPrayerTime(props.prayer.time)}
        isCurrentPrayer={isCurrentPrayer()}
        isCountdown={false}
      />
    </div>
  );
};

export default PrayerTimeItem;