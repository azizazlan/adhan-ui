import { Component } from 'solid-js';
import styles from './Footer.module.scss';

const Footer: Component = (props: {
  onCreditsClick: () => void,
  onHadithsClick: () => void,
  onSettingsClick: () => void
}) => {
  return (
    <footer class={styles.container}>
      <p class={styles.footerText}>{import.meta.env.VITE_APP_NAME} Version {import.meta.env.VITE_APP_VERSION}.
        {" "}
        In the name of Allah, the most gracious, the most merciful, may this app be a means of guidance and a source of blessing for all muslims worldwide.
        {" "}
        <button class={styles.footerLink} onClick={props.onCreditsClick}>Credits & Terms</button>
        {" "}
        <button class={styles.footerLink} onClick={props.onHadithsClick}>Hadiths</button>
        {" "}
        <button class={styles.footerLink} onClick={props.onSettingsClick}>Settings</button>
      </p>
    </footer>
  );
};

export default Footer;
