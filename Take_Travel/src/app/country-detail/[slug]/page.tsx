"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { ASSETS } from "../../../../public/Assets";
import PopularDestinations from "@/components/template/planner/PopularDestinations";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@radix-ui/react-select";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { MapPin, Plane, PlaneTakeoff, Wallet } from "lucide-react";
import { motion } from "framer-motion"
import Link from "next/link";


interface CountryData {
  name: string;
  description: string;
  destination: string;
  difficulty: string;
  duration: number;
  origin: string;
  price: number;
  transport: string[];
  imageBase64: string;
  banner?: string;
  updatedAt: string;
}

function CountryDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [countryData, setCountryData] = useState<CountryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const formatCountryName = (slug: string) => {
    return decodeURIComponent(slug)
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formattedCountryName = formatCountryName(slug);

  useEffect(() => {
    const fetchCountryData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:8000/packages/${slug}`);
        setCountryData(response.data.data.package);
      } catch (err) {
        setError("Failed to fetch country details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCountryData();
  }, [slug]);

  return (
    <>
      {/* Banner Section */}
      <div
        className="h-[40vh] w-full flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${countryData?.banner || ASSETS.banner})` }}
      >
        <h1 className="text-3xl md:text-5xl capitalize text-white font-bold">
          {countryData?.name}
        </h1>
      </div>

      {/* Country Details */}
      <div className="max-w-7xl mx-auto py-12 px-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading country details...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : countryData ? (
          <div className="p-4 md:p-8 h-88888">

          <Card className="mx-auto max-w-5xl  h-full ">
            <CardHeader className="p-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative h-[300px] md:h-[400px] w-full"
              >
                <img
                  src={countryData.imageBase64 || "/placeholder.svg"}
                  alt={countryData.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <Badge className="mb-2 bg-orange-600 hover:bg-orange-400 p-7">{countryData.difficulty}</Badge>
                  <h1 className="text-2xl md:text-4xl font-bold text-white">{countryData.destination}</h1>
                </div>
              </motion.div>
            </CardHeader>
            <CardContent className="grid gap-6 p-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <PlaneTakeoff className="h-5 w-5 text-primary" />
                  <span className="font-medium">From:</span>
                  <span>{countryData.origin}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="font-medium">To:</span>
                  <span>{countryData.destination}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Plane className="h-5 w-5 text-primary" />
                  <span className="font-medium">Transport:</span>
                  <span>{countryData.transport}</span>
                </div>
                <Separator className="my-4" />
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {/* <Lock className="h-5 w-5 text-primary" /> */}
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-medium">{countryData.duration}</p>
                    </div>
                  </div>
                  <Separator className="h-10" />
                  <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="font-medium">{countryData.price}</p>
                    </div>
                  </div>
                  
                </div>
                <div className="flex flex-col i gap-2">
                <span className="text-sm text-muted-foreground">Available all year round</span>
                <Calendar className="text-primary" />
              
              </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">About this tour</h2>
                <p className="text-muted-foreground leading-relaxed">{countryData.description}</p>
              </div>
            </CardContent>
            <CardFooter className=" justify-end gap-4 border-t p-6">
            <Link href="/book-now">
              <Button size="lg" className="bg-orange-600">Book Now</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
        ) : (
          <p className="text-center text-gray-500">No details available for this country.</p>
        )}
      </div>
    {/* <PopularDestinations destination={slug} /> */}
    </>
  );
}

export default CountryDetailPage;
