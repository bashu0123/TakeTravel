"use client"

import React,{useEffect} from 'react'
import AOS from 'aos';
import 'aos/dist/aos.css';
import Image from 'next/image'
import {ASSETS } from '../../../../public/Assets'
import Link from 'next/link';
function AboutTravelTravel() {
  useEffect(() => {
    AOS.init({
         duration: 800,
         once: false,
       })
 }, [])
  return (
 
    <div className="w-full flex items-center justify-center mt-60 sm:mt-40 md:mt-28 relative">
    <div className="w-11/12 flex my-6 flex-col lg:flex-row flex-wrap justify-center">
        <div className="w-full flex items-center justify-center lg:w-6/12">
            <img id='homepageimg' src={ASSETS.logo} height={80} alt="TakeTravel Logo" />
        </div>
        <div className="w-full lg:w-6/12">
            <h1
                data-aos="fade-up"
                data-aos-anchor-placement="top-bottom"
                className='font-bold text-2xl my-3 md:text-5xl'>
                Discover Travel Travel
            </h1>
            <p className='my-3 mt-7 text-lg'>
                Welcome to Take Travel—your gateway to extraordinary journeys and unforgettable experiences. We believe travel is not just about reaching destinations; it's about embracing new cultures, creating lasting memories, and uncovering the beauty of the world. Whether you're an avid explorer or embarking on your first adventure, we're here to make every trip extraordinary.
            </p>
            <h1 className='font-bold text-xl my-2 md:text-3xl'>
                Our Purpose
            </h1>
            <p className='my-3 mt-7 text-lg'>
                Our goal is simple: to inspire and empower travelers by providing reliable, insightful, and seamless travel solutions. From hidden gems to iconic landmarks, we curate experiences that turn your travel dreams into reality. With expert recommendations and easy planning tools, we help you navigate the world effortlessly.
            </p>
            <p className='my-3 mt-7 text-lg'>
                Thank you for choosing Take Travel—where every journey begins with excitement and ends with incredible memories.
            </p>

            <Link href="/book-now">
                <button className='bg-orange-600 py-3 border-2 px-9 font-semibold text-white mt-5 rounded-3xl hover:ring-4 hover:ring-[#43B97F] transition-all text-lg'>
                    Start 
                    booking
                </button>
            </Link>
        </div>
    </div>
</div>

    
  )
}

export default AboutTravelTravel
