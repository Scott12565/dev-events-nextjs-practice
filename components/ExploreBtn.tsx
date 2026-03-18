'use client'

import Image from "next/image"

function ExploreBtn() {
  return (
    <button
    type="button"
    id="explore-btn"
    className="mt-7 mx-auto space-x-1" 
    onClick={() => console.log('Click')}>
        <a href="#event">Explore Events</a>
        <Image src='/icons/arrow-down.svg' alt="arrow down" width={24} height={24} />
    </button>
  )
}

export default ExploreBtn
