"use client"

import { useEffect, useRef, useState } from 'react';
import Swiper from 'swiper/bundle';
import 'swiper/swiper-bundle.css';
import { ASSETS } from '../../../../public/Assets';
import Image from 'next/image';
import logo from '../../../../public/icon/days.svg';
import Link from 'next/link';

const destinations = [
  {
    src: ASSETS.mteverest,
    title: "Mount Everest",
    cost: "$5k",
    trip: "15 days",
    description: "The highest mountain in the world, offering trekking and climbing experiences."
  },
  {
    src: ASSETS.pokhara,
    title: "Pokhara",
    cost: "$2k",
    trip: "7 days",
    description: "A beautiful city known for lakes, caves, and stunning views of the Annapurna range."
  },
  {
    src: ASSETS.lumbini,
    title: "Lumbini",
    cost: "$1.5k",
    trip: "5 days",
    description: "The birthplace of Lord Buddha, a UNESCO World Heritage site."
  },
  {
    src: ASSETS.bhaktapur,
    title: "Bhaktapur",
    cost: "$1k",
    trip: "3 days",
    description: "A historic city with ancient temples and rich Newari culture."
  },
  {
    src: ASSETS.chitwan,
    title: "Chitwan National Park",
    cost: "$3k",
    trip: "4 days",
    description: "A wildlife reserve home to rhinos, tigers, and elephant safaris."
  },
  {
    src: ASSETS.uppermustang,
    title: "Upper Mustang",
    cost: "$4k",
    trip: "10 days",
    description: "A remote desert-like region known for Tibetan culture and ancient caves."
  },
  {
    src: ASSETS.annapurna,
    title: "Annapurna Circuit",
    cost: "$3.5k",
    trip: "18 days",
    description: "A famous trekking route offering stunning views of the Himalayas."
  },
  {
    src: ASSETS.rara,
    title: "Rara Lake",
    cost: "$2.5k",
    trip: "6 days",
    description: "Nepal’s largest lake, surrounded by pristine wilderness and breathtaking scenery."
  },
  {
    src: ASSETS.gosaikunda,
    title: "Gosaikunda",
    cost: "$2k",
    trip: "5 days",
    description: "A sacred alpine lake with religious significance for Hindus and Buddhists."
  },
  {
    src: ASSETS.patan,
    title: "Patan",
    cost: "$1k",
    trip: "2 days",
    description: "A historic city known for ancient temples, arts, and metal craftsmanship."
  },
  {
    src: ASSETS.illam,
    title: "Ilam",
    cost: "$1.5k",
    trip: "3 days",
    description: "A scenic town famous for tea gardens and rolling green hills."
  },
  {
    src: ASSETS.kathmandu,
    title: "Kathmandu",
    cost: "$1.5k",
    trip: "3 days",
    description: "The capital city of Nepal, rich in cultural heritage, temples, and vibrant markets."
  }
];

const SwiperComponent = () => {
  const swiperRef = useRef(null);
  const [selectedDestination, setSelectedDestination] = useState(null);

  useEffect(() => {
    const swiper = new Swiper(swiperRef.current, {
      slidesPerView: 1,
      spaceBetween: 0,
      loop: true,
      autoplay: {
        delay: 2000,
        disableOnInteraction: false,
      },
      breakpoints: {
        400: { slidesPerView: 1 },
        560: { slidesPerView: 2 },
        800: { slidesPerView: 2 },
        1060: { slidesPerView: 3 },
        1400: { slidesPerView: 4 },
      },
    });

    return () => {
      swiper.destroy();
    };
  }, []);

  return (
    <section className="overflow-x-hidden">
      <div className="swiper-container" ref={swiperRef}>
        <ul className="swiper-wrapper">
          {destinations.map((destination, index) => (
            <li className="swiper-slide" key={index}>
              <div className="flex flex-col">
                <img
                  src={destination.src}
                  alt={destination.title}
                  height={220}
                  style={{ margin: "0 34px", borderRadius: "19px", height: "220px" }}
                  className="object-cover"
                />
                <div style={{ margin: "0 34px", padding: "10px", height: "180px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "0 7px" }}>
                    <h6 className="font-semibold capitalize text-lg">{destination.title}</h6>
                    <h6 className="text-lg font-semibold text-green-600">{destination.cost}</h6>
                  </div>
                  <div style={{ margin: "20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Image src={logo} alt="day trip" height={15} width={15} />
                      <h6 className="text-lg font-semibold ml-1">{destination.trip}</h6>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {selectedDestination && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg max-w-md">
            <h2 className="text-2xl font-bold">{selectedDestination.title}</h2>
            <p className="mt-2">{selectedDestination.description}</p>
            <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded" onClick={() => setSelectedDestination(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default SwiperComponent;