import React from 'react'
import styles from '@/styles/boyu/user-info-edit.module.scss'

export default function UserDetailInfoForm({
  formValues,
  errors,
  onInputChange,
  currentYear,
  earliestYear,
}) {
  return (
    <div
      className={`${styles['detail-information-box-bo']} col-12 col-lg-8 d-flex flex-column justify-content-center align-items-center`}
    >
      <div className={`${styles['detail-information-title-bo']} h5`}>
        詳細資訊
      </div>
      <div
        className={`${styles['detail-information-form-bo']} justify-content-center align-items-center d-flex flex-column`}
      >
        <div
          className={`${styles['info-col-bo']} d-flex justify-content-center flex-column flex-sm-row`}
        >
          <h6 className={`${styles['info-name-bo']} h6`}>姓名</h6>
          <input
            type="text"
            className={`${styles['info-text-bo']} h6 d-flex align-items-center`}
            value={formValues.username || ''} // 確保 value 有預設值
            onChange={onInputChange}
            name="username"
            placeholder="請輸入需修改的姓名"
          />
        </div>
        {errors.username && (
          <div className={`d-flex justify-content-start w-100 mb-3`}>
            <p className={`${styles['text-error-bo']} p`}>{errors.username}</p>
          </div>
        )}
        <div
          className={`${styles['info-col-bo']} d-flex justify-content-center flex-column flex-sm-row`}
        >
          <h6 className={`${styles['info-name-bo']} h6`}>性別</h6>
          <select
            className={`${styles['info-text-bo']} ${styles['input-select']} h6 d-flex align-items-center`}
            value={formValues.gender || ''} // 確保 value 有預設值
            onChange={onInputChange}
            name="gender"
          >
            <option value="">請選擇性別</option>
            <option value="男">男</option>
            <option value="女">女</option>
          </select>
        </div>

        {errors.gender && (
          <div className={`d-flex justify-content-start w-100 mb-3`}>
            <p className={`${styles['text-error-bo']} p`}>{errors.gender}</p>{' '}
          </div>
        )}
        <div
          className={`${styles['info-col-bo']} d-flex justify-content-center flex-column flex-sm-row`}
        >
          <h6 className={`${styles['info-name-bo']} h6`}>生日</h6>
          <div className={`d-flex w-100 gap-3`}>
            <select
              className={`${styles['info-text-bo']} ${styles['input-select']} h6 d-flex align-items-center`}
              value={formValues.year}
              onChange={(e) => onInputChange(e, 'year')}
              name="year"
            >
              <option value="">西元年</option>
              {Array.from({ length: 101 }, (_, i) => {
                const year = currentYear - i
                if (year <= earliestYear) {
                  return (
                    <option key={i} value={year}>
                      {year}
                    </option>
                  )
                }
                return null
              })}
            </select>

            <select
              className={`${styles['info-text-bo']} ${styles['input-select']} h6 d-flex align-items-center`}
              value={formValues.month}
              onChange={(e) => onInputChange(e, 'month')}
              name="month"
            >
              <option value="">月份</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={String(i + 1).padStart(2, '0')}>
                  {i + 1}
                </option>
              ))}
            </select>

            <select
              className={`${styles['info-text-bo']} ${styles['input-select']} h6 d-flex align-items-center`}
              value={formValues.day}
              onChange={(e) => onInputChange(e, 'day')}
              name="day"
            >
              <option value="">日期</option>
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i} value={String(i + 1).padStart(2, '0')}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>
        {errors.birthDate && (
          <div className={`d-flex justify-content-start w-100 mb-3`}>
            <p className={`${styles['text-error-bo']} p`}>{errors.birthDate}</p>{' '}
          </div>
        )}
        <div
          className={`${styles['info-col-bo']} d-flex justify-content-center flex-column flex-sm-row`}
        >
          <h6 className={`${styles['info-name-bo']} h6`}>地址</h6>
          <div className={`w-100 d-flex justify-content-center  gap-3 `}>
            <select
              className={`${styles['info-text-bo']} ${styles['info-city-bo']} ${styles['input-select']} h6 d-flex align-items-center`}
              value={formValues.city || ''} // 確保 value 有預設值
              onChange={onInputChange}
              name="city"
            >
              <option value="">請選擇縣市</option>
              <option value="台北市">台北市</option>
              <option value="新北市">新北市</option>
              <option value="桃園市">桃園市</option>
              <option value="台中市">台中市</option>
              <option value="台南市">台南市</option>
              <option value="高雄市">高雄市</option>
              <option value="基隆市">基隆市</option>
              <option value="新竹市">新竹市</option>
              <option value="嘉義市">嘉義市</option>
              <option value="苗栗縣">苗栗縣</option>
              <option value="彰化縣">彰化縣</option>
              <option value="南投縣">南投縣</option>
              <option value="雲林縣">雲林縣</option>
              <option value="嘉義縣">嘉義縣</option>
              <option value="屏東縣">屏東縣</option>
              <option value="宜蘭縣">宜蘭縣</option>
              <option value="花蓮縣">花蓮縣</option>
              <option value="台東縣">台東縣</option>
              <option value="澎湖縣">澎湖縣</option>
              <option value="金門縣">金門縣</option>
              <option value="連江縣">連江縣</option>
            </select>
            <input
              type="text"
              className={`${styles['info-text-bo']} h6 d-flex align-items-center`}
              value={formValues.address || ''} // 確保 value 有預設值
              onChange={onInputChange}
              name="address"
              placeholder="請輸入需修改的地址"
            />
          </div>
        </div>
        <div className="d-flex justify-align-start w-100 gap-4 mb-3">
          {errors.city && (
            <p className={`${styles['text-error-bo']} p`}>{errors.city}</p>
          )}
          {errors.address && <p className={` p`}>{errors.address}</p>}
        </div>
        <div
          className={`${styles['info-col-bo']} d-flex justify-content-center flex-column flex-sm-row`}
        >
          <h6 className={`${styles['info-name-bo']} h6`}>手機</h6>
          <input
            type="text"
            className={`${styles['info-text-bo']} h6 d-flex align-items-center`}
            value={formValues.phone || ''} // 確保 value 有預設值
            onChange={onInputChange}
            name="phone"
            placeholder="請輸入需修改的手機號碼"
          />
        </div>
        {errors.phone && (
          <div className={`d-flex justify-content-start w-100 mb-3`}>
            <p className={`${styles['text-error-bo']} p`}>{errors.phone}</p>
          </div>
        )}
      </div>
    </div>
  )
}
