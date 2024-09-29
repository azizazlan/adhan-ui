import { Component } from 'solid-js';
import { Hadith } from '../types/hadith';
import styles from './HadithDisplay.module.css';

interface HadithDisplayProps {
  hadith: Hadith | undefined;
}

const HadithDisplay: Component<HadithDisplayProps> = (props) => {
  return (
    <div class={styles.hadithContainer}>
      {props.hadith ? (
        <>
          <p class={styles.hadithTitle}>{props.hadith.headingEnglish}</p>
          <p class={styles.hadithText}>{props.hadith.hadithEnglish}</p>
          <p class={styles.bookName}>- Hadith #{props.hadith.hadithNumber}, {props.hadith.book.writerName}, {props.hadith.book.bookName}</p>
        </>
      ) : (
        <p>Loading hadith...</p>
      )}
    </div>
  );
};

export default HadithDisplay;