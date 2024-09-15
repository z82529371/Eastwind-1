import PlayerCard from './PlayerCard'
import styles from '@/styles/gw/_PartyPlayers.module.scss'
export default function PartyPlayers({partyData}) {

  const players = [
    { name: partyData.main_user_name, img: partyData.main_user_img, type: 'host' },
    { name: partyData.join1_user_name, img: partyData.join1_user_img, type: 'player' },
    { name: partyData.join2_user_name, img: partyData.join2_user_img, type: 'player' },
    { name: partyData.join3_user_name, img: partyData.join3_user_img, type: 'player' },
  ];
 
  return (
    <div className={styles.partyPlayers}>
      {players.map((player, index) => (
        <PlayerCard
          key={index}
          name={player.name || '等待加入'}
          img={player.img || 'waiting'}
          type={player.type}
        />
      ))}
    </div>
  )
}
