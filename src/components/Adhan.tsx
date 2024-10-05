import { Component } from 'solid-js';
import { IoCloseCircleOutline } from 'solid-icons/io'
import styles from './Adhan.module.css';

interface AdhanProps {
  onClose: () => void;
}

const Adhan: Component<AdhanProps> = (props) => {
  return (
    <div class={styles.adhanContainer}>
      <h1 class={styles.prayerName}>Zohor</h1>
      <div class={styles.prayerTime}>01:15 PM</div>
      <div class={styles.countdown}>00:00:00</div>
    </div>
  );
};

export default Adhan;
