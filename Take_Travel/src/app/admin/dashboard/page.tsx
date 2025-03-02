'use client'

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Legend, Pie, Cell } from 'recharts';
import { Edit, ChevronDown, ChevronUp, Check, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

interface Package {
  _id: string;
  name: string;
  price: number;
  duration: number;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Booking {
  _id: string;
  packageId: Package;
  userId: User;
  guideId: string | null;
  startDate: string;
  endDate: string;
  status: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

interface Guide {
  _id: string;
  name: string;
  status: 'Available' | 'Booked';
}

interface BookingChartData {
  month: string;
  bookings: number;
}

interface AccountsChartData {
  month: string;
  accounts: number;
}

const bookingsChartData: BookingChartData[] = [
  { month: 'Jan', bookings: 120 },
  { month: 'Feb', bookings: 180 },
  { month: 'Mar', bookings: 200 },
  { month: 'Apr', bookings: 300 },
  { month: 'May', bookings: 250 }
];

const newAccountsData: AccountsChartData[] = [
  { month: 'Feb', accounts: 85 },
  { month: 'Mar', accounts: 100 },
  { month: 'Apr', accounts: 130 },
  { month: 'May', accounts: 170 }
];
const COLORS = ['#EA580C', '#0EA5E9', '#22C55E', '#FACC15']; // Orange, Blue, Green, Yellow


const statusOptions = ['pending', 'confirmed', 'cancelled', 'completed'];

const TravelDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [guideSearch, setGuideSearch] = useState<string>('');
  const [bookingsChartData, setBookingsChartData] = useState<BookingChartData[]>([]);
  const [chartData, setChartData] = useState<any []>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(()=>{
    const fetchGuides = async()=>{
      const response = await axios.get('http://localhost:8000/users/all-guides')
      
    setGuides(response.data.data.users)
    }
    fetchGuides()
  },[])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("take-travel-token");
        if (!token) {
          throw new Error("No token found in localStorage");
        }

        const response = await axios.get("http://127.0.0.1:8000/bookings/getAllBookings", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.status === 'success') {
          setBookings(response.data.data.bookings);
          processChartData(response.data.data.bookings);
          setBookings(response.data.data.bookings);
          const bookingCounts: { [key: string]: number } = {};
          response.data.data.bookings.forEach((booking: Booking) => {
            const month = new Date(booking.createdAt).toLocaleString('default', { month: 'short' });
            bookingCounts[month] = (bookingCounts[month] || 0) + 1;
          });
  
          // Convert to array for the chart
          const chartData = Object.entries(bookingCounts).map(([month, count]) => ({
            month,
            bookings: count
          })).sort((a, b) => new Date(`1 ${a.month} 2024`).getMonth() - new Date(`1 ${b.month} 2024`).getMonth());
  
          setBookingsChartData(chartData);

        }
        
          
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processChartData = (bookings: Booking[]) => {
    const statusCounts: { [key: string]: number } = {};

    bookings.forEach((booking) => {
      const status = booking.status || "Unknown"; // Default to "Unknown" if no status
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    const formattedData = Object.keys(statusCounts).map((status) => ({
      name: status,
      value: statusCounts[status],
    }));

    setChartData(formattedData);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("take-travel-token");
//       if (!token) throw new Error("No token found");

//       const { data } = await axios.get("http://127.0.0.1:8000/bookings/getAllBookings", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (data.status === 'success') {
//         setBookings(data.data.bookings);

//         // Process data for chart
//         const bookingCounts: { [key: string]: number } = {};
//         data.data.bookings.forEach((booking: Booking) => {
//           const month = new Date(booking.createdAt).toLocaleString('default', { month: 'short' });
//           bookingCounts[month] = (bookingCounts[month] || 0) + 1;
//         });

//         // Convert to array for the chart
//         const chartData = Object.entries(bookingCounts).map(([month, count]) => ({
//           month,
//           bookings: count
//         })).sort((a, b) => new Date(`1 ${a.month} 2024`).getMonth() - new Date(`1 ${b.month} 2024`).getMonth());

//         setBookingsChartData(chartData);
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'An error occurred');
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchData();
// }, []);


  

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("take-travel-token");
      if (!token) throw new Error("No token found");

      const response = await axios.patch(
        `http://127.0.0.1:8000/bookings/${bookingId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status === 'success') {
        setBookings(bookings.map(booking => 
          booking._id === bookingId ? { ...booking, status: newStatus } : booking
        ));
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update booking status");
    }
  };

  const handleGuideAssign = async (bookingId: string, guideId: string | null) => {
    try {
      const token = localStorage.getItem("take-travel-token");
      if (!token) throw new Error("No token found");

      const response = await axios.patch(
        `http://127.0.0.1:8000/bookings/${bookingId}/assign-guide`,
        { guideId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status === 'success') {
        setBookings(bookings.map(booking => 
          booking._id === bookingId ? { ...booking, guideId } : booking
        ));
      }
    } catch (error) {
      console.error("Error assigning guide:", error);
      setError("Failed to assign guide");
    }
  };

  const getGuideName = (guideId: string | null): string => {
    if (!guideId) return 'Not assigned';
    const guide = guides.find(g => g._id === guideId);
    return guide ? guide.name : 'Unknown';
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col gap-6 p-8 bg-gray-50 min-h-screen">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Travel Booking Dashboard</h1>
      
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Total Bookings</CardTitle>
              <CardDescription>Last 5 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={bookingsChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="bookings" 
                      stroke="#EA580C" 
                      fill="#EA580C" 
                      fillOpacity={0.2} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>New User Accounts</CardTitle>
              <CardDescription>Last 4 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={chartData} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={100} 
                  label 
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Manage and review recent booking activities</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned Guide</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking._id}>
                    <TableCell>{booking._id}</TableCell>
                    <TableCell>{booking.userId.name}</TableCell>
                    <TableCell>{booking.packageId.name}</TableCell>
                    <TableCell>{new Date(booking.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(booking.endDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="p-0 h-auto">
                            <Badge className={`${getStatusColor(booking.status)}`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </Badge>
                            <ChevronDown className="h-4 w-4 ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {statusOptions.map(status => (
                            <DropdownMenuItem 
                              key={status}
                              onClick={() => handleStatusChange(booking._id, status)}
                            >
                              <div className="flex items-center">
                                {status === booking.status && (
                                  <Check className="h-4 w-4 mr-2" />
                                )}
                                <span className={status === booking.status ? "font-bold" : ""}>
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </span>
                              </div>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full justify-between">
                            <span className="truncate mr-2">
                              {getGuideName(booking.guideId)}
                            </span>
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <div className="p-2">
                            <div className="flex items-center border rounded-md px-2">
                              <Search className="h-4 w-4 text-gray-400" />
                              <Input 
                                placeholder="Search guides..." 
                                className="border-0 focus-visible:ring-0"
                                value={guideSearch}
                                onChange={(e) => setGuideSearch(e.target.value)}
                              />
                            </div>
                          </div>
                          <DropdownMenuItem 
                            onClick={() => handleGuideAssign(booking._id, null)}
                          >
                            <div className="flex items-center">
                              {booking.guideId === null && (
                                <Check className="h-4 w-4 mr-2" />
                              )}
                              <span className={booking.guideId === null ? "font-bold" : ""}>
                                Not assigned
                              </span>
                            </div>
                          </DropdownMenuItem>
                          {guides
                            .filter(guide => guide.name.toLowerCase().includes(guideSearch.toLowerCase()))
                            .map(guide => (
                              <DropdownMenuItem 
                                key={guide._id}
                                onClick={() => handleGuideAssign(booking._id, guide._id)}
                              >
                                <div className="flex items-center">
                                  {booking.guideId === guide._id && (
                                    <Check className="h-4 w-4 mr-2" />
                                  )}
                                  <span className={booking.guideId === guide._id ? "font-bold" : ""}>
                                    {guide.name}
                                  </span>
                                </div>
                              </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default TravelDashboard;