
"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Clock, Search, MapPin, Info, UserCog } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

interface Package {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  imageBase64: string;
  destination: string;
  origin: string;
  difficulty: string;
  includes: string[];
}

interface FormData {
  startDate: string;
  packageId: string;
  wantGuide: boolean;
}

const Booking = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const [formData, setFormData] = useState<FormData>({
    startDate: "",
    packageId: "",
    wantGuide: false
  });

  const router = useRouter();

  const calculateEndDate = (startDate: string, duration: number) => {
    if (!startDate) return "";
    const date = new Date(startDate);
    date.setDate(date.getDate() + duration);
    return date.toISOString().split("T")[0];
  };

  const getPackages = async () => {
    try {
      const result = await axios.get("http://localhost:8000/packages/");
      const fetchedPackages = result.data?.data?.packages;
      if (Array.isArray(fetchedPackages)) {
        setPackages(fetchedPackages);
      }
    } catch (error) {
      toast.error("Failed to fetch packages");
    }
  };

  useEffect(() => {
    getPackages();
  }, []);

  const filteredPackages = packages.filter((pkg) =>
    pkg.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPkg || !formData.startDate) {
      toast.error("Please select a package and start date");
      return;
    }

    const token = localStorage.getItem("take-travel-token");
    const userId = localStorage.getItem("take-travel-userId");

    if (!token || !userId) {
      router.push("/auth");
      toast.error("You must be logged in to book a package!");
      return;
    }

    try {
      const bookingData = {
        packageId: selectedPkg._id,
        userId,
        startDate: formData.startDate,
        guideId: formData.wantGuide ? null : undefined
      };

      await axios.post("http://localhost:8000/bookings/", bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Booking created successfully!");
      setFormData({ startDate: "", packageId: "", wantGuide: false });
      setSelectedPkg(null);
    } catch (error) {
      toast.error("Failed to create booking");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Section - Package Selection */}
        <div className="space-y-6">
          <div>
            <h5 className="font-bold text-2xl md:text-4xl text-orange-600">
              Find Your Package
            </h5>
            <div className="mt-4 relative">
              <input
                type="text"
                placeholder="Search packages..."
                className="w-full p-4 pr-12 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg._id}
                className={`rounded-xl m-8 overflow-y-auto shadow-lg bg-white cursor-pointer hover:shadow-xl transform hover:-translate-y-1 transition-all
                  ${
                    selectedPkg?._id === pkg._id
                      ? "ring-4 ring-orange-600"
                      : "hover:ring-2 hover:ring-orange-400"
                  }`}
                onClick={() => setSelectedPkg(pkg)}
              >
                <div className="flex">
                  <div className="w-32 h-32 p-2">
                    <img
                      src={pkg.imageBase64 || "/api/placeholder/128/128"}
                      alt={pkg.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <div className="p-4 flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {pkg.name}
                      </h3>
                      <span className="font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        ${pkg.price}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                      {pkg.description}
                    </p>
                    <div className="flex items-center text-gray-600 mt-2">
                      <Clock className="w-4 h-4" />
                      <span className="ml-2 text-sm">{pkg.duration} days</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section - Booking Form */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-2xl font-semibold mb-6">Book Your Tour</h1>

          {selectedPkg ? (
            <div className="mb-8 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {selectedPkg.name}
                  </h3>
                  <span className="font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                    ${selectedPkg.price}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
              Select a package to see details
            </div>
          )}

          <form onSubmit={handleBooking} className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-lg mb-2">Start Date</label>
                <input
                  type="date"
                  className="p-4 rounded-xl border focus:ring-2 focus:ring-orange-400"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              
              {/* Guide Preference Toggle */}
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                <UserCog className="w-5 h-5 text-gray-600" />
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={formData.wantGuide}
                      onChange={(e) =>
                        setFormData({ ...formData, wantGuide: e.target.checked })
                      }
                    />
                    <div className={`block w-14 h-8 rounded-full transition-colors ${
                      formData.wantGuide ? "bg-orange-600" : "bg-gray-300"
                    }`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                      formData.wantGuide ? "translate-x-6" : "translate-x-0"
                    }`}></div>
                  </div>
                  <span className="ml-3 text-gray-700">I would like a guide for this tour</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 text-white transition-all hover:bg-orange-700 font-medium rounded-xl p-4 focus:outline-none text-lg"
            >
              Book Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Booking;