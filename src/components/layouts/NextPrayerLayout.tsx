import { createEffect, createMemo } from 'solid-js';
import { format } from 'date-fns';
import styles from './NextPrayerLayout.module.scss';
import { Clock } from '../clock';
import { PrayerBox } from '../prayer';
import star from '../../assets/images/star.png';
import { Prayer } from '../../types/Prayer';
import { DisplayMode } from '../../types/displaymode';
import Adhan from '../Adhan';
import Iqamah from '../iqamah/Iqamah';
import Devmode from '../devmode/Devmode';

interface NextPrayerLayoutProps {
  isTestMode: boolean;
  prayers: Prayer[];
  leadPrayer: Prayer;
  currentTime: Date;
  displayMode: DisplayMode;
  toggleTestSubuh: () => void;
  toggleTestSyuruk: () => void;
  lastApiTimestamp: number;
  toggleRefetch: () => void;
  toggleTestScreenIqamah: () => void;
}

const BottomContainer = (props: NextPrayerLayoutProps) => {
  const currentTime = createMemo(() => props.currentTime);
  return (
    <div class={styles.btmContainer}>
      <Clock isTestMode={props.isTestMode} time={currentTime()} />
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

  const currentTime = createMemo(() => props.currentTime);
  const displayMode = createMemo(() => props.displayMode);
  const lastApiTimestamp = createMemo(() => props.lastApiTimestamp);
  const isTestMode = createMemo(() => props.isTestMode);
  console.log('displayMode', displayMode());

  createEffect(() => {
    // console.log('PrayersList received updated prayers:', props.prayers);
  });

  const renderMainArea = () => {
    switch (displayMode()) {
      case DisplayMode.ADHAN:
        return <Adhan leadPrayer={props.leadPrayer} currentTime={props.currentTime} />
      case DisplayMode.PRAYER_TIME:
        return (
          <div class={styles.prayerTimeMessage}>It's prayer time!</div>
        );
      case DisplayMode.IQAMAH:
        return <Iqamah />
      default:
        if (import.meta.env.VITE_DEV_MODE === 'true') {
          return <Devmode
            toggleTestScreenIqamah={props.toggleTestScreenIqamah}
            toggleTestSubuh={props.toggleTestSubuh}
            toggleTestSyuruk={props.toggleTestSyuruk}
            toggleRefetch={props.toggleRefetch}
            lastApiTimestamp={lastApiTimestamp()}
          />
        }
        return <div>Default</div>
    }
  };

  return (
    <div class={styles.container}>
      <div class={styles.mainArea}>
        {renderMainArea()}
      </div>
      <div class={styles.starsBorder}></div>
      <BottomContainer prayers={props.prayers} currentTime={props.currentTime} isTestMode={isTestMode()} />
    </div>
  );

};

export default NextPrayerLayout;
