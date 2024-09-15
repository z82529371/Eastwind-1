import PartyNav from '@/components/partypages/PartyNav'
import PartyPlayers from '@/components/partypages/PartyPlayers'
import JoinPartyBTN from '@/components/partypages/JoinPartyBTN'
import styles from '@/styles/gw/_partyRight.module.scss'

export default function PartyRightArea({ partyData, user }) {
  console.log(partyData)
  console.log(user)
  return (
    <div className={`${styles.rightArea} ${styles.stickyBooking}`}>
      <PartyNav />
      <PartyPlayers partyData={partyData} />
      <JoinPartyBTN user={user} partyData={partyData} />
    </div>
  )
}
