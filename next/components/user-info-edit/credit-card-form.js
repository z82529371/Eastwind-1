import { useState, useEffect } from 'react'
import styles from '@/styles/boyu/user-info-edit.module.scss'
import { HiCreditCard } from 'react-icons/hi2'
import {
  FaCcVisa,
  FaCcMastercard,
  FaTrashCan,
  FaPlus,
  FaCheck,
} from 'react-icons/fa6'
import Swal from 'sweetalert2'

export default function CreditCardForm({ cards, setCards, user }) {
  // 信用卡相關狀態
  const [showNewCardForm, setShowNewCardForm] = useState(false) // 是否顯示新增信用卡表單
  const [errorMessage, setErrorMessage] = useState('') // 錯誤訊息
  const [newCard, setNewCard] = useState({
    card_name: '',
    card_number: '',
    card_type: '',
    exp_date: '',
  })

  const [cardNumberParts, setCardNumberParts] = useState({
    part1: '',
    part2: '',
    part3: '',
    part4: '',
  })

  const updateCardNumberPart = (event, part) => {
    const { value } = event.target

    // 監聽 Backspace 鍵按下的情況
    if (event.key === 'Backspace') {
      if (value.length === 0) {
        const prevInput = document.querySelector(
          `input[name="${part}"]`
        ).previousSibling
        if (prevInput) {
          prevInput.focus()
          const prevValue = cardNumberParts[prevInput.name]
          if (prevValue.length > 0) {
            setCardNumberParts({
              ...cardNumberParts,
              [prevInput.name]: prevValue.slice(0, -1),
            })
          }
        }
        return
      }
    }

    // 僅接受4位數字的輸入
    if (/^\d{0,4}$/.test(value)) {
      setCardNumberParts({
        ...cardNumberParts,
        [part]: value,
      })

      // 自動判斷卡片類型
      if (part === 'part1' && value.length > 0) {
        const firstDigit = value.charAt(0)
        let cardType = 'MasterCard'
        if (firstDigit === '4') {
          cardType = 'Visa'
        }
        setNewCard({
          ...newCard,
          card_type: cardType,
        })
      }

      // 當輸入4位數字後自動跳轉到下一個輸入框
      if (value.length === 4) {
        const nextInput = document.querySelector(
          `input[name="${part}"]`
        ).nextSibling
        if (nextInput) {
          nextInput.focus()
        }
      }
    }
  }

  const expDateChange = (event) => {
    const { value } = event.target
    let newValue = value.replace(/\D/g, '') // 移除非數字字符

    // 處理月份部分
    if (newValue.length >= 2) {
      let month = parseInt(newValue.slice(0, 2), 10)

      if (month > 12) {
        month = 12 // 如果月份大於12，自動修正為12
      } else if (month < 1) {
        month = 1 // 如果月份小於1，自動修正為01
      }

      // 格式化月份為兩位數
      newValue = `${month < 10 ? `0${month}` : month}${newValue.slice(2)}`
    }

    // 限制總長度不超過5字符
    if (newValue.length > 4) {
      newValue = newValue.slice(0, 4)
    }

    // 插入斜線，格式化為MM/YY
    if (newValue.length > 2) {
      newValue = `${newValue.slice(0, 2)}/${newValue.slice(2)}`
    }

    setNewCard({
      ...newCard,
      exp_date: newValue,
    })
  }

  const submitCardNumber = () => {
    if (validateCardInfo()) {
      const fullCardNumber = `${cardNumberParts.part1}${cardNumberParts.part2}${cardNumberParts.part3}${cardNumberParts.part4}`
      setNewCard({
        ...newCard,
        card_number: fullCardNumber,
      })
    }
  }

  const validateCardInfo = () => {
    if (!newCard.card_name.trim()) {
      setErrorMessage('請輸入卡片名稱')
      return false
    }

    const fullCardNumber = `${cardNumberParts.part1}${cardNumberParts.part2}${cardNumberParts.part3}${cardNumberParts.part4}`
    if (fullCardNumber.length !== 16 || !/^\d{16}$/.test(fullCardNumber)) {
      setErrorMessage('請輸入有效的16位數字卡號')
      return false
    }

    if (!/^\d{2}\/\d{2}$/.test(newCard.exp_date)) {
      setErrorMessage('請輸入有效日期格式 (MM/YY)')
      return false
    }

    // 檢查日期不能低於當前日期
    const currentDate = new Date()
    const [month, year] = newCard.exp_date.split('/').map(Number)
    const expDate = new Date(`20${year}`, month - 1)

    if (expDate < currentDate) {
      setErrorMessage('信用卡有效期不能早於當前日期')
      return false
    }

    setErrorMessage('') // 清空錯誤訊息
    return true
  }

  const addCardClick = () => {
    if (cards.length >= 4) {
      Swal.fire({
        title: '信用卡數量已達上限',
        html: `<span class="p">您最多只能新增 4 張信用卡</span>`,
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          title: 'h6',
          icon: `${styles['swal-icon-bo']}`,
          confirmButton: `${styles['swal-btn-bo']}`,
        },
      })
    } else if (showNewCardForm) {
      submitCardNumber() // 確認新增，將卡號合併並提交
    } else {
      setShowNewCardForm(true) // 顯示信用卡輸入框
      setErrorMessage('') // 清空錯誤訊息
    }
  }

  const deleteCard = (cardId) => {
    Swal.fire({
      title: '您確定要刪除這張信用卡嗎？',
      html: `<span class="p">刪除後將無法復原，請確認</span>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '確認刪除',
      cancelButtonText: '取消',
      customClass: {
        popup: `${styles['swal-popup-bo']}`,
        title: 'h6',
        icon: `${styles['swal-icon-bo']}`,
        confirmButton: `${styles['swal-btn-bo']}`,
        cancelButton: `${styles['swal-btn-cancel-bo']}`,
      },
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(
          `http://localhost:3005/api/user-edit/invalidate-card/${user.id}/${cardId}`,
          {
            method: 'PUT',
          }
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.status === 'success') {
              setCards(cards.filter((card) => card.id !== cardId))
              Swal.fire({
                title: '刪除成功！',
                icon: 'success',
                confirmButtonText: 'OK',
                customClass: {
                  title: 'h6',
                  icon: `${styles['swal-icon-bo']}`,
                  confirmButton: `${styles['swal-btn-bo']}`,
                },
              })
            } else {
              setErrorMessage('刪除失敗，請稍後再試')
            }
          })
          .catch((error) => {
            setErrorMessage('伺服器錯誤，請稍後再試')
          })
      }
    })
  }

  const addCard = async () => {
    try {
      const response = await fetch(
        `http://localhost:3005/api/user-edit/add-card/${user.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCard),
        }
      )

      const data = await response.json()

      if (data.status === 'success') {
        setCards([...cards, data.data])
        setNewCard({
          card_name: '',
          card_number: '',
          card_type: '',
          exp_date: '',
        })
        setCardNumberParts({
          part1: '',
          part2: '',
          part3: '',
          part4: '',
        })
        Swal.fire({
          title: '信用卡新增成功！',
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            title: 'h6',
            icon: `${styles['swal-icon-bo']}`,
            confirmButton: `${styles['swal-btn-bo']}`,
          },
        })
        setShowNewCardForm(false) // 新增成功後隱藏表單
        setErrorMessage('') // 清空錯誤訊息
      } else {
        setErrorMessage('新增失敗，請稍後再試')
      }
    } catch (error) {
      setErrorMessage('伺服器錯誤，請稍後再試')
    }
  }
  useEffect(() => {
    if (user) {
      fetch(`http://localhost:3005/api/user/user/${user.id}/cards`)
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 'success') {
            setCards(data.data)
          }
        })
        .catch()
    }
  }, [user])

  useEffect(() => {
    if (newCard.card_number) {
      addCard()
    }
  }, [newCard.card_number])

  return (
    <div
      className={`${styles['detail-card-box-bo']} col-12 col-xl-4 d-flex flex-column justify-content-start align-items-center`}
    >
      <div className={`${styles['detail-card-title-bo']} h5`}>信用卡</div>
      <div
        className={`${styles['detail-card-list-bo']} d-flex flex-column gap-4`}
      >
        {cards.length === 0 ? (
          <p className="h6 text-center">尚未增加信用卡</p>
        ) : (
          cards.map((card, index) => (
            <div
              key={index}
              className={`${styles['card-col-bo']} d-flex justify-content-center align-items-center`}
            >
              <div
                className={`${styles['card-body-bo']} d-flex justify-content-between align-items-center`}
              >
                <div className={styles['icon-card-box-bo']}>
                  <HiCreditCard className={`${styles['icon-card-bo']}`} />
                </div>
                <div className={styles['card-text-box-bo']}>
                  <div
                    className={`${styles['card-text-up-bo']} d-flex justify-content-between align-items-center`}
                  >
                    <p>{card.card_name}</p>
                  </div>
                  <div
                    className={`${styles['card-text-down-bo']} d-flex justify-content-between align-items-center gap-1 p`}
                  >
                    <p>{card.card_number.slice(0, 4)}</p>
                    <p>{card.card_number.slice(4, 8)}</p>
                    <p>{card.card_number.slice(8, 12)}</p>
                    <p>{card.card_number.slice(-4)}</p>
                  </div>
                </div>
                <div
                  className={`${styles['card-date-box-bo']} d-flex flex-column justify-content-center align-items-center`}
                >
                  {card.card_type === 'Visa' ? (
                    <FaCcVisa className={`${styles['icon-visa-bo']}`} />
                  ) : (
                    <FaCcMastercard className={`${styles['icon-master-bo']}`} />
                  )}
                  <p className={styles['card-date-bo']}>{card.exp_date}</p>
                </div>
                <div className={styles['trash-can-box-bo']}>
                  <FaTrashCan
                    className={styles['icon-trashcan-bo']}
                    onClick={() => deleteCard(card.id)}
                  />
                </div>
              </div>
            </div>
          ))
        )}
        {showNewCardForm && (
          <div
            className={`${styles['card-col-bo']} d-flex justify-content-center align-items-center gap-1`}
          >
            <div
              className={`${styles['card-body-bo']} d-flex justify-content-between align-items-center`}
            >
              <div className={styles['icon-card-box-bo']}>
                <HiCreditCard className={`${styles['icon-card-bo']}`} />
              </div>
              <div className={styles['card-text-box-bo']}>
                <div
                  className={`${styles['card-text-up-bo']} d-flex justify-content-between align-items-center`}
                >
                  <input
                    type="text"
                    className={`${styles['info-card-bo']} ${styles['input-card-name-bo']} p `}
                    value={newCard.card_name}
                    onChange={(e) =>
                      setNewCard({ ...newCard, card_name: e.target.value })
                    }
                    name="card_name"
                    placeholder="卡片名稱"
                    autoComplete="off"
                  />
                </div>
                <div
                  className={`${styles['card-text-down-bo']} d-flex justify-content-between align-items-center gap-1 p`}
                >
                  <input
                    type="text"
                    name="part1"
                    maxLength="4"
                    className={`${styles['info-card-bo']} p `}
                    value={cardNumberParts.part1}
                    onChange={(e) => updateCardNumberPart(e, 'part1')}
                    onKeyDown={(e) => updateCardNumberPart(e, 'part1')}
                    autoComplete="off"
                    placeholder="卡號"
                  />
                  <input
                    type="text"
                    name="part2"
                    maxLength="4"
                    className={`${styles['info-card-bo']} p `}
                    value={cardNumberParts.part2}
                    onChange={(e) => updateCardNumberPart(e, 'part2')}
                    onKeyDown={(e) => updateCardNumberPart(e, 'part2')}
                    autoComplete="off"
                  />
                  <input
                    type="text"
                    name="part3"
                    maxLength="4"
                    className={`${styles['info-card-bo']} p `}
                    value={cardNumberParts.part3}
                    onChange={(e) => updateCardNumberPart(e, 'part3')}
                    onKeyDown={(e) => updateCardNumberPart(e, 'part3')}
                    autoComplete="off"
                  />
                  <input
                    type="text"
                    name="part4"
                    maxLength="4"
                    className={`${styles['info-card-bo']} p `}
                    value={cardNumberParts.part4}
                    onChange={(e) => updateCardNumberPart(e, 'part4')}
                    onKeyDown={(e) => updateCardNumberPart(e, 'part4')}
                    autoComplete="off"
                  />
                </div>
              </div>
              <div
                className={`${styles['card-date-box-bo']} d-flex flex-column justify-content-center align-items-center`}
              >
                {newCard.card_type === 'Visa' ? (
                  <FaCcVisa className={`${styles['icon-visa-bo']}`} />
                ) : (
                  <FaCcMastercard className={`${styles['icon-master-bo']}`} />
                )}
                <input
                  type="text"
                  className={`${styles['info-card-bo']} ${styles['input-card-date-bo']} p text-center`}
                  maxLength="5"
                  value={newCard.exp_date}
                  onChange={expDateChange}
                  name="exp_date"
                  placeholder="M/Y"
                />
              </div>

              <div className={styles['trash-can-box-bo']}>
                <FaTrashCan
                  className={styles['icon-trashcan-bo']}
                  onClick={() => {
                    setShowNewCardForm(false) // 隱藏輸入框
                    setNewCard({
                      card_name: '',
                      card_number: '',
                      card_type: '',
                      exp_date: '',
                    }) // 重置輸入框內容
                    setCardNumberParts({
                      part1: '',
                      part2: '',
                      part3: '',
                      part4: '',
                    }) // 重置卡號部分
                    setErrorMessage('') // 清空錯誤訊息
                  }}
                />
              </div>
            </div>
            {errorMessage && (
              <div className={`${styles['text-error-bo']} p w-100 `}>
                {errorMessage}
              </div>
            )}
          </div>
        )}
        {/* 錯誤訊息顯示區域 */}
      </div>
      <button
        className={`${styles['btn-edit-info-bo']} btn p d-flex justify-content-center align-items-center gap-2 gap-sm-3`}
        onClick={addCardClick}
      >
        {showNewCardForm ? (
          <>
            <FaCheck />
            確認新增
          </>
        ) : (
          <>
            <FaPlus />
            新增信用卡
          </>
        )}
      </button>
    </div>
  )
}
