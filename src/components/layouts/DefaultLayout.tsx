import { createEffect } from 'solid-js';
import Countdown from '../countdown';
import styles from './DefaultLayout.module.scss';
import PrayerTimeItem from './PrayerTimeItem';
import { DisplayMode } from '../App';
import { formatPrayerTime } from '../../utils/formatter';
import ClockAndDate from '../clock/ClockAndDate';
import PrayerBox from './PrayerBox';
import borderImage from '../../assets/images/border.png';
import { Prayer } from '../../types';

interface DefaultLayoutProps {
  prayers: Prayer[];
  currentTime: () => Date;
  toggleTestSubuh: () => void;
}

const DefaultLayout = (props: DefaultLayoutProps) => {
  createEffect(() => {
    // console.log('PrayersList received updated prayers:', props.prayers);
  });

  return (
    <div class={styles.container}>
      <div class={styles.mainArea}>Main area
        <button onClick={() => props.toggleTestSubuh()}>Test Subuh</button>
      </div>
      <div class={styles.starsBorder}></div>
      <div class={styles.btmContainer}>
        <ClockAndDate time={props.currentTime} />
        <div class={styles.prayerBoxes}>
          <For each={props.prayers}>
            {(prayer, index) => (
              <>
                <div class={styles.prayerBoxWrapper}>
                  <PrayerBox prayer={prayer} />
                </div>
                {index() < props.prayers.length - 1 && (
                  <div class={styles.separatorWrapper}>
                    <img
                      src={borderImage}
                      alt="Prayer separator"
                      class={styles.imageBorder}
                    />
                  </div>
                )}
              </>
            )}
          </For>
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
