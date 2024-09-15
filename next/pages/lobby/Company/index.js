import BookingLeftArea from '@/components/BookingPage/BookingLeftArea'
import BookingRightArea from '@/components/BookingPage/BookingRightArea'
import styles from '@/styles/gw/_partypage.module.scss'


import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';


export default function Company() {
  const router = useRouter();
  const { id } = router.query;
  console.log(id);
  const [companyData, setCompanyData] = useState(null);

  useEffect(() => {
    if (id) {
      // 使用傳遞過來的 ID 去請求完整的公司數據
      fetch(`http://localhost:3005/api/company/${id}`)
        .then(response => response.json())
        .then(data => setCompanyData(data))
        .catch(error => console.error('Error:', error));
    }
  }, [id]);
  console.log(id);

  return (
    <>
      <div className={styles.main}>
      <BookingLeftArea companyData={companyData} />
      <BookingRightArea companyData={companyData} />
      </div>
    </>
  )
}


