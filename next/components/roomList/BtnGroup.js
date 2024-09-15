import { RiExpandUpDownFill } from 'react-icons/ri'
import { IoMdFunnel } from 'react-icons/io'
import styles from '@/styles/gw/_BTNGroup.module.sass'

const cityToArea = {
  北區: ['台北市', '新北市', '桃園市', '基隆市'],
  中區: [
    '台中市',
    '新竹縣',
    '苗栗縣',
    '彰化縣',
    '南投縣',
    '雲林縣',
    '嘉義縣',
    '新竹市',
  ],
  南區: ['臺南市', '高雄市', '屏東縣', '嘉義市'],
}

export default function BTNGroup({ onAreaChange, selectedArea }) {
  const handleAreaClick = (area) => {
    onAreaChange(area === selectedArea ? null : area)
  }
  return (
    <div className={styles.BTNgroup}>
      <div className={styles.areaBTN}>
        {Object.keys(cityToArea).map((area) => (
          <button
            key={area}
            className={`${styles.btn} ${
              selectedArea === area ? styles.active : ''
            }`}
            onClick={() => handleAreaClick(area)}
          >
            {area}
          </button>
        ))}
      </div>
      <div className={styles.icons}>
        <div>{/* <RiExpandUpDownFill /> */}</div>
        <div>{/* <IoMdFunnel /> */}</div>
      </div>
    </div>
  )
}
