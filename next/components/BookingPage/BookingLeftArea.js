import RoomNav from '@/components/partypages/PartyRoomNav'
import PartyCard from '@/components/partypages/PartyCard'
import PhotoCard from '@/components/partypages/PhotoCard'
import ToKnow from '@/components/partypages/ToKnowCard'
import RoomCard from '../partypages/PageRoomCard'
import styles from '@/styles/Booking/_bookingLeftArea.module.scss'

export default function BookingLeftArea({ companyData,user,handleFavToggle=()=> {} }) {
  return (
    <div className={styles.leftArea}>
      <RoomNav companyData={companyData} />
      <RoomCard  handleFavToggle={handleFavToggle} user={user}  companyData={companyData} />
      <PhotoCard companyData={companyData} />
      <ToKnow />
    </div>
  )
}
