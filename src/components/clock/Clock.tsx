import { createSignal, onCleanup, Component } from 'solid-js';
import { format } from 'date-fns';
import styles from './Clock.module.scss';

interface ClockProps {
  time: () => Date,
}

const Clock: Component<ClockProps> = (props) => {

  const format12Hour = (date: Date) => {
    return format(date, 'hh:mm:ssa');
  };

  const format24Hour = (date: Date) => {
    return format(date, 'HH:mm:ss');
  };

  return (
    <div class={styles.clock}>
      {format12Hour(props.time)}
      {/* <p>{format24Hour(time)}</p> */}
    </div>
  );
};

export default Clock;
