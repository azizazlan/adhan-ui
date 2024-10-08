export interface Prayer {
  name: string;
  time: string;
  mode: PrayerMode;
}

export enum PrayerMode {
  ACTIVE = 'ACTIVE', // Current prayer timing is within the current time and the next prayer timing
  IMMEDIATE_NEXT = 'IMMEDIATE_NEXT', // It is the immediate next of the ACTIVE or current prayer 
  NEXT = 'NEXT', // Next prayer timing
  INACTIVE = 'INACTIVE', // Prayer's timing is already past current time
}