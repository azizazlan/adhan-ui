import { createSignal, createEffect, onCleanup } from 'solid-js';
import { addSeconds } from 'date-fns';
import styles from './HeaderClock.module.scss';

const padNumber = (num: number): string => num.toString().padStart(2, '0');

const HeaderClock = (props: { currentDateTime: Date }) => {
  const [time, setTime] = createSignal(props.currentDateTime);

  createEffect(() => {
    setTime(props.currentDateTime);
  });

  const timer = setInterval(() => {
    setTime(prevTime => addSeconds(prevTime, 1));
  }, 1000);

  onCleanup(() => clearInterval(timer));

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return [
      padNumber(hours),
      padNumber(minutes),
      padNumber(seconds),
      ampm
    ];
  };

  return (
    <div class={styles.clock}>
      {formatTime(time()).map((segment, index) => (
        <>
          <div class={`${styles.segment} ${index === 3 ? styles.ampmSegment : ''}`}>
            <div class={styles.digitBox}>
              <div class={styles.digit}>{segment[0]}</div>
            </div>
            <div class={styles.digitBox}>
              <div class={styles.digit}>{segment[1]}</div>
            </div>
          </div>
          {index < 3 && <div class={styles.separator}>:</div>}
        </>
      ))}
    </div>
  );
};

export default HeaderClock;
