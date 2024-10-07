import { createSignal, onCleanup, Component } from 'solid-js';
import styles from './Clock.module.scss';
const Clock: Component = () => {
  const [time, setTime] = createSignal(new Date());

  const timer = setInterval(() => {
    setTime(new Date());
  }, 1000);

  onCleanup(() => {
    clearInterval(timer);
  });

  const format12Hour = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedHours = hours.toString().padStart(2, '0');

    return `${formattedHours}:${minutes}:${seconds} ${ampm}`;
  };

  const format24Hour = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div class={styles.clock}>
      {format12Hour(time())}
      {/* <p>{format24Hour(time())}</p> */}
    </div>
  );
};

export default Clock;
