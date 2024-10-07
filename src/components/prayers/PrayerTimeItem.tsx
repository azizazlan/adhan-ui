import { format, parse } from 'date-fns';
import { Prayer } from '../../types';
import styles from './PrayerTimeItem.module.scss';

interface PrayerTimeItemProps {
  prayer: Prayer;
}

const PrayerTimeItem = (props: PrayerTimeItemProps) => {

  const { name, time } = props.prayer;

  console.log(time);
  return (
    <div class={styles.container}>
      <div class={styles.name}>{name}</div>
      <div class={styles.time}>{format(parse(time, 'HH:mm', new Date()), 'h:mma')}</div>
    </div>
  );
}
export default PrayerTimeItem;