import styles from '@/styles/gw/_RoomCard.module.scss'
import cardStyles from '@/styles/gw/_card.module.sass'

import { TiStarFullOutline } from 'react-icons/ti'
import { FaAngleDown, FaHeart, FaPlus } from 'react-icons/fa'
import Server from '../serverIcon/server'

import toast from 'react-hot-toast'
import { Toaster } from 'react-hot-toast'

export default function RoomCard({
  companyData,
  partyData,
  user,
  handleFavToggle = () => {},
}) {
  const data = companyData || partyData
  const services = data.services || []

  console.log(companyData)

  return (
    <div className={cardStyles.Card} id="roomInfo">
      <div className={styles.open}>
        <div className={styles.roomTitle}>
          <div className={styles.logoArea}>
            <img
              alt="logo"
              src="/images/gw/img/Mahjong-masters-logo-transparent-horizontal-300x176.png"
            />
          </div>

          <div className={styles.nameArea}>
            <div className={styles.rate}>
              <div className="star">
                {[...Array(5)].map((_, i) => (
                  <TiStarFullOutline key={i} className={styles.starIcon} />
                ))}
                {`${data.name ? data.rating : data.rating}`}
              </div>
            </div>

            <div className="title">
              <h3 className="title">{`${
                data.name ? data.name : data.company_name
              }`}</h3>
            </div>
          </div>
        </div>

        <div>
          {user ? (
            <button
              onClick={() => {
                const id = data.company_id ? data.company_id : data.id
                handleFavToggle(id, 'company')
              }}
            >
              {data.fav ? <FaHeart className={styles.favIcon} color="red" /> : <FaPlus  className={styles.favIcon} />}
            </button>
          ) : (
            ''
          )}
        </div>
      </div>
      <div className={styles.roomAdBox}>
        <div className={styles.roomAdd}>
          <div className={styles.infotext}>
            <p>{data.address}</p>
            <p>{data.tele}</p>
          </div>
          <div className={styles.mapImg}>
            {/* <img
              alt="mapimg"
              src="/images/gw/img/Google_Maps_icon_(2015-2020).svg.png"
            /> */}
          </div>
        </div>
        <div>
          <div className="p">
            <a
              aria-controls="collapseExample"
              aria-expanded="false"
              data-bs-toggle="collapse"
              href="#collapseExample"
              role="button"
            >
              {`${data.open_time ? data.open_time : data.partyData.open_time}`}~
              {`${
                data.close_time ? data.close_time : data.partyData.close_time
              }`}
              <FaAngleDown />
            </a>
          </div>
        </div>
      </div>

      <div className={styles.serverBox}>
        {services.map((service, index) => (
          <Server key={index} service={service} />
        ))}
      </div>
      <div className={styles.roomIntroduction}>
        <div className={styles.title}>
          <h6>店家簡介</h6>
        </div>
        <div className={styles.content}>
          <p>
            麻將大師是只欠東風精選店家，場地均提供免費飲料與無限網路，同時提供熟食簡餐多樣選擇。
          </p>
          <p>
            麻將大師所有場館均使用東方不敗過山車電動麻將桌，給您最好的硬體享受，另有麻將包廂，給您安靜隱私的遊玩環境，數量有限，儘速預定。
          </p>
          <p>全館嚴格禁菸，定時清潔。</p>
        </div>
      </div>
      <div className={styles.roomPrice}>
        <div className={styles.title}>
          <h6>費用</h6>
        </div>
        <div className={styles.content}>
          <p>大廳：{data.lobby}/hr</p>
          <p>包廂：{data.vip}/hr</p>
        </div>
      </div>
    </div>
  )
}
