import { createMemo } from 'solid-js';
import { format, parse } from 'date-fns';
import { Prayer } from '../../types';
import styles from './PrayerTimeItem.module.scss';
import { PrayerMode } from '../../types/prayer';

const PrayerTimeItem = (props: PrayerTimeItemProps) => {
  const prayer = createMemo(() => props.prayer);

  return (
    <div class={styles.container}>
      <div
        class={
          prayer().mode === PrayerMode.ACTIVE ? styles.activeName :
            prayer().mode === PrayerMode.IMMEDIATE_NEXT ? styles.immediateNextName :
              prayer().mode === PrayerMode.NEXT ? styles.nextName :
                styles.inactiveName
        }
      >
        {prayer().name}
      </div>
      {import.meta.env.VITE_DEV_MODE === 'true' &&
        <div>{prayer().mode}</div>
      }
      <div
        class={
          prayer().mode === PrayerMode.ACTIVE ? styles.activeTime :
            prayer().mode === PrayerMode.IMMEDIATE_NEXT ? styles.immediateNextTime :
              prayer().mode === PrayerMode.NEXT ? styles.nextTime :
                styles.inactiveTime
        }
      >
        {format(parse(prayer().time, 'HH:mm', new Date()), 'h:mma')}
      </div>
    </div>
  );
};

export default PrayerTimeItem;