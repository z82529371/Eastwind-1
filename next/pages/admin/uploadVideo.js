import React from 'react'
import AdminCenterLayout from '@/components/layout/admin-layout'

export default function Chart() {
  return (
    <>
      <div className="App">
        <h1>My Sales Data</h1>
      </div>
    </>
  )
}

Chart.getLayout = function (page) {
  return <AdminCenterLayout>{page}</AdminCenterLayout>
}
