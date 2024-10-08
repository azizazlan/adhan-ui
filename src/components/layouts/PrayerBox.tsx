import { createMemo } from 'solid-js';
import { format, parse } from 'date-fns';
import { Prayer } from '../../types';
import styles from './PrayerBox.module.scss';
import { PrayerMode } from '../../types/prayer';

const PrayerBox = (props: PrayerBoxProps) => {
  const prayer = createMemo(() => props.prayer);

  return (
    <div class={styles.container}>
      <div class={styles.name}>
        {prayer().name}
      </div>
      <div class={styles.time}>
        {format(parse(prayer().time, 'HH:mm', new Date()), 'h:mma')}
      </div>
    </div>
  );
};

export default PrayerBox;