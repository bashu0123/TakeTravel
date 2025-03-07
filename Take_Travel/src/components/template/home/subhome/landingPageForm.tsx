
"use client"

import React, { useState } from 'react'
import { IoSearch } from "react-icons/io5"
import { useRouter } from 'next/navigation'
import { DatePickerWithRange } from '../../shadcn/DatePicker'
import { Button } from '@/redux/feature/Api.Slice'
import { Selector } from '../../shadcn/Selector'
import { useSelector, useDispatch } from "react-redux"
import { usePathname } from 'next/navigation'
import { toast } from "sonner"

// Add an interface for the form data
interface FormData {
  destination: string
  dateTo: string
  dateFrom: string
  clicked: boolean
}

export default function LandingPageForm(props: any) {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const router = useRouter()
  const currentPath = usePathname()
  
  // Type the selector state
  const { destination, dateTo, dateFrom, clicked } = useSelector((state: { formData: FormData }) => state.formData)

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form data
    if (!destination || !dateTo || !dateFrom) {
      toast("Both Fields are required")
      return
    }

    // Create package data object
    const packageData = {
      destination,
      dateTo,
      dateFrom,
      selectedDate: `${dateFrom} - ${dateTo}`
    }

    setLoading(true)

    try {
      if (currentPath === '/trip-planner') {
        // Handle trip planner specific logic
        setTimeout(() => {
          dispatch(Button(true))
        }, 2000)
      } else {
        // Handle navigation to explore page with data
        dispatch(Button(true))
        
        // You can either:
        // 1. Use query parameters
        router.push(`/explore?destination=${encodeURIComponent(destination)}&dateFrom=${encodeURIComponent(dateFrom)}&dateTo=${encodeURIComponent(dateTo)}`)
        
        // 2. Or store in Redux for access in explore page
        // dispatch(setExplorePageData(packageData))
        // router.push('/explore')
      }
    } catch (error) {
      toast("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`w-full ${props.position ? props.position : "absolute"} -bottom-40 sm:-bottom-16 lg:-bottom-10 flex items-center justify-center`}>
      <div className='bg-white shadow-lg overflow-x-hidden rounded-lg py-5 lg:w-7/12'>
        <form onSubmit={submitHandler} className='flex sm:flex-row items-baseline flex-col justify-center gap-y-4 flex-wrap'>
          <div className="relative">
            <Selector />
          </div>
          <div className="relative">
            <DatePickerWithRange />
          </div>
          <div className="relative">
            <button 
              type='submit' 
              className="flex flex-row ml-4 gap-x-1 sm:ml-0 capitalize items-center bg-orange-600 p-2 text-white rounded-lg justify-center"
              disabled={loading}
            >
              <IoSearch size={23} />
              {loading ? "Searching...." : 'Search package'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}