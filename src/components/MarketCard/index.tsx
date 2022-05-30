import { useState } from 'react';
import { Link } from 'react-router-dom';
import { diffTime } from '../../utils/commons';
import styles from './styles.module.scss';
interface Market {
  id: string,
  question: string,
  image: string,
}

type Props = {
  market: Market;
}

const MarketCard = ({market}:Props) => {

  const [eventEnd] = useState<Date>(new Date('2022-05-17'));

  const [days, hours, minutes] = diffTime(eventEnd, new Date(Date.now()));

  return (
    <Link
      to={`/market/${market.id}`}
      className={styles.marketContainer}
    >
      <img
        className={styles.thumb}
        alt={`Uploaded file`}
        src={market.image}
      />

      <div className={styles.overlay} />
      <div className={styles.betCard}>
        <span className={styles.title}>{market.question}</span>
      </div>

      {eventEnd && eventEnd > new Date() ? (
        <div className={styles.timerContainer}>
          <div className={styles.contentWrapper}>
            <span className={styles.timerLabel}>Ends in: </span>
            <span className={styles.timerValue}>{days || 0}</span>
            <span className={styles.timerUnit}>{days === 1 ? `day` : `days`}</span>
            <span className={styles.timerValue}>{hours || 0}</span>
            <span className={styles.timerUnit}>hrs </span>
            <span className={styles.timerValue}>{minutes || 0}</span>
            <span className={styles.timerUnit}>min </span>
          </div>
        </div>
      ) : (
        <div className={styles.timerContainer}>
          <div className={styles.contentWrapper}>
            <span className={styles.timerLabel}>
              {'Event ended'}
            </span>
          </div>
        </div>
      )}
    </Link>
  )
}

export default MarketCard;
