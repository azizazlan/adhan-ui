import { createSignal, onCleanup, Component } from 'solid-js';
import { format } from 'date-fns';
import styles from './ClockAndDate.module.scss';

interface ClockAndDateProps {
  time: () => Date,
}

const ClockAndDate: Component<ClockAndDateProps> = (props) => {
  const { time } = props;

  const format24Hour = (date: Date) => {
    return format(date, 'HH:mm');
  };

  const formatDate = (date: Date) => {
    return format(date, 'EEE dd MMM yyyy');
  };

  return (
    <div class={styles.clock}>
      <div class={styles.time}>
        {format24Hour(time)}
      </div>
      <div class={styles.date}>
        {formatDate(time)}
      </div>
    </div>
  );
};

export default ClockAndDate;
