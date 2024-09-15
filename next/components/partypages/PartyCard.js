import cardStyles from '@/styles/gw/_card.module.sass'

export default function PartyCard({partyData}) {
  
  return (
    <>
      <div className={cardStyles.Card} id="party">
        <h6>團號：{partyData.numerical_order}</h6>
        <h6>開團時間：{partyData.start_at}</h6>
        <p>台麻十六張</p>
        <div className="rulesBox d-flex justify-content-start gap-2">
          <p>特殊規則:</p>
          <p>八仙過海</p>
          <p>明槓自摸</p>
          <p>換三張</p>
          <p>不靠牌</p>
        </div>
      </div>
    </>
  )
}
