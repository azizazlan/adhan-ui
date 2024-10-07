import { Component, createSignal, createEffect, onMount } from 'solid-js';
import { Hadith, HadithApiResponse } from '../types/hadith';
import { IoCaretForward } from 'solid-icons/io'
import { IoCaretBack } from 'solid-icons/io'
import { IoCloseCircleOutline } from 'solid-icons/io'
import styles from './Hadiths.module.scss';

interface HadithDisplayProps {
  apiKey: string;
  onClose: () => void;
}

const SHOW_NEXT_HADITH_INTERVAL_MS = Math.max(0, parseInt(import.meta.env.VITE_SHOW_NEXT_HADITH_INTERVAL_MS || '10000', 10));

const HadithDisplay: Component<HadithDisplayProps> = (props) => {

  const [currentHadith, setCurrentHadith] = createSignal<Hadith | undefined>(undefined);
  const [hadiths, setHadiths] = createSignal<Hadith[]>([]);
  const [currentHadithIndex, setCurrentHadithIndex] = createSignal(0);

  const fetchHadiths = async () => {
    const apiUrl = `https://www.hadithapi.com/public/api/hadiths?apiKey=${props.apiKey}&paginate=100`;

    try {
      const response = await fetch(apiUrl);
      const data: HadithApiResponse = await response.json();
      if (data.status === 200 && data.hadiths && data.hadiths.data) {
        setHadiths(data.hadiths.data);
        if (data.hadiths.data.length > 0) {
          setCurrentHadith(data.hadiths.data[0]);
        }
      } else {
        console.error('Failed to fetch hadiths or unexpected data structure');
      }
    } catch (error) {
      console.error('Error fetching hadiths:', error);
    }
  };

  const getNextHadith = () => {
    const hadithsArray = hadiths();
    if (hadithsArray.length === 0) {
      return;
    }
    const nextIndex = (currentHadithIndex() + 1) % hadithsArray.length;
    setCurrentHadithIndex(nextIndex);
    setCurrentHadith(hadithsArray[nextIndex]);
  };

  const getPreviousHadith = () => {
    const hadithsArray = hadiths();
    if (hadithsArray.length === 0) {
      return;
    }
    const previousIndex = (currentHadithIndex() - 1 + hadithsArray.length) % hadithsArray.length;
    setCurrentHadithIndex(previousIndex);
    setCurrentHadith(hadithsArray[previousIndex]);
  };

  createEffect(() => {
    fetchHadiths();

    const toggleInterval = setInterval(() => {
      getNextHadith();
    }, SHOW_NEXT_HADITH_INTERVAL_MS);

    return () => {
      clearInterval(toggleInterval);
    };
  });


  return (
    <div class={styles.hadithContainer}>
      <div class={styles.toolbar}>
        <div class={styles.arrowContainer}>
          <button class={styles.iconButton} onClick={getPreviousHadith} title="Previous Hadith">
            <IoCaretBack class={styles.arrowBck} />
          </button>
          <button class={styles.iconButton} onClick={getNextHadith} title="Next Hadith">
            <IoCaretForward class={styles.arrowFwd} />
          </button>
        </div>
        <button class={styles.iconButton} onClick={props.onClose} title="Close Settings">
          <IoCloseCircleOutline class={styles.closeIconButton} />
        </button>
      </div>
      {currentHadith() ? (
        <>
          <p class={styles.hadithTitle}>{currentHadith().headingEnglish}</p>
          <p class={styles.hadithText}>{currentHadith().hadithEnglish}</p>
          <p class={styles.bookName}>Hadith #{currentHadith().hadithNumber} Status: {currentHadith().status},
            Chapter {currentHadith().chapter.id}: {currentHadith().chapter.chapterEnglish}, {currentHadith().book.bookName} (Vol {currentHadith().volume}),
            by: {currentHadith().book.writerName}</p>
        </>
      ) : (
        <p>Loading hadith...</p>
      )}
    </div>
  );
};

export default HadithDisplay;