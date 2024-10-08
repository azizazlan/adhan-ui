import { createMemo } from 'solid-js';
import { format } from 'date-fns';
import { DisplayMode } from '../../types/displaymode';
import styles from './Devmode.module.scss';

interface DevmodeProps {
  toggleTestScreenIqamah: () => void;
  toggleTestScreenPrayers: () => void;
  toggleTestSubuh: () => void;
  toggleTestSyuruk: () => void;
  toggleRefetch: () => void;
  lastApiTimestamp: number;
}

const Devmode = (props: DevmodeProps) => {
  const lastApiTimestamp = createMemo(() => props.lastApiTimestamp);
  return (
    <div class={styles.container}>
      <div class={styles.paramsContainer}>
        <h4>Production params</h4>
        <div>VITE_ADHAN_LEAD_MINS: {import.meta.env.VITE_ADHAN_LEAD_MINS}</div>
        <div>VITE_IQAMAH_INTERVAL_MS: {import.meta.env.VITE_IQAMAH_INTERVAL_MS}
          ({parseFloat(import.meta.env.VITE_IQAMAH_INTERVAL_MS) / (1000 * 60)} mins)</div>
        <hr />
        <h4>Dev params</h4>
        <div>VITE_ADHAN_LEAD_MINS_TEST: {import.meta.env.VITE_ADHAN_LEAD_MINS_TEST}</div>
        <div>VITE_IQAMAH_INTERVAL_MS_TEST: {import.meta.env.VITE_IQAMAH_INTERVAL_MS_TEST}
          ({parseFloat(import.meta.env.VITE_IQAMAH_INTERVAL_MS_TEST) / 1000} secs)
        </div>
        <hr />
        <div>Last fetch api timestamp: {lastApiTimestamp()}</div>
        <div>Formatted: {format(lastApiTimestamp() * 1000, 'dd/MM/yyyy')}</div>
      </div>
      <div class={styles.testButtonsContainer}>
        <button class={styles.testButton} onClick={() => props.toggleTestScreenIqamah()}>Iqamah Screen</button>
        <button class={styles.testButton} onClick={() => props.toggleDisplayMode(DisplayMode.PRAYER_TIMES)}>Prayers Screen</button>
        <button class={styles.testButton} onClick={() => props.toggleTestSubuh()}>Test Subuh</button>
        <button class={styles.testButton} onClick={() => props.toggleTestSyuruk()}>Test Syuruk</button>
        <button class={styles.testButton} onClick={() => props.toggleRefetch()}>Refetch</button>
      </div>
    </div>
  );
};

export default Devmode;