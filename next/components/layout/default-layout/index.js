import { useRouter } from 'next/router'
import Head from 'next/head'
import ToTheTop from '@/components/icons/to-the-top'
import Header from './header.jsx'
import Footer from './footer.jsx'
import Chat from '@/components/customerService'
import { useState, useEffect } from 'react'

export default function DefaultLayout({ title = '只欠東風', children }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width" />
      </Head>
      <Header />
      <main className="flex-shrink-0">
        <ToTheTop />
        <Chat />

        {children}
      </main>
      <Footer />
    </>
  )
}
