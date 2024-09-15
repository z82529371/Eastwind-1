import Head from 'next/head'

import ToTheTop from '@/components/icons/to-the-top'
import Header from '../default-layout/header.jsx'
import Footer from '../default-layout/footer.jsx'
import UserSidebar from './user-sidebar.js'
import Chat from '@/components/customerService'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function UserCenterLayout({ title = '只欠東風', children }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width" />
      </Head>
      <Header />
      {/* <MyNavbarBS5 /> */}
      <main className="flex-shrink-0">
        <section className="d-flex flex-column flex-md-row">
          <UserSidebar />
          <ToTheTop />
          <Chat />
          {children}
        </section>
      </main>
      <Footer />
    </>
  )
}
