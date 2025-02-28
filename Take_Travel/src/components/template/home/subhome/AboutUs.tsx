import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {ASSETS } from '../../../../../public/Assets'
function AboutUs() {
  return (
    <div className="w-full flex items-center justify-center mt-60 sm:mt-40 md:mt-28 relative">
    <div className="w-11/12 flex my-6 flex-col lg:flex-row flex-wrap justify-center">
    <div className="w-full flex itmes-center justify-center lg:w-6/12 ">
        
        <Image
        src={ASSETS.about_img}
    	 height={400}
         className="object-cover"
          width={1900}
        alt="About-Us"
        
        ></Image>
    </div>
    <div className="w-full lg:w-6/12">
    <h1
    data-aos="fade-up"
    data-aos-anchor-placement="top-bottom"
    className='font-bold text-2xl my-3 md:text-5xl'>
Explore Nepal’s Wonders with TakeTravel
    </h1>
    <p className='my-3 mt-7 text-lg'>
    At TakeTravel, we bring your Nepal adventure to life! Whether you're trekking the Himalayas or exploring hidden gems, we’ve got the perfect journey for you. With expert guides and insider tips, every trip is full of unforgettable experiences. Pack your bags, grab your camera, and let’s explore the wonders of Nepal together!
    </p>
           
           {/* className="   bg-[#43B97F]  text-white font-medium rounded-3xl text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 focus:outline-none" */}
           
          
    <Link  href="/book-now">
    <button
        className='bg-orange-600 py-3 border-2 px-9 font-semibold text-white mt-5 rounded-3xl  hover:ring-4 hover:ring-orange-400  transition-all text-lg'
        >
        Book Now
    </button>
      </Link>

    </div>
    </div>
    </div>
  )
}

export default AboutUs
