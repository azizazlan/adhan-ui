import { Component, createEffect, createSignal, onCleanup } from 'solid-js';
import styles from './Iqamah.module.css';
import HeaderClock from './HeaderClock';
interface CountdownProps {
  time: {
    hours: number;
    minutes: number;
    seconds: number;
  };
}

interface CountdownProps {
  time: string; // Expecting a string in the format "HH:MM:SS"
}

const CountdownCard: Component<{ value: number; flip: boolean }> = (props) => {
  return (
    <div class={`${styles.countdownCard} ${props.flip ? styles.countdownCardFlip : ''}`}>
      <div class={`${styles.countdownCardFace} ${styles.countdownCardTop}`}>{String(props.value).padStart(2, '0')}</div>
      <div class={`${styles.countdownCardFace} ${styles.countdownCardBottom}`}>{String(props.value).padStart(2, '0')}</div>
    </div>
  );
};

const Countdown: Component<CountdownProps> = (props) => {
  const parseTime = (timeString: string) => {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return { hours: hours || 0, minutes: minutes || 0, seconds: seconds || 0 };
  };

  const initialTime = parseTime(props.time);

  const [hours, setHours] = createSignal(initialTime.hours);
  const [minutes, setMinutes] = createSignal(initialTime.minutes);
  const [seconds, setSeconds] = createSignal(initialTime.seconds);
  const [flip, setFlip] = createSignal({ hours: false, minutes: false, seconds: false });

  createEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev === 0) {
          setMinutes((prevMin) => {
            if (prevMin === 0) {
              setHours((prevHour) => {
                setFlip((f) => ({ ...f, hours: true }));
                setTimeout(() => setFlip((f) => ({ ...f, hours: false })), 300);
                return prevHour > 0 ? prevHour - 1 : 0;
              });
              setFlip((f) => ({ ...f, minutes: true }));
              setTimeout(() => setFlip((f) => ({ ...f, minutes: false })), 300);
              return 59;
            }
            setFlip((f) => ({ ...f, minutes: true }));
            setTimeout(() => setFlip((f) => ({ ...f, minutes: false })), 300);
            return prevMin - 1;
          });
          return 59;
        }
        setFlip((f) => ({ ...f, seconds: true }));
        setTimeout(() => setFlip((f) => ({ ...f, seconds: false })), 300);
        return prev - 1;
      });
    }, 1000);

    onCleanup(() => clearInterval(timer));
  });

  return (
    <div class={styles.countdown}>
      <div class={styles.countdownUnit}>
        <CountdownCard value={hours()} flip={flip().hours} />
      </div>
      <div class={styles.countdownSeparator}>:</div>
      <div class={styles.countdownUnit}>
        <CountdownCard value={minutes()} flip={flip().minutes} />
      </div>
      <div class={styles.countdownSeparator}>:</div>
      <div class={styles.countdownUnit}>
        <CountdownCard value={seconds()} flip={flip().seconds} />
      </div>
    </div>
  );
};

const IqamahMessage: Component = () => {
  return (
    <div class={styles.content}>
      <h1 class={styles.message}>Solat!</h1>
      <div class={styles.iqamahMessage}>Lurus dan rapikan saf!</div>
    </div>
  );
};


interface IqamahProps {
  onClose: () => void;
  currentDateTime: Date;
}

const Iqamah: Component<IqamahProps> = (props) => {
  const adhanMins = import.meta.env.VITE_ADHAN_MINS || 10;
  const [countdownTime, setCountdownTime] = createSignal(`00:${adhanMins.toString().padStart(2, '0')}:00`);
  const [isCountdownFinished, setIsCountdownFinished] = createSignal(false);

  createEffect(() => {
    const totalSeconds = (adhanMins * 60) - 1;
    let remainingSeconds = totalSeconds;

    const timer = setInterval(() => {
      remainingSeconds--;
      if (remainingSeconds <= 0) {
        clearInterval(timer);
        setIsCountdownFinished(true);
      } else {
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        setCountdownTime(`00:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  });

  return (
    <div class={styles.iqamahContainer}>
      <div class={styles.iqamahHeader}>
        <div class={styles.iqamahLabel}>{isCountdownFinished() ? '' : 'Iqamah'}</div>
        <HeaderClock currentDateTime={props.currentDateTime} />
      </div>
      <div class={styles.content}>
        {isCountdownFinished() ? (
          <IqamahMessage />
        ) : (
          <Countdown time={countdownTime()} />
        )}
      </div>
    </div>
  );
};

export default Iqamah;
