import React from 'react';
import styles from '@/styles/gw/_joinBtn.module.scss'

export default function JoinBTN({ activeView, onViewChange }) {
  return (
    <div className={styles.joinGw}>
      <div 
        className={`${styles.partyBtn} ${activeView === 'host' ? styles.activeGw : ''}`}
        onClick={() => onViewChange('host')}
        type="button"
      >
        訂桌/揪團
      </div>
      <div 
        className={`${styles.partyBtn} ${activeView === 'join' ? styles.activeGw : ''}`}
        onClick={() => onViewChange('join')}
        type="button"
      >
        參團
      </div>
    </div>
  )
}