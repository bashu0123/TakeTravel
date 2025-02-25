"use client"

import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useSelector, useDispatch } from "react-redux"
import { Destination } from '@/redux/feature/Api.Slice'
import { ImLocation } from 'react-icons/im'
import axios from 'axios'
import { toast } from 'react-hot-toast'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CommandList } from "cmdk"

interface Package {
  id: string;
  name: string;
  title?: string;
  price: string;
  duration: string;
  imageBase64: string;
  destination:string;
}

interface ApiResponse {
  data: {
    packages: Package[];
  };
}

export function Selector(): JSX.Element {
  const [open, setOpen] = React.useState<boolean>(false)
  const [value, setValue] = React.useState<string>("")
  const [packages, setPackages] = React.useState<Package[]>([])
  const formData = useSelector((state: any) => state.formData.destination)
  const dispatch = useDispatch()

  const getPackages = async (): Promise<void> => {
    try {
      const result = await axios.get<ApiResponse>('http://localhost:8000/packages/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('take-travel-token')}`
        }
      });

      const fetchedPackages = result.data?.data?.packages;

      if (Array.isArray(fetchedPackages)) {
        setPackages(fetchedPackages);
      } else {
        console.error("Expected an array but got:", fetchedPackages);
        setPackages([]);
      }
    } catch (error) {
      toast.error("Failed to fetch packages");
      console.error("Error fetching packages:", error);
    }
  };

  React.useEffect(() => {
    getPackages();
  }, []);

  React.useEffect(() => {
    if (value.length > 0) {
      const selectedPackage = packages.find((item) => item.id === value);
      if (selectedPackage) {
        dispatch(Destination(selectedPackage.destination.toLowerCase()));
      }
    }
  }, [value, packages, dispatch]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="travelTrills"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          <ImLocation size={25} />
          {value
            ? packages.find((pkg) => pkg.id === value)?.name
            : "Select Package"}
          <CaretSortIcon className="ml-2 h-6 w-6 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] h-[40vh] p-0">
        <Command>
          <CommandInput placeholder="Search package..." className="h-9" />
          <CommandEmpty>No package found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {packages.length > 0 ? (
                packages.map((pkg) => (
                  <CommandItem
                    key={pkg.id}
                    value={pkg.id}
                    onSelect={(currentValue: string) => {
                      setValue(currentValue === value ? "" : currentValue)
                      setOpen(false)
                    }}
                  >
                    {pkg.name}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === pkg.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))
              ) : (
                <CommandEmpty>No packages available.</CommandEmpty>
              )}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}