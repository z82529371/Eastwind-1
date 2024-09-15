import { useRouter } from 'next/router'

import styles from '@/styles/gw/_RoomEnterPage.module.scss'

const RoomOption = ({ text, imageUrl, className, onClick }) => (
  <div
    className={`${styles.roomOption} ${styles[className]}`}
    style={{ backgroundImage: `url(${imageUrl})` }}
    onClick={onClick}
  >
    <div className={styles.text}>{text}</div>
    <div className={styles.blackMask} />
  </div>
)

export default function Entrance() {
  const router = useRouter()
  const handlePartyClick = () => {
    router.push('/lobby/Lobby?view=join')
  }
  const handleCompanyClick = () => {
    router.push('/lobby/Lobby?view=host')
  }
  return (
    <div className={styles.room}>
      <RoomOption
        onClick={handleCompanyClick}
        text="我要訂桌"
        imageUrl="/images/gw/img/001.JPG"
        className="bookingBox"
      />
      <RoomOption
        text="我要參團"
        imageUrl="/images/gw/img/002.jpg"
        onClick={handlePartyClick}
        className="partyRoom"
      />
    </div>
  )
}
