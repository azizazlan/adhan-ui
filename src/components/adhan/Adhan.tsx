import { Component, createEffect, createSignal, onCleanup } from 'solid-js';
import styles from './Adhan.module.scss';
import { HeaderDateClock } from '../headers';
import { formatPrayerTime, getPrettyFormattedDate } from '../../utils/formatter';
import getWindowDimensions from '../../utils/getWindowDimensions';
import { FooterClock } from '../footers';

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

  const initialTime = parseTime(props.time ? props.time : '00:00:00');

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

interface Prayer {
  name: string;
  time: string;
  countdown: {
    hours: number;
    minutes: number;
    seconds: number;
  };
}

interface AdhanProps {
  currentDateTime: Date;
  onClose: () => void;
  prayer: Prayer;
}

const Adhan: Component<AdhanProps> = (props) => {
  const isCountdownUnderThreshold = (countdown: string) => {
    const [hours, minutes] = countdown.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    return totalMinutes < REMINDER_BEFORE_PRAYER_MINS;
  };

  const parseCountdown = (countdownString: string) => {
    const [hours, minutes, seconds] = countdownString.split(':').map(Number);
    return { hours, minutes, seconds };
  };

  const countdownTime = parseCountdown(props.prayer.countdown);

  const [startAdhan, setStartAdhan] = createSignal(false);

  const handleDemoStartAdhan = () => {
    setStartAdhan(prev => !prev);
    props.toggleDisplayMode('iqamah');
  };


  return (
    <div class={styles.container} style={{ height: `${getWindowDimensions().height - 86}px` }}>
      <HeaderDateClock isPrayerTimePassed={false} prayerName={props.prayer.name} prayerTime={props.prayer.time} currentDateTime={props.currentDateTime} />
      <div class={styles.content}>
        <div class={styles.center}>
          <h1 class={styles.title}>Adhan</h1>
          <Countdown time={props.prayer.countdown} />
        </div>
        <div class={styles.footer}>
          <FooterClock currentDateTime={props.currentDateTime} />
        </div>
      </div>
    </div>
  );
};

export default Adhan;
