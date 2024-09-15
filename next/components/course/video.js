import React, { useRef, useState } from 'react'
import styles from '@/styles/aa/classDetail.module.scss'

const VideoPlayer = ({ videoUrl, thumbnailUrl }) => {
  const videoRef = useRef(null)
  const [isPaused, setIsPaused] = useState(true)

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPaused) {
        videoRef.current.play()
      } else {
        videoRef.current.pause()
      }
      setIsPaused(!isPaused)
    }
  }

  return (
    <button className={styles['video-container']} onClick={handleVideoClick}>
      <video
        ref={videoRef}
        src={videoUrl}
        muted
        loop
        controls
        controlsList="nodownload nofullscreen"
        disablePictureInPicture
        width="100%"
        // poster={thumbnailUrl}
      />
      {isPaused && (
        <div className={styles['play-icon']}>
          ▶️
          {/* <i className={styles['fa-solid fa-circle-play']}></i> */}
        </div>
      )}
    </button>
  )
}

export default VideoPlayer
