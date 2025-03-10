"use client";

import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, AlertCircle, CheckCircle, User } from 'lucide-react';
import axios from 'axios';


interface Booking {
  _id: string;
  packageId: Package;
  userId: UserInterface;
  guideId: Guide;
  startDate: string;
  endDate: string;
  status: string;  // Adjust based on possible statuses
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}

interface Package {
  _id: string;
  name: string;
  price: number;
  duration: number;
  imageBase64: string;
  id: string;
}

interface UserInterface {
  _id: string;
  name: string;
  email: string;
}

interface Guide {
  _id: string;
  name: string;
}


interface BookingCardProps {
  booking: Booking;
  onViewDetails: (booking: Booking) => void;
}

interface BookingDetailsProps {
  booking: Booking;
  onClose: () => void;
}


const BookingCard: React.FC<BookingCardProps> = ({ booking, onViewDetails }) => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <img
        //hello
          src={booking.packageId.imageBase64}
          alt={booking.packageId.name}
          className="w-full h-48 object-cover"
        />
        {/* <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
          booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {booking.paymentStatus === 'paid' ? 'Paid' : 'Payment Pending'}
        </div> */}
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">{booking.packageId.name}</h3>
            <p className="text-gray-600 text-sm mb-2">Booking Ref: {booking.packageId.name}</p>
          </div>
          <span className="text-lg font-semibold text-green-600">${booking.packageId.price}</span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm">
              {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
            </span>
          </div>
          {/* <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm">{booking.} Travelers</span>
          </div> */}
          {booking.guideId && (
            <div className="flex items-center text-gray-600">
              <User className="w-4 h-4 mr-2" />
              <span className="text-sm">Guide: {booking.guideId.name}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => onViewDetails(booking)}
          className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

const BookingDetails: React.FC<BookingDetailsProps> = ({ booking, onClose }) => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Ignore time, compare only dates
  
  const isUpcoming = new Date(booking.startDate) >= today;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-semibold">{booking.packageId.name}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Booking Reference</span>
              <span className="font-medium">{booking.id}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Status</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isUpcoming ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {isUpcoming ? 'Upcoming' : 'Completed'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Cost</span>
              <span className="font-medium text-orange-600">{booking.packageId.price}</span>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Trip Details</h4>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>
                    {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Travelers Name: {booking.userId.name} </span>
                </div>
              </div>
            </div>
            

            {booking.guideId ? (
  <div className="border-t pt-4">
    <h4 className="font-medium mb-3">Your Guide</h4>
    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
      <div className="flex items-center">
        <User className="w-5 h-5 mr-2 text-gray-600" />
        <span className="font-medium">
        {booking.guideId?.name ? booking.guideId.name : "Not assigned"}

        </span>
      </div>
      <div className="space-y-2 text-sm text-gray-600">
      </div>
    </div>
  </div>
) : (
  <div className="border-t pt-4">
    <h4 className="font-medium mb-3">Your Guide</h4>
    <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
      <p className="font-medium">Not assigned</p>
      <p className="text-red-500">Pending</p>
    </div>
  </div>
)}



            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Duration</h4>
          <span className='flex flex-column text-lg'>
                    <Clock className="w-4 h-4 mr-2 mt-1 text-green-600" />
                   {booking.packageId.duration}
                  </span>
            </div>

            {isUpcoming && (
              <div className="border-t pt-4">
                <div className="bg-blue-50 p-4 rounded-lg flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    Your trip is coming up! Make sure to check your email for important travel documents and pre-departure information.
                    {booking.guideId && " Your guide will contact you 48 hours before the trip starts."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MyBookingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [data, setData] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getGuideBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.post(
          `http://localhost:8000/bookings/user-bookings`,
          { userId: localStorage.getItem('take-travel-userId') },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        const bookings: Booking[] = response.data.data.bookings;
        setData(bookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError('Failed to load bookings. Please try again later.');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    getGuideBookings();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Ensure we're only comparing dates without time.

  // Filter upcoming and past trips
  const upcomingTrips = data.filter((booking) => new Date(booking.startDate) >= today);
  const pastTrips = data.filter((booking) => new Date(booking.endDate) < today);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-6 lg:px-20 text-center">
        <p>Loading your bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-6 lg:px-20">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  const filteredData = activeTab === 'upcoming' ? upcomingTrips : pastTrips;

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 lg:px-20">
      <h1 className="text-4xl font-bold mb-8">My Bookings</h1>

      <div className="flex space-x-4 mb-8 border-b">
        <button
          className={`pb-4 px-4 ${
            activeTab === 'upcoming'
              ? 'border-b-2 border-orange-600 text-orange-600 font-medium'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Trips
        </button>
        <button
          className={`pb-4 px-4 ${
            activeTab === 'completed'
              ? 'border-b-2 border-orange-600 text-orange-600 font-medium'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('completed')}
        >
          Past Trips
        </button>
      </div>

      {filteredData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredData.map((booking) => (
            <BookingCard 
              key={booking.id} 
              booking={booking} 
              onViewDetails={setSelectedBooking}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No {activeTab} trips</h3>
          <p className="text-gray-500">
            {activeTab === 'upcoming'
              ? "You don't have any upcoming trips. Start planning your next adventure!"
              : "You haven't completed any trips yet. Your travel history will appear here."}
          </p>
        </div>
      )}

      {selectedBooking && (
        <BookingDetails
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
};


export default MyBookingsPage;