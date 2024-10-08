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
            <button class={styles.testBtn} onClick={() => toggleDisplayMode('adhan')}>Display adhan</button>
            <button class={styles.testBtn} onClick={() => toggleDisplayMode('iqamah')}>Display iqamah</button>
            <button class={styles.testBtn} onClick={() => toggleTestSubuh()}>Adhan Lead {import.meta.env.VITE_ADHAN_LEAD_MINS}mins</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Header;