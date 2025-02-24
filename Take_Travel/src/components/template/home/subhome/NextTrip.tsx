import React from 'react'
import Image from 'next/image'
import {ASSETS} from '../../../../../public/Assets' 
function NextTrip() {
    const bookingSteps = [
        {
            image: ASSETS.booking1,
            title: "Pick Your Nepal Adventure",
            content: "From the snow-capped Himalayas to lush jungles and ancient heritage sites, Nepal has it all. Choose a trekking route, cultural tour, or an off-the-beaten-path experience."
        },
        {
            image: ASSETS.booking2,
            title: "Book & Secure Your Trip",
            content: "Easily confirm your adventure with flexible payment options, including digital wallets, bank transfers, or cash payments at partner locations."
        },
        {
            image: ASSETS.booking3,
            title: "Get Ready for the Experience",
            content: "Prepare for your trip—pack essentials, check the weather, and meet your guide at the designated spot. Whether you're heading to Everest Base Camp or Pokhara’s lakeside, your journey begins now!"
        },
    ];
    
  return (
    <div className="w-auto flex justify-center items-center">
      <div className='w-5/6 flex flex-col lg:flex-row flex-wrap'>
    <div className='w-full lg:w-6/12 flex flex-col my-4'>

    <h1
     data-aos="fade-up"
     data-aos-anchor-placement="top-bottom"
    className='text-2xl md:text-4xl font-bold my-4 md:mt-20'>
     Plan Your Nepal Adventure in <br /> 3 Simple Steps
    </h1>
    {
        bookingSteps.map((item,index)=>(
            <div key={index} className='flex flex-col sm:flex-row   gap-x-6 mt-6'>
                <Image
                src={item.image}
                alt={item.title}
                className='h-14 w-14 object-cover mb-5 sm:mb-0'
                height={40}
                width={50}
                ></Image>
                <div className="flex flex-col gap-y-2">
                    <h3 className='text-lg font-semibold capitalize'>{item.title}</h3>
                    <p className='text-sm'>{item.content}</p>

                </div>
            </div>
        ))
    }
 

    </div>
    <div className='w-full lg:w-6/12 flex items-center justify-center mt-7 pl-9'>
    <Image
        src={ASSETS.trip}
        alt='Book your next trip'
        height={1200}
        className='object-cover'
        width={800}
    ></Image>
    </div>
      </div>
    </div>
  )
}

export default NextTrip
