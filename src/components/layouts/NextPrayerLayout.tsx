import { createEffect, createMemo } from 'solid-js';
import styles from './NextPrayerLayout.module.scss';
import { Clock } from '../clock';
import { PrayerBox } from '../prayer';
import star from '../../assets/images/star.png';
import { Prayer } from '../../types/Prayer';
import Adhan from '../Adhan';

interface NextPrayerLayoutProps {
  prayers: Prayer[];
  leadPrayer: Prayer;
  currentTime: Date;
  toggleTestSubuh: () => void;
}

const BottomContainer = (props: NextPrayerLayoutProps) => {
  const currentTime = createMemo(() => props.currentTime);
  return (
    <div class={styles.btmContainer}>
      <Clock time={currentTime()} />
      <div class={styles.prayersWrapper}>
        <For each={props.prayers}>
          {(prayer, index) => (
            <div class={styles.prayerBoxWrapper}>
              <PrayerBox prayer={prayer} />
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

const NextPrayerLayout = (props: NextPrayerLayoutProps) => {
  createEffect(() => {
    // console.log('PrayersList received updated prayers:', props.prayers);
  });

  return (
    <div class={styles.container}>
      <div class={styles.mainArea}>
        <Adhan leadPrayer={props.leadPrayer} currentTime={props.currentTime} />
        <button class={styles.testButton} onClick={() => props.toggleTestSubuh()}>Test Subuh</button>
      </div>
      <div class={styles.starsBorder}></div>
      <BottomContainer prayers={props.prayers} currentTime={props.currentTime} />
    </div>
  );
};

export default NextPrayerLayout;
