import { Component } from 'solid-js';
import { IoCloseCircleOutline } from 'solid-icons/io'
import styles from './Settings.module.css';

const Settings: Component = (props: { onClose: () => void }) => {

  const envVariables = {
    'VITE_LOCATION': import.meta.env.VITE_LOCATION,
    'VITE_LATITUDE': import.meta.env.VITE_LATITUDE,
    'VITE_LONGITUDE': import.meta.env.VITE_LONGITUDE,
    'VITE_TIMEZONE': import.meta.env.VITE_TIMEZONE,
    'VITE_TUNE': import.meta.env.VITE_TUNE,
    'VITE_SHOW_LASTTHIRD': import.meta.env.VITE_SHOW_LASTTHIRD,
    'VITE_REMINDER_BEFORE_PRAYER_MINS': import.meta.env.VITE_REMINDER_BEFORE_PRAYER_MINS,
    'VITE_REMINDER_AFTER_PRAYER_MINS': import.meta.env.VITE_REMINDER_AFTER_PRAYER_MINS,
    'VITE_ADHAN_IQAMAH_INTERVAL_MINS': import.meta.env.VITE_ADHAN_IQAMAH_INTERVAL_MINS,
    'VITE_SHOW_NEXT_HADITH_INTERVAL_MS': import.meta.env.VITE_SHOW_NEXT_HADITH_INTERVAL_MS,
    'VITE_ROTATE_BETWEEN_PRAYERTIMES_HADITHS_INTERVAL_MS': import.meta.env.VITE_ROTATE_BETWEEN_PRAYERTIMES_HADITHS_INTERVAL_MS,
  };

  return (
    <div class={styles.settingsDisplay}>
      <div class={styles.header}>
        <button class={styles.iconButton} onClick={props.onClose} title="Close Settings">
          <IoCloseCircleOutline class={styles.closeIconButton} />
        </button>
      </div>
      <div className={styles.envVariables}>
        {Object.entries(envVariables).map(([key, value]) => (
          <div key={key} className={styles.envVariable}>
            <span className={styles.envKey}>{key}=</span>
            <span className={styles.envValue}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;