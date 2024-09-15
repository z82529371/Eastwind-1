import { useRouter } from 'next/router'
import Swal from 'sweetalert2'

export default function JoinPartyBTN({ partyData, user }) {
  const isCompleted = partyData.status === 'completed'
  const router = useRouter()
  const isHost = user && user.id === partyData.userID_main
  const isJoined =
    user &&
    (partyData.userID_join1 === user.id ||
      partyData.userID_join2 === user.id ||
      partyData.userID_join3 === user.id)

  const handleJoinLeave = async () => {
    try {
      if (!user) {
        Swal.fire({
          title: '請先登入',
          text: '您需要先登入才能加入或離開隊伍。',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: '前往登入',
          cancelButtonText: '取消',
        }).then((result) => {
          if (result.isConfirmed) {
            router.push('/login')
          }
        })
        return
      }

      const action = isJoined ? 'leave' : 'join'
      const response = await fetch(
        `http://localhost:3005/api/parties/${partyData.id}/${action}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id }),
        }
      )

      if (!response.ok) throw new Error(`${isJoined ? '離開' : '加入'}隊伍失敗`)

      Swal.fire({
        title: '成功',
        text: `您已成功${isJoined ? '離開' : '加入'}隊伍`,
        icon: 'success',
        confirmButtonText: '確定',
      }).then((result) => {
        if (result.isConfirmed) {
          router.reload() // 在用戶確認後才重新加載頁面
        }
      })
    } catch (error) {
      console.error('操作失敗:', error)
      Swal.fire('錯誤', error.message, 'error')
    }
  }
  const handleDisband = () => {
    Swal.fire({
      title: '確定要解散隊伍嗎？',
      text: '此操作無法撤銷！',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: '是的，解散隊伍',
      cancelButtonText: '取消',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `http://localhost:3005/api/parties/${partyData.id}/cancel`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ userId: user.id }),
            }
          )

          if (!response.ok) throw new Error('解散隊伍失敗')

          Swal.fire('成功', '隊伍已解散', 'success')
          router.push('/lobby/Entrance') // 假設解散後導向派對列表頁
        } catch (error) {
          console.error('解散隊伍失敗:', error)
          Swal.fire('錯誤', error.message, 'error')
        }
      }
    })
  }
  console.log(partyData)

  if (isCompleted && !isHost) {
    return null
  }
  return (
    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
      {!isHost && (
        <button
          className={`btn ${isJoined ? 'btn-warning' : 'btn-primary'} btn-lg p`}
          type="button"
          onClick={handleJoinLeave}
        >
          {isJoined ? '離開隊伍' : '加入隊伍'}
        </button>
      )}
      {isHost && (
        <button
          className="btn btn-danger btn-lg p"
          type="button"
          onClick={handleDisband}
        >
          解散隊伍
        </button>
      )}
    </div>
  )
}
