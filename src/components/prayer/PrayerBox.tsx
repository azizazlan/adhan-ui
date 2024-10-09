import { createMemo } from 'solid-js';
import { Prayer } from '../../types';
import styles from './PrayerBox.module.scss';
import { PrayerMode } from '../../types/prayer';

const PrayerBox = (props: PrayerBoxProps) => {
  const prayer = createMemo(() => props.prayer);

  return (
    <div class={`${styles.container} ${prayer().mode === PrayerMode.IMMEDIATE_NEXT ? styles.active : ''}`}>
      <div class={styles.name}>
        {prayer().name}
      </div>
      <div class={styles.time}>
        {prayer().time}
      </div>
    </div>
  );
};

export default PrayerBox;