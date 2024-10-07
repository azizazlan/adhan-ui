import { Component } from 'solid-js';
import { IoCloseCircleOutline } from 'solid-icons/io'
import { Tab, Tabs } from 'solid-bootstrap';
import styles from './Settings.module.css';
import PTimesAdjustment from './PTimesAdjustment';

const EnvVariables = () => {
  const envVariables = {
    'VITE_LOCATION': import.meta.env.VITE_LOCATION,
    'VITE_LATITUDE': import.meta.env.VITE_LATITUDE,
    'VITE_LONGITUDE': import.meta.env.VITE_LONGITUDE,
    'VITE_TIMEZONE': import.meta.env.VITE_TIMEZONE,
    'VITE_TUNE': import.meta.env.VITE_TUNE,
    'VITE_SHOW_LASTTHIRD': import.meta.env.VITE_SHOW_LASTTHIRD,
    'VITE_ALERT_BEFORE_PRAYER_MINS': import.meta.env.VITE_ALERT_BEFORE_PRAYER_MINS,
    'VITE_GRACE_PERIOD_AFTER_PRAYER_MINS': import.meta.env.VITE_GRACE_PERIOD_AFTER_PRAYER_MINS,
    'VITE_ADHAN_IQAMAH_INTERVAL_MINS': import.meta.env.VITE_ADHAN_IQAMAH_INTERVAL_MINS,
    'VITE_SHOW_NEXT_HADITH_INTERVAL_MS': import.meta.env.VITE_SHOW_NEXT_HADITH_INTERVAL_MS,
    'VITE_ROTATE_BETWEEN_PRAYERTIMES_HADITHS_INTERVAL_MS': import.meta.env.VITE_ROTATE_BETWEEN_PRAYERTIMES_HADITHS_INTERVAL_MS,
  };
  return <div className={styles.envVariables}>
    {Object.entries(envVariables).map(([key, value]) => (
      <div key={key} className={styles.envVariable}>
        <span className={styles.envKey}>{key}=</span>
        <span className={styles.envValue}>{value}</span>
      </div>
    ))}
  </div>;
};

const Sonnet = () => {
  return <div>Sonnet</div>;
};

const Settings: Component = (props: { onClose: () => void }) => {

  return (
    <div class={styles.settingsDisplay}>
      <div class={styles.header}>
        <button class={styles.iconButton} onClick={props.onClose} title="Close Settings">
          <IoCloseCircleOutline class={styles.closeIconButton} />
        </button>
      </div>
      <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" class="mb-3 custom-tabs">
        <Tab
          eventKey="home"
          title={<span class="custom-tab-title">Home</span>}
        >
          <div>Home content</div>
        </Tab>
        <Tab eventKey="env_variables" title="Environment Variables">
          <EnvVariables />
        </Tab>
        <Tab eventKey="prayer_times_adjustment" title="Prayer Times Adjustment">
          <PTimesAdjustment />
        </Tab>
        <Tab eventKey="contact" title="Contact" disabled>
          <Sonnet />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Settings;