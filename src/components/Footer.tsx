import { Component } from 'solid-js';
import styles from './Footer.module.css';
import { BiRegularCog } from 'solid-icons/bi'

const Footer: Component = (props: { onSettingsClick: () => void }) => {
  return (
    <footer class={styles.footer}>
      <div class={styles.container}>
        <button
          onClick={props.onSettingsClick}
          class={styles.settingsButton}><BiRegularCog /></button>
        <p class={styles.copyright}>&copy; {new Date().getFullYear()} Prayer Times App</p>
      </div>
    </footer>
  );
};

export default Footer;
