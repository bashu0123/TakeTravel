import React from 'react'
import {ASSETS} from '../../../public/Assets'
import WhyUs from '@/components/template/about/WhyUs'
import HeroSection from '@/components/template/heroSection/HeroSection'
import AboutTakeTravel from '@/components/template/about/AboutTakeTravel'
function page() {
  return (
    <div className=' pb-11'>
      <HeroSection image={ASSETS.blog_banner} title="About Us"  />
<AboutTakeTravel/>
<WhyUs/>

    </div>
  )
}

export default page
