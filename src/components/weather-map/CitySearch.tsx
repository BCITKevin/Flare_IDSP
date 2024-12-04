import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandInput
} from "@/components/ui/command";
import { InputHTMLAttributes } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import styles from './CitySearch.module.css';

// BC Cities data with coordinates
const bcCities = [
  { value: "abbotsford", label: "Abbotsford", lat: 49.0504, lon: -122.3045 },
  { value: "armstrong", label: "Armstrong", lat: 50.4484, lon: -119.1969 },
  { value: "burnaby", label: "Burnaby", lat: 49.2488, lon: -122.9805 },
  { value: "campbell_river", label: "Campbell River", lat: 50.0321, lon: -125.2725 },
  { value: "castlegar", label: "Castlegar", lat: 49.3240, lon: -117.6593 },
  { value: "chilliwack", label: "Chilliwack", lat: 49.1579, lon: -121.9514 },
  { value: "colwood", label: "Colwood", lat: 48.4236, lon: -123.4958 },
  { value: "coquitlam", label: "Coquitlam", lat: 49.2838, lon: -122.7932 },
  { value: "courtenay", label: "Courtenay", lat: 49.6877, lon: -124.9994 },
  { value: "cranbrook", label: "Cranbrook", lat: 49.5097, lon: -115.7685 },
  { value: "dawson_creek", label: "Dawson Creek", lat: 55.7596, lon: -120.2377 },
  { value: "delta", label: "Delta", lat: 49.0847, lon: -123.0587 },
  { value: "duncan", label: "Duncan", lat: 48.7787, lon: -123.7079 },
  { value: "enderby", label: "Enderby", lat: 50.5507, lon: -119.1397 },
  { value: "fernie", label: "Fernie", lat: 49.5040, lon: -115.0633 },
  { value: "fort_st_john", label: "Fort St. John", lat: 56.2527, lon: -120.8476 },
  { value: "grand_forks", label: "Grand Forks", lat: 49.0334, lon: -118.4400 },
  { value: "greenwood", label: "Greenwood", lat: 49.0917, lon: -118.6784 },
  { value: "kamloops", label: "Kamloops", lat: 50.6745, lon: -120.3273 },
  { value: "kelowna", label: "Kelowna", lat: 49.8880, lon: -119.4960 },
  { value: "kimberley", label: "Kimberley", lat: 49.6697, lon: -115.9775 },
  { value: "langford", label: "Langford", lat: 48.4474, lon: -123.5046 },
  { value: "langley", label: "Langley", lat: 49.1042, lon: -122.6604 },
  { value: "maple_ridge", label: "Maple Ridge", lat: 49.2193, lon: -122.5984 },
  { value: "merritt", label: "Merritt", lat: 50.1113, lon: -120.7862 },
  { value: "mission", label: "Mission", lat: 49.1337, lon: -122.3249 },
  { value: "nanaimo", label: "Nanaimo", lat: 49.1659, lon: -123.9401 },
  { value: "nelson", label: "Nelson", lat: 49.4928, lon: -117.2948 },
  { value: "new_westminster", label: "New Westminster", lat: 49.2057, lon: -122.9110 },
  { value: "north_vancouver", label: "North Vancouver", lat: 49.3200, lon: -123.0724 },
  { value: "parksville", label: "Parksville", lat: 49.3192, lon: -124.3157 },
  { value: "penticton", label: "Penticton", lat: 49.4991, lon: -119.5937 },
  { value: "pitt_meadows", label: "Pitt Meadows", lat: 49.2327, lon: -122.6891 },
  { value: "port_alberni", label: "Port Alberni", lat: 49.2337, lon: -124.8055 },
  { value: "port_coquitlam", label: "Port Coquitlam", lat: 49.2626, lon: -122.7810 },
  { value: "port_moody", label: "Port Moody", lat: 49.2849, lon: -122.8677 },
  { value: "powell_river", label: "Powell River", lat: 49.8352, lon: -124.5247 },
  { value: "prince_george", label: "Prince George", lat: 53.9171, lon: -122.7497 },
  { value: "prince_rupert", label: "Prince Rupert", lat: 54.3150, lon: -130.3208 },
  { value: "quesnel", label: "Quesnel", lat: 52.9784, lon: -122.4927 },
  { value: "revelstoke", label: "Revelstoke", lat: 50.9981, lon: -118.1957 },
  { value: "richmond", label: "Richmond", lat: 49.1666, lon: -123.1336 },
  { value: "rossland", label: "Rossland", lat: 49.0781, lon: -117.8021 },
  { value: "salmon_arm", label: "Salmon Arm", lat: 50.7001, lon: -119.2838 },
  { value: "surrey", label: "Surrey", lat: 49.1913, lon: -122.8490 },
  { value: "terrace", label: "Terrace", lat: 54.5182, lon: -128.6032 },
  { value: "trail", label: "Trail", lat: 49.0966, lon: -117.7117 },
  { value: "vancouver", label: "Vancouver", lat: 49.2827, lon: -123.1207 },
  { value: "vernon", label: "Vernon", lat: 50.2671, lon: -119.2720 },
  { value: "victoria", label: "Victoria", lat: 48.4284, lon: -123.3656 },
  { value: "west_kelowna", label: "West Kelowna", lat: 49.8625, lon: -119.5833 },
  { value: "white_rock", label: "White Rock", lat: 49.0253, lon: -122.8029 },
  { value: "williams_lake", label: "Williams Lake", lat: 52.1417, lon: -122.1417 },
];

interface CitySearchProps {
  onCitySelect: (city: { lat: number; lon: number; label: string }) => void;
}

const CitySearch: React.FC<CitySearchProps> = ({ onCitySelect }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelectCity = (currentValue: string) => {
    setValue(currentValue === value ? "" : currentValue);
    setOpen(false);
    const selectedCity = bcCities.find((c) => c.value === currentValue);
    if (selectedCity) {
      onCitySelect({
        lat: selectedCity.lat,
        lon: selectedCity.lon,
        label: selectedCity.label
      });
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      const firstCity = bcCities.find((city) => city.value.toLowerCase().includes(value.toLowerCase()));
      if (firstCity) {
        handleSelectCity(firstCity.value);
      }
    } else if (event.key === "ArrowDown") {
      setHighlightedIndex((prevIndex) => Math.min(prevIndex + 1, bcCities.length - 1));
    } else if (event.key === "ArrowUp") {
      setHighlightedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      if (inputRef.current) {
        inputRef.current.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`${styles.button} w-full justify-between bg-black text-white border-gray-700 hover:bg-gray-900`}
        >
          {value
            ? bcCities.find((city) => city.value === value)?.label
            : "Search for a city in BC..."}
          <ChevronsUpDown size={18} className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command className="bg-black text-white border border-gray-700">
          <CommandInput
            ref={inputRef}
            placeholder="Search BC cities..."
            className="text-white"
            value={value}
            onValueChange={(value: string) => setValue(value)}
          />
          <CommandEmpty>No city found.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {bcCities.map((city, index) => (
              <CommandItem
                key={city.value}
                value={city.value}
                onSelect={() => handleSelectCity(city.value)}
                className={cn(
                  "cursor-pointer hover:bg-gray-800 text-white",
                  highlightedIndex === index && "bg-gray-700"
                )}
              >
                <Check
                  size={18}
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === city.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {city.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CitySearch;