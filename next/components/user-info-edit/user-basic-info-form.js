import React from 'react'
import styles from '@/styles/boyu/user-info-edit.module.scss'

export default function UserBasicInfoForm({
  formValues,
  errors,
  onInputChange,
  sendVerificationEmail,
  showConfirmPassword,
}) {
  return (
    <div
      className={`${styles['default-information-box-bo']} col-12  col-lg-8 d-flex flex-column justify-content-center align-items-center`}
    >
      <div className={`${styles['default-information-title-bo']} h5`}>
        基本資訊
      </div>
      <div
        className={`${styles['default-information-form-bo']} justify-content-center align-items-center d-flex flex-column`}
      >
        <div
          className={`${styles['info-col-bo']} d-flex justify-content-center flex-column flex-sm-row`}
        >
          <h6 className={`${styles['info-name-bo']} h6`}>email</h6>
          <div className={`w-100 d-flex justify-content-center  gap-3 `}>
            <input
              type="text"
              className={`${styles['info-text-bo']} h6 d-flex align-items-center`}
              value={formValues.email || ''} // 確保 value 有預設值
              onChange={onInputChange}
              name="email"
              placeholder="請輸入需修改的email"
            />
            <button
              className={`${styles['btn-email-bo']} btn p`}
              type="button"
              onClick={sendVerificationEmail}
            >
              驗證
            </button>
          </div>
        </div>
        {(errors.email || errors.emailVerified) && (
          <div className={`d-flex justify-content-start w-100 mb-3`}>
            <p className={`${styles['text-error-bo']} p`}>
              {errors.email || errors.emailVerified}
            </p>
          </div>
        )}
        <div
          className={`${styles['info-col-bo']} d-flex justify-content-center flex-column flex-sm-row`}
        >
          <h6 className={`${styles['info-name-bo']} h6`}>帳號</h6>
          <input
            type="text"
            className={`${styles['info-text-bo']} h6 d-flex align-items-center`}
            value={formValues.account || ''} // 確保 value 有預設值
            onChange={onInputChange}
            name="account"
            placeholder="請輸入需修改的帳號"
          />
        </div>
        {errors.account && (
          <div className={`d-flex justify-content-start w-100 mb-3`}>
            <p className={`${styles['text-error-bo']} p`}>{errors.account}</p>
          </div>
        )}
        <div
          className={`${styles['info-col-bo']} d-flex justify-content-center flex-column flex-sm-row`}
        >
          <h6 className={`${styles['info-name-bo']} h6`}>密碼</h6>
          <input
            type="password" // 使用 type="password" 隱藏密碼
            className={`${styles['info-text-bo']} h6 d-flex align-items-center`}
            value={formValues.password || ''} // 確保 value 有預設值
            onChange={onInputChange}
            name="password"
            placeholder="請輸入需修改的密碼"
          />
        </div>
        {errors.password && (
          <div className={`d-flex justify-content-start w-100 mb-3`}>
            <p className={`${styles['text-error-bo']} p`}>{errors.password}</p>
          </div>
        )}
        {showConfirmPassword && (
          <>
            <div
              className={`${styles['info-col-bo']} d-flex justify-content-center flex-column flex-sm-row`}
            >
              <h6 className={`${styles['info-name-bo']} h6`}>確認</h6>
              <input
                type="password" // 這裡改成 text 顯示原密碼
                className={`${styles['info-text-bo']} h6 d-flex align-items-center`}
                value={formValues.confirmPassword || ''} // 確保 value 有預設值
                onChange={onInputChange}
                name="confirmPassword"
                placeholder="請再次輸入密碼"
              />
            </div>
            {errors.confirmPassword && (
              <div className={`d-flex justify-content-start w-100 mb-3`}>
                <p className={`${styles['text-error-bo']} p`}>
                  {errors.confirmPassword}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
