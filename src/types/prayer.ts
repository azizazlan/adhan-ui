export interface Prayer {
  name: string;
  time: string;
  mode: PrayerMode;
}

export enum PrayerMode {
  ACTIVE = 'ACTIVE',
  NEXT = 'NEXT',
  INACTIVE = 'INACTIVE',
}