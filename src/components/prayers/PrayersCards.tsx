import { Component } from 'solid-js';
import { Card } from 'solid-bootstrap';
import { format, parse } from 'date-fns';
import styles from './PrayersCards.module.scss';
import { PrayerMode } from '../../types/prayer';
interface PrayersCardsProps {
  prayers: Prayer[];
}

const PrayersCards: Component<PrayersCardsProps> = (props) => {
  const { prayers } = props;
  return (
    <div class={styles.container}>
      {prayers.map((prayer) => (
        <Card border={prayer.name !== 'Syuruk' && prayer.mode === PrayerMode.IMMEDIATE_NEXT ? 'success' : ''} class={styles.card}>
          <Card.Header class={prayer.name !== 'Syuruk' && prayer.mode === PrayerMode.IMMEDIATE_NEXT ? styles.activeCardHeader : styles.cardHeader}
          >{prayer.name}</Card.Header>
          <Card.Body class={prayer.name !== 'Syuruk' && prayer.mode === PrayerMode.IMMEDIATE_NEXT ? styles.activeBody : ''}>
            <div
              class={prayer.name !== 'Syuruk' && prayer.mode === PrayerMode.IMMEDIATE_NEXT ? styles.activeTime : styles.time}>
              {format(parse(prayer.time, 'HH:mm', new Date()), 'h:mma')}
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default PrayersCards;
