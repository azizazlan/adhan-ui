import { Component, createSignal, createEffect, Show } from 'solid-js';
import { format } from 'date-fns';
import styles from './Datecomp.module.scss'; // Assuming you have a CSS module for this component

const API_HIJRI = "https://api.aladhan.com/v1/gToH/";

const Datecomp: Component = () => {
  const [formattedDate, setFormattedDate] = createSignal<string | null>(null);

  const fetchHijriDate = async (today: Date) => {
    try {
      const gregorianDate = format(today, 'dd-MM-yyyy');
      const dayOfWeek = format(today, 'EEE');

      const response = await fetch(API_HIJRI + gregorianDate);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      setFormattedDate(`${dayOfWeek},${gregorianDate}. ${data.data.hijri.date} ${data.data.hijri.month.en}`);
    } catch (error) {
      console.error('Error fetching hijri date:', error);
      setFormattedDate('Error fetching date');
    }
  };

  createEffect(() => {
    fetchHijriDate(new Date());
  });

  return (
    <Show when={formattedDate()} fallback={<div class={styles.container}>Loading...</div>}>
      <div class={styles.container}>
        {formattedDate()}
      </div>
    </Show>
  );
};

export default Datecomp;