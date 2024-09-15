import Head from 'next/head'
import ToTheTop from '@/components/icons/to-the-top'
import HeaderAdmin from './headerAdmin.jsx'
import Footer from '../default-layout/footer.jsx'
import AdminSidebar from './admin-sidebar.js'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function AdminCenterLayout({ title = '只欠東風', children }) {
  return (
    <>
      <HeaderAdmin>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width" />
      </HeaderAdmin>
      <main className="flex-shrink-0">
        <section className="d-flex flex-column flex-md-row">
          <AdminSidebar />
          <ToTheTop />
          {children}
        </section>
      </main>
      <Footer />
    </>
  )
}
