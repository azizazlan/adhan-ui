import { Component, createSignal, createEffect } from 'solid-js';
import styles from './Header.module.scss';
import { Clock } from '../clock';
import { Datecomp } from '../datecomp';

const Header = (props: {
  t: (key: string) => string;
}) => {
  const { t } = props;
  return (
    <div class={styles.container}>
      <Clock />
      <Datecomp />
    </div>
  )
}

export default Header;