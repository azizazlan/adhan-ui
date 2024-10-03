import { Component } from 'solid-js';
import styles from './Footer.module.css';

const Footer: Component = (props: { onCreditsClick: () => void }) => {
  return (
    <footer class={styles.footer}>
      <div class={styles.container}>
        <p class={styles.copyright}>In the name of Allah, the most gracious, the most merciful, may this app be a means of guidance and a source of blessing for all muslims worldwide.
          <button class={styles.footerLink} onClick={props.onCreditsClick}>Credits & Terms</button></p>
        <p class={styles.version}>{import.meta.env.VITE_APP_NAME} Version {import.meta.env.VITE_APP_VERSION}</p>
      </div>
    </footer >
  );
};

export default Footer;
