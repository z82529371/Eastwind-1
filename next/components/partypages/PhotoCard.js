import styles from '@/styles/gw/_photo.module.scss'
import cardStyles from '@/styles/gw/_card.module.sass'
const DEFAULT_PHOTO = '/images/boyu/logo.svg';

export default function PhotoCard({ companyData,partyData }) {
  console.log(partyData)
  const data = companyData || partyData
  console.log(data)


 // 確保 company_photos 是一個數組，如果為 null 則使用空數組
 const photos = data.company_photos 
 ? data.company_photos.split(',') 
 : [];
console.log(photos);
// 確保總是有 5 個元素的數組
const photoArray = Array(5).fill(null);

  return (
    <div className={cardStyles.Card} id="photo">
    <h6>相片</h6>
      <div className={styles.imgArea}>
        {[...Array(5)].map((_, index) => (
          <div 
            key={index} 
            className={`${styles.photoWrapper} ${styles[`photo${index + 1}`]}`}
          >
            <img 
              src={photos[index] ? `/images/company/${photos[index].trim()}` : DEFAULT_PHOTO}
              alt={`Company photo ${index + 1}`}
            />
          </div>
        ))}
      </div>
    </div>

  )
}
