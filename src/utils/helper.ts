
const SHOW_LASTTHIRD = import.meta.env.VITE_SHOW_LASTTHIRD === 'true';
const VITE_ADHAN_MINS = Math.max(0, parseInt(import.meta.env.VITE_ADHAN_MINS || '10', 10));

const isPrayerTimePast = (now: Date, prayerTime: string, prayerName: string) => {
  // const now = currentDateTime();
  const [hours, minutes] = prayerTime.split(':').map(Number);
  let prayerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

  // If it's Lastthird and the time is before the current time, assume it's for the next day
  if (SHOW_LASTTHIRD && prayerName === 'Las3rd' && prayerDate < now) {
    prayerDate.setDate(prayerDate.getDate() + 1);
  }

  // The prayer time has passed more than 10 minutes ago
  const afterMinutesAgo = new Date(now.getTime() - VITE_ADHAN_MINS * 60 * 1000);
  return prayerDate < afterMinutesAgo;
};
export { isPrayerTimePast };

const isCurrentPrayer = (prayerName: string, currentPrayer: string) => prayerName === currentPrayer;
export { isCurrentPrayer };
