import { getPrettyFormattedDate } from '../utils/formatter';
import styles from './FooterClock.module.css';

interface FooterClockProps {
  currentDateTime: Date;
}

const FooterClock = (props: FooterClockProps) => {
  return (
    <div class={styles.container}>
      <div class={styles.currentTime}>
        {props.currentDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toUpperCase().replace(/\s/g, '')}
      </div>
      <div class={styles.currentDate}>{getPrettyFormattedDate(props.currentDateTime)}</div>
    </div>
  );
};

export default FooterClock;
