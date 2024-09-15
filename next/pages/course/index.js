import { useRouter } from 'next/router'

// 只作導向到 product/list
export default function CourseIndex() {
  const router = useRouter()

  // 確認window(瀏覽器)開始運作
  if (typeof window !== 'undefined') {
    router.push('/course/classList')
  }

  return <></>
}
