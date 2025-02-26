"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import axios from "axios";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const ITEMS_PER_PAGE = 6;

const ExplorePage = () => {
  const router = useRouter();  // Initialize router to update URL

  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [duration, setDuration] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const formData = useSelector((state: any) => state.formData);

  // Get data from URL parameters
  const destination = searchParams.get('destination');
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');

  const { destination: reduxDestination, dateFrom: reduxDateFrom, dateTo: reduxDateTo } = formData;

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setPriceRange("");
    setDuration("");
    setCurrentPage(1);
    router.push('/explore');  // This will update the URL without the filters

  };

  // Handle page navigation (back/forward)
  useEffect(() => {
    resetFilters();
    
    // Set initial search query from URL or Redux
    const initialDestination = destination || reduxDestination;
    if (initialDestination) {
      setSearchQuery(initialDestination);
    }

    // Calculate and set duration from dates
    const dates = {
      from: dateFrom || reduxDateFrom,
      to: dateTo || reduxDateTo
    };

    if (dates.from && dates.to) {
      const tripDuration = calculateDateDifference(dates.from, dates.to);
      if (tripDuration) {
        setDuration(tripDuration);
      }
    }
  }, [pathname, destination, dateFrom, dateTo]);

  // Calculate date difference
  const calculateDateDifference = (from: string, to: string) => {
    if (!from || !to) return null;
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) return "short";
    if (diffDays <= 14) return "medium";
    return "long";
  };

  const getPackage = async () => {
    setLoading(true);
    setError(false);
    try {
      const source = axios.CancelToken.source();

      const timeout = setTimeout(() => {
        source.cancel("Request timeout, taking too long.");
        toast.error("Request timed out. Please try again.");
        setError(true);
        setLoading(false);
      }, 10000);

      const result = await axios.get("http://localhost:8000/packages/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("take-travel-token")}`,
        },
        cancelToken: source.token,
      });

      clearTimeout(timeout);

      const fetchedPackages = result.data?.data?.packages;
      setPackages(Array.isArray(fetchedPackages) ? fetchedPackages : []);
    } catch (error) {
      if (!axios.isCancel(error)) {
        toast.error("Failed to fetch packages");
        console.error("Error fetching packages:", error);
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    resetFilters();
    getPackage();
  }, []);

  // Handle manual filter changes
  const handleFilterChange = (type: string, value: string) => {
    switch (type) {
      case 'search':
        setSearchQuery(value);
        break;
      case 'price':
        setPriceRange(value);
        break;
      case 'duration':
        setDuration(value);
        break;
    }
    setCurrentPage(1); // Reset to first page when filters change
  };

  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      const matchesSearch = searchQuery
        ? pkg.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pkg.destination?.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      const cost = pkg.price ? parseInt(pkg.price.toString().replace(/[^0-9]/g, "")) : 0;
      const days = pkg.duration ? parseInt(pkg.duration.toString().replace(/[^0-9]/g, "")) : 0;

      const matchesPrice =
        !priceRange ||
        (priceRange === "0-5000" && cost <= 5000) ||
        (priceRange === "5000-15000" && cost > 5000 && cost <= 15000) ||
        (priceRange === "15000+" && cost > 15000);

      const matchesDuration =
        !duration ||
        (duration === "short" && days <= 7) ||
        (duration === "medium" && days > 7 && days <= 14) ||
        (duration === "long" && days > 14);

      return matchesSearch && matchesPrice && matchesDuration;
    });
  }, [searchQuery, priceRange, duration, packages]);

  const totalPages = Math.ceil(filteredPackages.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPackages = filteredPackages.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="py-12 px-6 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-10">Explore Packages</h2>

        {/* Search & Filters */}
        <div className="mb-8 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[300px]">
            <input
              type="text"
              placeholder="Search destinations..."
              className="w-full p-3 border rounded-lg"
              value={searchQuery}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          <select 
            className="p-3 border rounded-lg"
            value={priceRange}
            onChange={(e) => handleFilterChange('price', e.target.value)}
          >
            <option value="">Price Range</option>
            <option value="0-5000">$0 - $5k</option>
            <option value="5000-15000">$5k - $15k</option>
            <option value="15000+">$15k+</option>
          </select>
          <select 
            className="p-3 border rounded-lg"
            value={duration}
            onChange={(e) => handleFilterChange('duration', e.target.value)}
          >
            <option value="">Duration</option>
            <option value="short">1-7 days</option>
            <option value="medium">8-14 days</option>
            <option value="long">15+ days</option>
          </select>
          <button
            onClick={resetFilters}
            className="px-3 border w-17  h-13  text-white rounded-lg bg-red-400 hover:bg-red-200 transition-colors"
          >
            ↻ Reset 
          </button>
        </div>

        {/* Loading & Error States */}
        {loading ? (
          <div className="text-center text-gray-500 text-lg">Loading packages...</div>
        ) : error ? (
          <div className="text-center text-red-500 text-lg">
            Failed to load packages.
            <button onClick={getPackage} className="ml-4 text-blue-600 underline">
              Retry
            </button>
          </div>
        ) : paginatedPackages.length > 0 ? (
          <>
            <div className="mb-4 text-gray-600">
              Showing {Math.min(startIndex + 1, filteredPackages.length)} -{" "}
              {Math.min(startIndex + ITEMS_PER_PAGE, filteredPackages.length)} of{" "}
              {filteredPackages.length} packages
            </div>

            {/* Package Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedPackages.map((pkg) => (
                <div
                  key={pkg.id || pkg.name}
                  className="rounded-xl overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300"
                >
                  <img
                    src={pkg.imageBase64}
                    alt={pkg.name}
                    className="object-cover w-full h-56"
                    loading="lazy"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold">{pkg.name}</h3>
                      <span className="font-semibold text-green-700">
                        ${pkg.price}
                      </span>
                    </div>
                    <span className="font-normal">{pkg.destination}</span>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="ml-2 text-sm">{pkg.duration} days</span>
                    </div>
                    <div className="mt-4 flex gap-4 justify-center">
                      <Link href={`/country-detail/${pkg.id}`} className="w-3/5">
                        <button className="w-full bg-[#43B97F] text-white py-3 rounded-lg hover:ring-2 hover:ring-[#43B97F] transition">
                          More Details
                        </button>
                      </Link>
                      <Link href={`/book-now`} className="w-3/5">
                        <button className="w-full bg-orange-600 text-white py-3 rounded-lg hover:ring-2 hover:ring-orange-400 transition">
                          Book Now
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center items-center gap-2">
              <button 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1} 
                className="p-2 rounded-lg border disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button 
                  key={index} 
                  onClick={() => handlePageChange(index + 1)} 
                  className={`w-10 h-10 rounded-lg border ${
                    currentPage === index + 1 ? 'bg-orange-600 text-white' : ''
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages} 
                className="p-2 rounded-lg border disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 text-lg">No packages found matching your criteria</div>
        )}
      </div>
    </section>
  );
};

export default ExplorePage;