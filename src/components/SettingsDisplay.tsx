import { Component } from 'solid-js';
import { IoCloseCircleOutline } from 'solid-icons/io'
import styles from './SettingsDisplay.module.css';

const SettingsDisplay: Component = (props: { onClose: () => void }) => {

  const envVariables = {
    'VITE_DISPLAY_HADITH': import.meta.env.VITE_DISPLAY_HADITH,
    'VITE_HADITH_API_KEY': import.meta.env.VITE_HADITH_API_KEY,
    'VITE_SHOW_PRAYER_TIMES_INTERVAL_MS': import.meta.env.VITE_SHOW_PRAYER_TIMES_INTERVAL_MS,
    'VITE_LOCATION': import.meta.env.VITE_LOCATION,
    'VITE_LATITUDE': import.meta.env.VITE_LATITUDE,
    'VITE_LONGITUDE': import.meta.env.VITE_LONGITUDE,
    'VITE_TIMEZONE': import.meta.env.VITE_TIMEZONE,
    'VITE_TUNE': import.meta.env.VITE_TUNE,
    'VITE_TIMER_THRESHOLD_MINS': import.meta.env.VITE_TIMER_THRESHOLD_MINS
  };

  return (
    <div class={styles.settingsDisplay}>
      <div class={styles.header}>
        <button class={styles.closeButton} onClick={props.onClose} title="Close Settings">
          <IoCloseCircleOutline />
        </button>
      </div>
      <div className={styles.envVariables}>
        {Object.entries(envVariables).map(([key, value]) => (
          <div key={key} className={styles.envVariable}>
            <span className={styles.envKey}>{key}:</span>
            <span className={styles.envValue}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsDisplay;