import RoomNav from '@/components/partypages/PartyRoomNav'
import PartyCard from '@/components/partypages/PartyCard'
import PhotoCard from '@/components/partypages/PhotoCard'
import ToKnow from '@/components/partypages/ToKnowCard'
import RoomCard from '@/components/partypages/PageRoomCard'
import styles from '@/styles/gw/_partyLeft.module.scss'

export default function PartyLeftArea({partyData,user,handleFavToggle=()=> {}}) {
  return (
    <>
      <div className={styles.leftArea}>
        <RoomNav partyData={partyData}/>
        <PartyCard  partyData={partyData}/>
        <RoomCard  handleFavToggle={handleFavToggle} user={user} partyData={partyData}/>
        <PhotoCard partyData={partyData}/>
        <ToKnow />
      </div>
    </>
  )
}
