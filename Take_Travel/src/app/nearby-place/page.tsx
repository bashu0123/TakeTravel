"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ASSETS } from "../../../public/Assets";
import { Search } from "lucide-react";

// Define icons for different place types
const createIcon = (iconUrl: string, size: number = 32) => new L.Icon({
  iconUrl,
  iconSize: [size, size],
  iconAnchor: [size/2, size],
  popupAnchor: [0, -size],
});

const icons = {
  restaurant: createIcon(ASSETS.resturant),
  hotel: createIcon(ASSETS.hotel),
  bus: createIcon(ASSETS.bus),
  heritage: createIcon(ASSETS.heritage),
  location: createIcon(ASSETS.destination, 96),
};

interface Location {
  lat: number;
  lng: number;
  name?: string;
}

interface Place {
  name: string;
  lat: number;
  lng: number;
  type: string;
}

// Component to handle map center updates
const MapCenterHandler = ({ center }: { center: Location | null }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], 14);
    }
  }, [center, map]);
  return null;
};

const NearbyPage = () => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [searchLocation, setSearchLocation] = useState<Location | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [map, setMap] = useState<any>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedType, setSelectedType] = useState<string>("restaurant");
  const [isLoading, setIsLoading] = useState(true);
  const [activeLocation, setActiveLocation] = useState<Location | null>(null);

  // Fetch user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            name: "Your Location"
          };
          setUserLocation(newLocation);
          setActiveLocation(newLocation);
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Set default location to London instead of Delhi
          const defaultLocation = {
            lat: 51.5074,
            lng: -0.1278,
            name: "Default Location"
          };
          setUserLocation(defaultLocation);
          setActiveLocation(defaultLocation);
          setIsLoading(false);
        }
      );
    }
  }, []);

  // Fetch places when location or type changes
  useEffect(() => {
    if (activeLocation) {
      fetchNearbyPlaces(activeLocation, selectedType);
    }
  }, [activeLocation, selectedType]);

  // Search for location using Nominatim API
  const searchLocations = async () => {
    if (!searchQuery) return;

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );

      if (response.data && response.data[0]) {
        const location = {
          lat: parseFloat(response.data[0].lat),
          lng: parseFloat(response.data[0].lon),
          name: response.data[0].display_name
        };
        setSearchLocation(location);
        setActiveLocation(location);
      }
    } catch (error) {
      console.error("Error searching location:", error);
    }
  };


const fetchNearbyPlaces = async (location: Location, type: string) => {
    let queryCondition = "";
  
    // Determine the correct OSM tag based on the place type
    switch (type) {
      case "bus":
        queryCondition = `
          node["amenity"="bus_station"](around:5000, ${location.lat}, ${location.lng});
          node["highway"="bus_stop"](around:5000, ${location.lat}, ${location.lng});
        `;
        break;
      case "hotel":
        queryCondition = `node["tourism"="hotel"](around:5000, ${location.lat}, ${location.lng});`;
        break;
      case "restaurant":
        queryCondition = `node["amenity"="restaurant"](around:5000, ${location.lat}, ${location.lng});`;
        break;
      case "heritage":
        queryCondition = `
          node["heritage"="yes"](around:5000, ${location.lat}, ${location.lng});
          node["historic"](around:5000, ${location.lat}, ${location.lng});
        `;
        break;
      default:
        queryCondition = `node["amenity"="${type}"](around:5000, ${location.lat}, ${location.lng});`;
    }
  
    // Construct the Overpass API query
    const overpassQuery = `
      [out:json];
      (
        ${queryCondition}
      );
      out center;
    `;
  
    const overpassURL = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;
  
    try {
      const response = await axios.get(overpassURL);
      const placeData = response.data.elements.map((place: any) => ({
        name: place.tags.name || `Unnamed ${type}`,
        lat: place.lat || place.center.lat,
        lng: place.lon || place.center.lon,
        type
      }));
      setPlaces(placeData);
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      setPlaces([]);
    }
  };
  
  // Center map on user's location
  const goToMyLocation = () => {
    if (userLocation) {
      setActiveLocation(userLocation);
    }
  };

  if (isLoading) {
    return <div className="w-full h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="relative w-full h-screen">
      {/* Controls Container */}
      <div className="absolute top-4 left-4 z-10 bg-white p-4 ml-20 rounded-lg shadow-md space-y-4">
        {/* Search Box */}
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchLocations()}
            className="w-48"
          />
          <Button onClick={searchLocations} className="p-2">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Place Type Selector */}
        <Select onValueChange={setSelectedType} defaultValue={selectedType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select place type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="restaurant">Restaurants</SelectItem>
            <SelectItem value="hotel">Hotels</SelectItem>
            <SelectItem value="heritage">Heritage</SelectItem>

            
            <SelectItem value="bus">Bus Stations</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Map */}
      <MapContainer
        center={activeLocation || [0, 0]}
        zoom={14}
        style={{ width: "100%", height: "100vh" }}
        ref={setMap}
        className="z-0"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        <MapCenterHandler center={activeLocation} />

        {/* User Location Marker */}
        {userLocation && (
          <Marker 
            position={userLocation}
            icon={icons.location}
          >
            <Popup>Your Location</Popup>
          </Marker>
        )}

        {/* Search Location Marker */}
        {searchLocation && (
          <Marker 
            position={searchLocation}
            icon={icons.location}
          >
            <Popup>{searchLocation.name || "Searched Location"}</Popup>
          </Marker>
        )}

        {/* Search Radius Circle */}
        {activeLocation && (
          <Circle
            center={activeLocation}
            radius={5000}
            pathOptions={{ color: "blue", fillColor: "blue", fillOpacity: 0.2 }}
          />
        )}

        {/* Place Markers */}
        {places.map((place, index) => (
          <Marker
            key={index}
            position={{ lat: place.lat, lng: place.lng }}
            icon={icons[place.type as keyof typeof icons]}
          >
            <Popup>{place.name}</Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Location Button */}
      <div className="absolute top-4 right-4 z-10">
        <Button 
          onClick={goToMyLocation} 
          className="bg-orange-600 text-white hover:bg-orange-400"
        >
          Go to My Location
        </Button>
      </div>
    </div>
  );
};

export default NearbyPage;