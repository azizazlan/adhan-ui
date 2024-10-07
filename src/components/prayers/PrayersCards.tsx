import { Component } from 'solid-js';
import { Card } from 'solid-bootstrap';
import { format, parse } from 'date-fns';
import styles from './PrayersCards.module.scss';

interface PrayersCardsProps {
  prayers: Prayer[];
  activePrayer: string;
}

const PrayersCards: Component<PrayersCardsProps> = (props) => {
  const { prayers } = props;
  console.log(props.activePrayer);
  return (
    <div class={styles.container}>
      {prayers.map((prayer) => (
        <Card border={props.activePrayer === prayer.name ? 'success' : ''} class={styles.card}>
          <Card.Header class={props.activePrayer === prayer.name ? styles.activeCardHeader : styles.cardHeader}
            style={{
              color: props.activePrayer === prayer.name ? '#006266' : '', // White text for active prayer
              backgroundColor: props.activePrayer === prayer.name ? '#006266' : '' // White text for active prayer
            }}
          >{prayer.name}</Card.Header>
          <Card.Body>
            <div class={styles.time}>{format(parse(prayer.time, 'HH:mm', new Date()), 'h:mma')}</div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default PrayersCards;
