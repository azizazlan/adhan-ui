import { createMemo } from 'solid-js';
import { format } from 'date-fns';
import styles from './Devmode.module.scss';

interface DevmodeProps {
  toggleTestScreenIqamah: () => void;
  toggleTestSubuh: () => void;
  toggleRefetch: () => void;
  lastApiTimestamp: number;
}

const Devmode = (props: DevmodeProps) => {
  const lastApiTimestamp = createMemo(() => props.lastApiTimestamp);
  return (
    <div class={styles.container}>
      <button class={styles.testButton} onClick={() => props.toggleTestScreenIqamah()}>Iqamah Screen</button>
      <button class={styles.testButton} onClick={() => props.toggleTestSubuh()}>Test Subuh</button>
      <button class={styles.testButton} onClick={() => props.toggleRefetch()}>Refetch</button>
      <div class={styles.paramsContainer}>
        <h5>Production params</h5>
        <div>VITE_ADHAN_LEAD_MINS: {import.meta.env.VITE_ADHAN_LEAD_MINS}</div>
        <h5>Dev params</h5>
        <div>VITE_ADHAN_LEAD_MINS_TEST: {import.meta.env.VITE_ADHAN_LEAD_MINS_TEST}</div>
        <hr />
        <div>Last fetch api timestamp: {lastApiTimestamp()}</div>
        <div>Formatted: {format(lastApiTimestamp() * 1000, 'dd/MM/yyyy')}</div>
      </div>
    </div>
  );
};

export default Devmode;