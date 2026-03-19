'use client'

import Image from "next/image"
import posthog from "posthog-js"

function ExploreBtn() {
  return (
    <button
    type="button"
    id="explore-btn"
    className="mt-7 mx-auto space-x-1" 
    onClick={() => {
      posthog.capture('test_click')
      }} >
        <a href="#event">Explore Events</a>
        <Image src='/icons/arrow-down.svg' alt="arrow down" width={24} height={24} />
    </button>
  )
}

export default ExploreBtn
