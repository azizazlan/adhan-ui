import { Component, createSignal, createEffect } from 'solid-js';
import styles from './App.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import EnhancedDigitalClock from './components/EnhancedDigitalClock';
import logo from './assets/logo.png';

const ClockHeader = (props: { location: string, formatDate: string }) => {
  const [currentDateTime, setCurrentDateTime] = createSignal(new Date());

  createEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  });

  return (
    <div>
      <div>
        <div class={styles.headerRow}>
          <div class={styles.headerTitle}>PRAYER TIMES</div>
          <EnhancedDigitalClock />
        </div>
        <div class={styles.locationRow}>
          <div class={styles.locationText}>{props.location}, {props.formatDate}</div>
        </div>
      </div>
    </div>
  )
}

export default ClockHeader;