import { format, parse } from 'date-fns';
import { Prayer } from '../../types';
import styles from './PrayerTimeItem.module.scss';
import { PrayerMode } from '../../types/prayer';

interface PrayerTimeItemProps {
  prayer: Prayer;
}

const PrayerTimeItem = (props: PrayerTimeItemProps) => {
  const { name, time, mode } = props.prayer;
  return (
    <div class={styles.container}>
      <div
        class={mode === PrayerMode.ACTIVE ? styles.activeName : mode === PrayerMode.NEXT ? styles.nextName : styles.inactiveName}>{name}</div>
      {import.meta.env.VITE_DEV_MODE === 'true' &&
        <div>{mode}</div>
      }
      <div
        class={mode === PrayerMode.ACTIVE ? styles.activeTime : mode === PrayerMode.NEXT ? styles.nextTime : styles.inactiveTime}
      >

        {format(parse(time, 'HH:mm', new Date()), 'h:mma')}</div>
    </div>
  );
}
export default PrayerTimeItem;