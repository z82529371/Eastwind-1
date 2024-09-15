import styles from "@/styles/gw/_PlayerCard.module.scss";

export default function PlayerCard({ name, img, type }) {

  return (
    <div className={`${styles.playerCard} ${styles[type]}`}>
    <div className={styles.playerImg}>
      <img src={`/images/boyu/users/${img}.jpg`} alt={name} />
    </div>
    <div className={styles.cardBody}>
      <h3 className={styles.playerName}>{name}</h3>
      <span className={styles.playerType}>
        {type === 'host' ? '主揪' : '參團'}
      </span>
    </div>
  </div>
  );
}
