import { useContext, useState, useEffect, useRef } from 'react'
import UserCenterLayout from '@/components/layout/user-center-layout'
import styles from '@/styles/boyu/user-info-edit.module.scss'
import { FaEdit } from 'react-icons/fa'
import { FaXmark } from 'react-icons/fa6'
import { AuthContext } from '@/context/AuthContext'
import Swal from 'sweetalert2'
import CreditCardForm from '@/components/user-info-edit/credit-card-form'
import UserBasicInfoForm from '@/components/user-info-edit/user-basic-info-form'
import UserImageUpload from '@/components/user-info-edit/user-image-upload'
import UserDetailInfoForm from '@/components/user-info-edit/user-detail-info-form'
import { useRouter } from 'next/router'

export default function UserInfoEdit() {
  const router = useRouter()

  // 從 AuthContext 中取得當前登入用戶資訊
  const { user, updateUserImage, updateUserUsername, updateUserGender } =
    useContext(AuthContext)

  // 狀態管理
  const [cards, setCards] = useState([]) // 信用卡列表
  const [formValues, setFormValues] = useState({
    email: '',
    account: '',
    password: '',
    confirmPassword: '',
    username: '',
    gender: '',
    year: '', // 新增年份
    month: '', // 新增月份
    day: '', // 新增日期
    city: '',
    address: '',
    phone: '',
  })

  const [initialFormValues, setInitialFormValues] = useState({}) // 用於追蹤初始值
  const [isPasswordChanged, setIsPasswordChanged] = useState(false) // 用於追蹤密碼是否修改
  const [emailVerified, setEmailVerified] = useState(false) // 追蹤 email 是否驗證過
  const [needPwdValidation, setNeedPwdValidation] = useState(true) // 是否需要驗證原密碼
  const [isFormSubmitted, setIsFormSubmitted] = useState(false)

  const fileInputRef = useRef(null) // 用於參考文件輸入元素

  const [imageSrc, setImageSrc] = useState('') // 使用狀態來保存圖片 URL

  // 初始化用戶數據
  useEffect(() => {
    if (user && user.id) {
      fetchUserData() // user 初始化後立刻獲取資料
    }
  }, [user]) // user 狀態變化時重新執行

  useEffect(() => {
    if (user) {
      // 當 user 更新時，更新圖片 URL
      const imgSrc = user.user_img
        ? `/images/boyu/users/${user.user_img}.jpg?${new Date().getTime()}`
        : user.photo_url
        ? user.photo_url
        : user.gender === '男'
        ? '/images/boyu/users/user-male-default.svg'
        : '/images/boyu/users/user-female-default.svg'

      setImageSrc(imgSrc) // 設定圖片來源
    }
  }, [user])

  // 從伺服器獲取用戶資料
  const fetchUserData = async () => {
    if (!user || !user.id) {
      console.error('User ID is missing or user is not defined.')
      return
    }
    try {
      const response = await fetch(
        `http://localhost:3005/api/user/user/${user.id}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch user data')
      }

      const result = await response.json()
      console.log(result) // 確認 API 回應是否有 created_at

      const updatedUser = result.data

      // 將生日拆分為年、月、日
      const [year, month, day] = updatedUser.birth
        ? new Date(updatedUser.birth).toISOString().split('T')[0].split('-')
        : ['', '', '']

      // 初始化表單值
      const initialValues = {
        email: updatedUser.email || '',
        account: updatedUser.account || '',
        password: updatedUser.password || '',
        confirmPassword: '',
        username: updatedUser.username || '',
        gender: updatedUser.gender || '',
        year, // 年
        month, // 月
        day, // 日
        city: updatedUser.city || '',
        address: updatedUser.address || '',
        phone: updatedUser.phone || '',
      }

      setFormValues(initialValues)
      setInitialFormValues(initialValues)
    } catch (error) {
      console.error('Failed to fetch user data:', error)
    }
  }

  // 處理表單輸入變更
  const onInputChange = (event) => {
    const { name, value } = event.target

    // 如果用戶修改了 email，將驗證狀態設置為 false
    if (name === 'email') {
      setEmailVerified(false)
    }

    // 如果用戶修改了密碼框的內容，更新`isPasswordChanged`
    if (name === 'password') {
      setIsPasswordChanged(true)
      setNeedPwdValidation(false) // 當用戶修改密碼時，不再需要驗證原密碼
    }

    // 更新表單值
    setFormValues({
      ...formValues,
      [name]: value,
    })
  }

  // 控制是否顯示確認密碼欄位
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    // 當用戶實際修改了密碼時，才顯示確認密碼輸入框
    setShowConfirmPassword(formValues.password !== initialFormValues.password)
  }, [formValues.password, initialFormValues.password])

  // 表單驗證
  const [errors, setErrors] = useState({})

  const validateForm = async () => {
    const {
      email,
      account,
      password,
      confirmPassword,
      username,
      gender,
      year,
      month,
      day,
      city,
      address,
      phone,
    } = formValues

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const accountPasswordRegex = /^(?=.*[A-Za-z])[A-Za-z\d]{6,}$/
    const phoneRegex = /^09\d{8}$/

    const newErrors = {}

    // 檢查是否有任何值被修改
    const isFormChanged = Object.keys(formValues).some(
      (key) => formValues[key] !== initialFormValues[key]
    )

    if (!isFormChanged) {
      Swal.fire({
        title: '未進行任何修改',
        html: `<span class="p">您尚未對資料進行任何修改。</span>`,
        icon: 'warning',
        customClass: {
          popup: `${styles['swal-popup-bo']}`, // 自訂整個彈出視窗的 class
          title: 'h6',
          icon: `${styles['swal-icon-bo']}`, // 添加自定義 class
          confirmButton: `${styles['swal-btn-bo']}`, // 添加自定義按鈕 class
        },
        confirmButtonText: '確認', // 修改按鈕文字
      })
      return false // 返回 false，表示驗證未通過
    }

    // 檢查並驗證 email
    if (!email) {
      newErrors.email = '請輸入電子信箱'
    } else if (!emailRegex.test(email)) {
      newErrors.email = '請輸入有效的電子信箱'
    } else if (email !== initialFormValues.email) {
      const { emailExists } = await checkUniqueValues(email, account)
      if (emailExists) {
        newErrors.email = '電子信箱已被使用'
      }
    }
    toggleCorrectClass('email', !newErrors.email)

    // 檢查並驗證帳號
    if (!account || !accountPasswordRegex.test(account)) {
      newErrors.account = '帳號應至少6碼，且包含英文字'
    } else if (account !== initialFormValues.account) {
      const { accountExists } = await checkUniqueValues(email, account)
      if (accountExists) {
        newErrors.account = '帳號已存在'
      }
    }
    toggleCorrectClass('account', !newErrors.account)

    // 檢查並驗證密碼
    if (!password || !accountPasswordRegex.test(password)) {
      newErrors.password = '密碼應至少6碼，且包含英文字'
    } else if (isPasswordChanged) {
      if (password === initialFormValues.password) {
        newErrors.password = '原密碼不需修改'
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = '兩次密碼輸入不一致'
      }
    }
    toggleCorrectClass(
      'password',
      !newErrors.password && !newErrors.confirmPassword
    )

    // 檢查並驗證姓名
    if (username !== initialFormValues.username) {
      if (!username) {
        newErrors.username = '姓名不能為空'
      }
    }
    toggleCorrectClass('username', !newErrors.username)

    // 檢查並驗證性別
    if (!gender) {
      newErrors.gender = '請選擇性別'
    }
    toggleCorrectClass('gender', !newErrors.gender)

    // 檢查並驗證生日
    if (!year || !month || !day) {
      newErrors.birthDate = '請選擇完整的生日'
      toggleCorrectClass('year', false)
      toggleCorrectClass('month', false)
      toggleCorrectClass('day', false)
    } else {
      toggleCorrectClass('year', true)
      toggleCorrectClass('month', true)
      toggleCorrectClass('day', true)
    }
    toggleCorrectClass('birthDate', !newErrors.birthDate)

    // 檢查並驗證城市
    if (!city) {
      newErrors.city = '請選擇城市'
    }
    toggleCorrectClass('city', !newErrors.city)

    // 檢查並驗證地址
    if (!address) {
      newErrors.address = '地址不能為空'
    }
    toggleCorrectClass('address', !newErrors.address)

    // 檢查並驗證手機
    if (!phone) {
      newErrors.phone = '手機不能為空'
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = '請輸入有效的手機號碼（09XXXXXXXX）'
    }
    toggleCorrectClass('phone', !newErrors.phone)

    // 更新錯誤訊息狀態
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const toggleCorrectClass = (fieldName, isValid) => {
    const element = document.querySelector(`[name="${fieldName}"]`)

    if (element) {
      if (isValid) {
        element.classList.add(styles['info-correct-bo'])
      } else {
        element.classList.remove(styles['info-correct-bo'])
      }
    } else {
      console.log(`Element with name "${fieldName}" not found.`)
    }
  }

  // 發送驗證郵件
  const sendVerificationEmail = async () => {
    // 檢查 email 是否為空
    if (!formValues.email) {
      Swal.fire({
        title: '電子信箱為空',
        html: `<span class="p">尚未填入電子信箱，請先輸入您的電子信箱。</span>`,
        icon: 'error',
        customClass: {
          popup: `${styles['swal-popup-bo']}`, // 自訂整個彈出視窗的 class
          title: 'h6',
          icon: `${styles['swal-icon-bo']}`, // 添加自定義 class
          confirmButton: `${styles['swal-btn-bo']}`, // 添加自定義按鈕 class
        },
        confirmButtonText: '確認', // 修改按鈕文字
      })
      return
    }

    // 如果 email 與初始 email 相同，則不需驗證
    if (formValues.email === initialFormValues.email) {
      Swal.fire({
        title: '原電子信箱',
        html: `<span class="p">這是您的原電子信箱，不需重新驗證。</span>`,
        icon: 'error',
        customClass: {
          popup: `${styles['swal-popup-bo']}`, // 自訂整個彈出視窗的 class
          title: 'h6',
          icon: `${styles['swal-icon-bo']}`, // 添加自定義 class
          confirmButton: `${styles['swal-btn-bo']}`, // 添加自定義按鈕 class
        },
        confirmButtonText: '確認', // 修改按鈕文字
      })
      return
    }

    // 檢查 email 是否已被使用
    const { emailExists } = await checkUniqueValues(
      formValues.email,
      formValues.account
    )

    // 如果 email 已經存在，禁用驗證按鈕
    if (emailExists) {
      Swal.fire({
        title: '電子信箱已被使用',
        html: `<span class="p">此電子信箱已被使用，請選擇其他電子信箱。</span>`,
        icon: 'error',
        customClass: {
          popup: `${styles['swal-popup-bo']}`, // 自訂整個彈出視窗的 class
          title: 'h6',
          icon: `${styles['swal-icon-bo']}`, // 添加自定義 class
          confirmButton: `${styles['swal-btn-bo']}`, // 添加自定義按鈕 class
        },
        confirmButtonText: '確認', // 修改按鈕文字
      })
      return
    }

    // 儲存 email 到 localStorage
    localStorage.setItem('emailToVerify', formValues.email)

    // 發送驗證郵件的 API 請求
    fetch('http://localhost:3005/api/user-edit/send-verification-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: formValues.email }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          Swal.fire({
            title: '驗證郵件已發送',
            html: `<span class="p">請檢查您的郵箱並點擊驗證連結。</span>`,
            icon: 'success',
            customClass: {
              popup: `${styles['swal-popup-bo']}`, // 自訂整個彈出視窗的 class
              title: 'h6',
              icon: `${styles['swal-icon-bo']}`, // 添加自定義 class
              confirmButton: `${styles['swal-btn-bo']}`, // 添加自定義按鈕 class
            },
            confirmButtonText: '確認', // 修改按鈕文字
          }).then(() => {
            router.push('/user/user-center/info') // 驗證成功後跳回到 user-info 頁面
          })
        } else {
          Swal.fire({
            title: '發送失敗',
            html: `<span class="p">無法發送驗證郵件，請稍後再試。</span>`,
            icon: 'error',
            customClass: {
              popup: `${styles['swal-popup-bo']}`, // 自訂整個彈出視窗的 class
              title: 'h6',
              icon: `${styles['swal-icon-bo']}`, // 添加自定義 class
              confirmButton: `${styles['swal-btn-bo']}`, // 添加自定義按鈕 class
            },
            confirmButtonText: '確認', // 修改按鈕文字
          })
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  // 監聽驗證結果並處理
  useEffect(() => {
    const { success } = router.query

    if (success === 'true') {
      const verifiedEmail = localStorage.getItem('emailToVerify')

      Swal.fire({
        title: '驗證成功',
        html: `<span class="p">您的電子信箱已成功驗證。</span>`,
        icon: 'success',
        customClass: {
          popup: `${styles['swal-popup-bo']}`, // 自訂整個彈出視窗的 class
          title: 'h6',
          icon: `${styles['swal-icon-bo']}`, // 添加自定義 class
          confirmButton: `${styles['swal-btn-bo']}`, // 添加自定義按鈕 class
        },
        confirmButtonText: '確認', // 修改按鈕文字
      }).then(() => {
        setFormValues((prevValues) => ({
          ...prevValues,
          email: verifiedEmail,
        }))
        setEmailVerified(true)

        // 清除 localStorage 中的 emailToVerify
        localStorage.removeItem('emailToVerify')
      })

      // 替換 URL 中的 query 參數
      router.replace('/user/user-center/info-edit', undefined, {
        shallow: true,
      })
    }
  }, [router.query])

  // 檢查 email 和 account 是否唯一
  const checkUniqueValues = async (email, account) => {
    try {
      const response = await fetch(
        'http://localhost:3005/api/user-edit/check-unique',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, account, userId: user.id }), // 傳送 userId
        }
      )

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error checking uniqueness:', error)
      return { emailExists: false, accountExists: false }
    }
  }

  // 處理圖片文件選擇
  const onFileChange = async (event) => {
    const file = event.target.files[0]

    if (file) {
      // 檢查文件大小是否超過 5MB
      const maxFileSize = 5 * 1024 * 1024 // 2MB
      if (file.size > maxFileSize) {
        Swal.fire({
          title: '檔案過大',
          html: `<span class="p">請選擇小於 5MB 的圖片檔案。</span>`,
          icon: 'error',
          customClass: {
            popup: `${styles['swal-popup-bo']}`, // 自訂整個彈出視窗的 class
            title: 'h6',
            icon: `${styles['swal-icon-bo']}`, // 添加自定義 class
            confirmButton: `${styles['swal-btn-bo']}`, // 添加自定義按鈕 class
          },
          confirmButtonText: '確認', // 修改按鈕文字
        })
        return
      }

      // 檢查文件類型是否為圖片格式
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          title: '無效的圖片格式',
          html: `<span class="p">請上傳 JPEG、PNG 或 GIF 格式的圖片。</span>`,
          icon: 'error',
          customClass: {
            popup: `${styles['swal-popup-bo']}`, // 自訂整個彈出視窗的 class
            title: 'h6',
            icon: `${styles['swal-icon-bo']}`, // 添加自定義 class
            confirmButton: `${styles['swal-btn-bo']}`, // 添加自定義按鈕 class
          },
          confirmButtonText: '確認', // 修改按鈕文字
        })
        return
      }

      const formData = new FormData()
      formData.append('avatar', file)

      try {
        const response = await fetch(
          `http://localhost:3005/api/user-edit/update-avatar/${user.id}`,
          {
            method: 'POST',
            body: formData,
          }
        )

        if (!response.ok) {
          throw new Error('Failed to upload avatar')
        }

        const data = await response.json()
        if (data.status === 'success') {
          updateUserImage(data.filename) // 更新 AuthContext 中的 user_img
          updateUserUsername(formValues.username) // 更新 AuthContext 中的用戶名

          Swal.fire({
            title: '圖片上傳成功',
            html: `<span class="p">您的大頭照已成功更換。</span>`,
            icon: 'success',
            customClass: {
              popup: `${styles['swal-popup-bo']}`, // 自訂整個彈出視窗的 class
              title: 'h6',
              icon: `${styles['swal-icon-bo']}`, // 添加自定義 class
              confirmButton: `${styles['swal-btn-bo']}`, // 添加自定義按鈕 class
            },
            confirmButtonText: '確認', // 修改按鈕文字
          })
        } else {
          Swal.fire({
            title: '圖片上傳失敗',
            html: `<span class="p">無法上傳圖片，請稍後再試。</span>`,
            icon: 'error',
            customClass: {
              popup: `${styles['swal-popup-bo']}`, // 自訂整個彈出視窗的 class
              title: 'h6',
              icon: `${styles['swal-icon-bo']}`, // 添加自定義 class
              confirmButton: `${styles['swal-btn-bo']}`, // 添加自定義按鈕 class
            },
            confirmButtonText: '確認', // 修改按鈕文字
          })
        }
      } catch (error) {
        console.error('Error uploading avatar:', error)
      }
    }
  }

  // 取消編輯
  const cancelEdit = () => {
    const isFormChanged = Object.keys(formValues).some(
      (key) => formValues[key] !== initialFormValues[key]
    )

    // 檢查用戶是否為新會員
    const isNewMember =
      !initialFormValues.gender &&
      !initialFormValues.year &&
      !initialFormValues.month &&
      !initialFormValues.day &&
      !initialFormValues.city &&
      !initialFormValues.address &&
      !initialFormValues.phone

    if (isNewMember) {
      Swal.fire({
        title: '無法取消修改',
        html: `<span class="p">新會員在填寫資料時無法取消修改，請完成填寫。</span>`,
        icon: 'warning',
        confirmButtonText: '確定',
        customClass: {
          popup: `${styles['swal-popup-bo']}`,
          title: 'h6',
          icon: `${styles['swal-icon-bo']}`,
          confirmButton: `${styles['swal-btn-bo']}`,
        },
      })
      return // 直接返回，不執行後續代碼
    }

    // 檢查所有輸入框是否都填寫
    const isAllFieldsFilled = Object.values(formValues).every(
      (value) => value !== ''
    )

    if (isFormChanged) {
      if (!isAllFieldsFilled) {
        Swal.fire({
          title: '未填寫所有資料',
          html: `<span class="p">有些資料未填寫，您確定要取消修改嗎？</span>`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: '保持原資料',
          cancelButtonText: '繼續修改',
          customClass: {
            popup: `${styles['swal-popup-bo']}`,
            title: 'h6',
            icon: `${styles['swal-icon-bo']}`,
            confirmButton: `${styles['swal-btn-bo']}`,
            cancelButton: `${styles['swal-btn-cancel-bo']}`,
          },
        }).then((result) => {
          if (result.isConfirmed) {
            // 清理 localStorage，保持原資料
            localStorage.removeItem('emailToVerify')
            localStorage.removeItem('emailVerificationStatus')
            router.push('/user/user-center/info')
          }
        })
      } else {
        Swal.fire({
          title: '確定取消修改嗎？',
          html: `<span class="p">您的變更尚未保存，確定要取消嗎？</span>`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: '取消修改',
          cancelButtonText: '繼續修改',
          customClass: {
            popup: `${styles['swal-popup-bo']}`,
            title: 'h6',
            icon: `${styles['swal-icon-bo']}`,
            confirmButton: `${styles['swal-btn-bo']}`,
            cancelButton: `${styles['swal-btn-cancel-bo']}`,
          },
        }).then((result) => {
          if (result.isConfirmed) {
            // 清理 localStorage
            localStorage.removeItem('emailToVerify')
            localStorage.removeItem('emailVerificationStatus')
            router.push('/user/user-center/info')
          }
        })
      }
    } else {
      // 清理 localStorage
      localStorage.removeItem('emailToVerify')
      localStorage.removeItem('emailVerificationStatus')
      router.push('/user/user-center/info')
    }
  }

  // 更新用戶信息
  const updateUserInfo = async () => {
    if (!emailVerified && formValues.email !== initialFormValues.email) {
      Swal.fire({
        title: '電子信箱未驗證',
        html: `<span class="p">請先驗證您的新電子信箱後再進行修改。</span>`,
        icon: 'warning',
        customClass: {
          popup: `${styles['swal-popup-bo']}`,
          title: 'h6',
          icon: `${styles['swal-icon-bo']}`,
          confirmButton: `${styles['swal-btn-bo']}`,
        },
        confirmButtonText: '確認',
      })
      return
    }

    Swal.fire({
      title: '確認修改？',
      html: `<span class="p">您確定要修改這些資料嗎？</span>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '確認修改',
      cancelButtonText: '取消',
      customClass: {
        popup: `${styles['swal-popup-bo']}`,
        title: 'h6',
        icon: `${styles['swal-icon-bo']}`,
        confirmButton: `${styles['swal-btn-bo']}`,
        cancelButton: `${styles['swal-btn-cancel-bo']}`,
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const formIsValid = await validateForm()

        if (formIsValid) {
          const birthDate = `${formValues.year}-${formValues.month}-${formValues.day}`
          updateUserGender(formValues.gender)

          const updatedFormValues = {
            ...formValues,
            birthDate,
          }

          setIsFormSubmitted(true)

          try {
            const response = await fetch(
              `http://localhost:3005/api/user-edit/update-user/${user.id}`,
              {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedFormValues),
              }
            )

            const data = await response.json()
            if (data.status === 'success') {
              // 如果後端返回的是第一次修改，設置 isFirstEdit 到 sessionStorage
              if (data.isFirstEdit) {
                sessionStorage.setItem('isFirstEdit', 'true')
              } else {
                sessionStorage.setItem('isFirstEdit', 'false')
              }

              sessionStorage.setItem('updateSuccess', 'true')
              updateUserUsername(formValues.username) // 在成功後更新名稱

              Swal.fire({
                title: data.message.includes('填寫') ? '填寫成功' : '修改成功',
                html: `<span class="p">${data.message}</span>`,
                icon: 'success',
                customClass: {
                  popup: `${styles['swal-popup-bo']}`,
                  title: 'h6',
                  icon: `${styles['swal-icon-bo']}`,
                  confirmButton: `${styles['swal-btn-bo']}`,
                },
                confirmButtonText: '確認',
              }).then(() => {
                router.push('/user/user-center/info')
              })
            } else {
              Swal.fire({
                title: '修改失敗',
                html: `<span class="p">請稍後再試。</span>`,
                icon: 'error',
                customClass: {
                  popup: `${styles['swal-popup-bo']}`,
                  title: 'h6',
                  icon: `${styles['swal-icon-bo']}`,
                  confirmButton: `${styles['swal-btn-bo']}`,
                },
                confirmButtonText: '確認',
              })
            }
          } catch (error) {
            console.error('Error updating user info:', error)
          }
        }
      }
    })
  }

  // 如果沒有用戶登入則不顯示
  if (!user) {
    return null
  }

  // 格式化日期
  const createdAt =
    user && user.created_at
      ? user.created_at.split(' ')[0].replace(/-/g, ' / ')
      : '日期未定義' // 現在年份
  const currentYear = new Date().getFullYear()
  // 最早可選年份（年滿18歲的年份）
  const earliestYear = currentYear - 18

  return (
    <>
      <div className={`${styles['user-info-box-bo']}  w-100`}>
        <div className={`${styles['info-form-box-bo']} flex-column d-flex`}>
          {/* 基本資訊區塊 */}
          <div
            className={`${styles['info-default-box-bo']} row justify-content-center align-items-center gap-5 gap-lg-0`}
          >
            <UserBasicInfoForm
              formValues={formValues}
              errors={errors}
              onInputChange={onInputChange}
              sendVerificationEmail={sendVerificationEmail}
              showConfirmPassword={
                formValues.password !== initialFormValues.password
              }
            />

            {/* 使用者圖片區塊 */}
            <UserImageUpload
              imageSrc={imageSrc}
              user={user}
              createdAt={createdAt}
              fileInputRef={fileInputRef}
              onFileChange={onFileChange}
            />
          </div>

          {/* 詳細資訊區塊 */}
          <div
            className={`${styles['info-detail-box-bo']} row justify-content-center align-items-start gap-5 gap-xl-0`}
          >
            <UserDetailInfoForm
              formValues={formValues}
              errors={errors}
              onInputChange={onInputChange}
              currentYear={currentYear}
              earliestYear={earliestYear}
            />
            {/* 信用卡表單區塊 */}
            <CreditCardForm cards={cards} setCards={setCards} user={user} />
          </div>

          {/* 操作按鈕區塊 */}
          <div
            className={`${styles['info-btn-box-bo']} d-flex justify-content-center align-items-center gap-5`}
          >
            <button
              onClick={cancelEdit}
              className={`${styles['btn-edit-info-bo']} btn h6 d-flex justify-content-center align-items-center gap-2 gap-sm-3`}
            >
              取消修改
              <FaXmark />
            </button>
            <button
              className={`${styles['btn-edit-info-bo']} btn h6 d-flex justify-content-center align-items-center gap-2 gap-sm-3`}
              onClick={updateUserInfo}
            >
              修改資訊
              <FaEdit />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

// 指定佈局
UserInfoEdit.getLayout = function (page) {
  return <UserCenterLayout>{page}</UserCenterLayout>
}
