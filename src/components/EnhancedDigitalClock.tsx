import { createSignal, onCleanup } from 'solid-js';
import styles from './EnhancedDigitalClock.module.css';

const padNumber = (num: number): string => num.toString().padStart(2, '0');

const EnhancedDigitalClock = () => {
  const [time, setTime] = createSignal(new Date());

  const timer = setInterval(() => {
    setTime(new Date());
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
          {index < 3 ? (
            <div class={styles.segment}>
              <div class={styles.digitBox}>
                <div class={styles.digit}>{segment[0]}</div>
              </div>
              <div class={styles.digitBox}>
                <div class={styles.digit}>{segment[1]}</div>
              </div>
            </div>
          ) : (
            <div class={styles.ampm}>{segment}</div>
          )}
          {index < 2 && <div class={styles.separator}>:</div>}
        </>
      ))}
    </div>
  );
};

export default EnhancedDigitalClock;