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
          <p class={styles.bookName}>- Hadith #{props.hadith.hadithNumber}, Chapter {props.hadith.chapter.id}: {props.hadith.chapter.chapterEnglish}, Book: {props.hadith.book.bookName} (Vol {props.hadith.volume}), by: {props.hadith.book.writerName}</p>
        </>
      ) : (
        <p>Loading hadith...</p>
      )}
    </div>
  );
};

export default HadithDisplay;