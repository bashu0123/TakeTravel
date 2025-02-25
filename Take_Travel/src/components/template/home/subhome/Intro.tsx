'use client'

import React, { useEffect, useState } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { ASSETS } from '../../../../../public/Assets'
import LandingPageForm from './landingPageForm'
import { usePathname } from 'next/navigation'

function Intro() {
  const [key, setKey] = useState(0); // To force the video to refresh
  const pathname = usePathname();

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
    })
  }, [])

  // Watch for path change and force video reload
  useEffect(() => {
    setKey(prevKey => prevKey + 1); // Increment the key to refresh the video on path change
  }, [pathname]);

  return (
    <div className='w-full'>
      <div className='flex relative flex-col'>
        <video 
          key={key}  // Changing the key forces the video to reload
          className='h-[75vh] w-screen object-cover' 
          src={ASSETS.video} 
          autoPlay 
          loop 
          muted 
        />
        <LandingPageForm position="absolute" />
      </div>
    </div>
  )
}

export default Intro
