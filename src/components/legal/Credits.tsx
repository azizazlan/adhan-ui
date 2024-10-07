import { Component } from 'solid-js';
import { IoCloseCircleOutline } from 'solid-icons/io'
import styles from './Credits.module.scss';

const Credits: Component = (props: { onClose: () => void }) => {

  return (
    <div class={styles.container}>
      <div class={styles.header}>
        <button class={styles.iconButton} onClick={props.onClose} title="Close credits">
          <IoCloseCircleOutline class={styles.closeIconButton} />
        </button>
      </div>
      <div className={styles.contents}>
        <h1 class={styles.arabic}>بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ </h1>
        <h3>Credits</h3>
        <p>First and foremost, praise belongs to God Almighty, who has given us the ability to do this. And then thanks to my wife, for her continued patience whilst we work to maintain this app, by God's grace.</p>
        <p>This app is a simple prayer times app, which is based on the <a href="https://aladhan.com">Aladhan</a> API. The app is built with SolidJS, and the code is available on <a href="https://github.com/azizazlan/adhan-ui">GitHub</a>.</p>
        <p>The app is designed to be simple and easy to use, with a focus on the prayer times and the ability to view the next prayer time.</p>

        <h3>Terms</h3>
        <p>The app is provided "as is" without any warranty without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE..</p>
        <p>The app is not intended to be used for any commercial purposes. The app is intended to be used for personal use only.</p>
      </div>
    </div>
  );
};

export default Credits;