import React from 'react'
import {ASSETS } from '../../../../public/Assets'
import Image from 'next/image'
function WhyUs() {

    const whyUs = [
        {
            image: ASSETS.customerservice,
            heading: "Round-the-Clock Assistance",
            description: "Our expert support team is available 24/7 to help with any inquiries or concerns, ensuring a smooth and worry-free journey."
        },
        {
            image: ASSETS.booking,
            heading: "Seamless Booking Experience",
            description: "Effortlessly plan your trip with our user-friendly booking system, designed for quick and hassle-free reservations."
        },
        {
            image: ASSETS.gaurantee,
            heading: "Guaranteed Best Rates",
            description: "We ensure you get the most competitive prices available, so you can book your dream trip with confidence and savings."
        },
    ];
    

  return (
    <div className="w-full flex items-center justify-center mt-13 pt-7 mb-14">
    <div className="w-11/12">
    <h1 className='text-2xl md:text-5xl font-extrabold  w-full text-center '>What Sets Us Apart?</h1>

        <div className='w-full flex flex-col gap-y-5 sm:flex-row flex-wrap mt-20 mb-3 items-center justify-around'>

        {
            whyUs.map((item:any,index:any)=>(
                <div key={index} className='flex flex-col justify-center items-center w-full  sm:w-72'>
                    <Image 
                    src={item.image}
                    alt={item.heading}
                    height={150}
                    width={150}
                    ></Image>
                    <h3 className="font-semibold mt-3 text-xl ">
                        {item.heading}
                    </h3>
                    <p className='text-center my-2'>
                        {
                            item.description
                        }
                    </p>
                    </div>

            ))
        }

        </div>

    </div>
    </div>
  )
}

export default WhyUs
