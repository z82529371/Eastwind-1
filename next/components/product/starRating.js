import React, { useState, useEffect } from 'react'
import { FaStar, FaRegStar } from 'react-icons/fa6'
export default function StarRating({ initRating = 0 }) {
  const max = 5
  const [rating, setRating] = useState(0)
  useEffect(() => {
    setRating(initRating)
  }, [initRating])
  return (
    <>
      {Array(max)
        .fill()
        .map((v, i) => {
          return rating > i ? <FaStar key={i} /> : <FaRegStar key={i} />
        })}
    </>
  )
}
