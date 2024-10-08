import { Component, createSignal, createEffect, Show } from 'solid-js';
import { format } from 'date-fns';
import styles from './Datecomp.module.scss'; // Assuming you have a CSS module for this component

const API_HIJRI = "https://api.aladhan.com/v1/gToH/";

const Datecomp: Component = () => {
  const [gregorianDate, setGregorianDate] = createSignal<string | null>(null);
  const [hijriDate, setHijriDate] = createSignal<string | null>(null);

  const fetchHijriDate = async (today: Date) => {
    try {
      const gregorianDate = format(today, 'dd-MM-yyyy');
      const dayOfWeekEn = format(today, 'EEEE');

      const malaysianDayNames: { [key: string]: string } = {
        'Sunday': 'Ahad',
        'Monday': 'Isnin',
        'Tuesday': 'Selasa',
        'Wednesday': 'Rabu',
        'Thursday': 'Khamis',
        'Friday': 'Jumaat',
        'Saturday': 'Sabtu'
      };

      const malaysianDayName = malaysianDayNames[dayOfWeekEn];

      const response = await fetch(API_HIJRI + gregorianDate);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      // Extract Hijri date components
      const hijriDay = data.data.hijri.day;
      const hijriMonth = data.data.hijri.month.number.toString().padStart(2, '0');
      const hijriMonthName = data.data.hijri.month.en;
      const hijriYear = data.data.hijri.year;
      const formattedHijriDate = `${hijriDay}-${hijriMonth}(${hijriMonthName})-${hijriYear}`;


      setGregorianDate(`${malaysianDayName}, ${gregorianDate}.`);
      setHijriDate(formattedHijriDate);
    } catch (error) {
      console.error('Error fetching hijri date:', error);
      setGregorianDate('Error fetching date');
      setHijriDate(null);
    }
  };

  createEffect(() => {
    fetchHijriDate(new Date());
  });

  return (
    <Show when={hijriDate()} fallback={<div class={styles.container}>Loading...</div>}>
      <div class={styles.container}>
        {gregorianDate()} <span class={styles.hijriDate}>{hijriDate()}</span>
      </div>
    </Show>
  );
};

export default Datecomp;