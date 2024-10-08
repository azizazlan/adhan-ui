import { Component, createSignal, createEffect } from 'solid-js';
import styles from './Header.module.scss';
import { Clock } from '../clock';
import { Datecomp } from '../datecomp';

interface HeaderProps {
  time: () => Date,
  toggleDisplayMode: (mode: DisplayMode) => void;
  toggleTestSubuh: () => void;
  t: (key: string) => string;
}

const Header = (props: HeaderProps) => {
  const { toggleDisplayMode, toggleTestSubuh, t } = props;
  return (
    <div class={styles.container}>
      <Clock time={props.time} />
      <div>
        <Datecomp />
        {import.meta.env.VITE_DEV_MODE === 'true' && (
          <div>
            <button class={styles.testBtn} onClick={() => toggleDisplayMode('prayerslist')}>Home</button>
            <button class={styles.testBtn} onClick={() => toggleDisplayMode('adhan')}>Test display adhan</button>
            <button class={styles.testBtn} onClick={() => toggleDisplayMode('iqamah')}>Test display iqamah</button>
            <button class={styles.testBtn} onClick={() => toggleTestSubuh()}>Test display Subuh</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Header;