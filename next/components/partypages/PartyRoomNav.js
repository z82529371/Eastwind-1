import React, { useState, useEffect, useCallback } from 'react'
import styles from '@/styles/gw/_PartyRoomNav.module.scss'
import { debounce } from 'lodash'

const allNavItems = [
  { href: '#party', label: '揪團' },
  { href: '#roomInfo', label: '店家資訊' },
  { href: '#photo', label: '相片' },
  // { href: '#toKnow', label: '注意事項' },
]

export default function PartyRoomNav({ partyData, companyData }) {
  const [activeSection, setActiveSection] = useState('')

  const showPartyOption = !!partyData

  const navItems = showPartyOption 
    ? allNavItems 
    : allNavItems.filter(item => item.href !== '#party')

  const debouncedSetActiveSection = useCallback(
    debounce((id) => setActiveSection(id), 100),
    []
  )

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            debouncedSetActiveSection(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-70px 0px -70% 0px',
        threshold: 0.3,
      }
    )

    navItems.forEach(({ href }) => {
      const element = document.querySelector(href)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [debouncedSetActiveSection, navItems])

  const handleClick = useCallback((e, href) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      const navHeight =
        document.querySelector(`.${styles.roomNav}`)?.offsetHeight || 0
      const containerPadding = 60
      const scrollPosition = element.offsetTop - navHeight - containerPadding

      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth',
      })
    }
  }, [])

  const handleKeyDown = useCallback((e, href) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick(e, href)
    }
  }, [handleClick])

  return (
    <nav className={styles.roomNav} aria-label="頁面導航">
      <ul>
        {navItems.map(({ href, label }) => (
          <li key={href} className={styles.navItem}>
            <a
              href={href}
              className={`${
                activeSection === href.slice(1) ? styles.navActive : ''
              } h6`}
              onClick={(e) => handleClick(e, href)}
              onKeyDown={(e) => handleKeyDown(e, href)}
              tabIndex={0}
              aria-current={activeSection === href.slice(1) ? 'true' : 'false'}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}