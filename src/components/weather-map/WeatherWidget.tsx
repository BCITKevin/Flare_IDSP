import React, { useState, useEffect } from 'react';
import { Cloud } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface WeatherWidgetProps {
  temperature?: number;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ temperature: initialTemp }) => {
  const [temperature, setTemperature] = useState<number | null>(initialTemp ?? null);

  useEffect(() => {
    const fetchVancouverWeather = async () => {
      try {
        const geoResponse = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=Vancouver&limit=1&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
        );
        const geoData = await geoResponse.json();

        if (geoData.length === 0) return;

        const { lat, lon } = geoData[0];

        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=metric`
        );
        const data = await weatherResponse.json();
        setTemperature(Math.round(data.current.temp));
      } catch (error) {
        console.error("Error fetching weather:", error);
      }
    };

    fetchVancouverWeather();
  }, []);

  return (
    <div className="absolute top-4 left-4 z-10">
      <Card className="bg-[#1a1a1a] border-gray-700 p-3 flex items-center gap-2">
        <Cloud className="h-5 w-5 text-[#00b8d4]" />
        <span className="text-white font-medium">
          {temperature !== null ? `${temperature}°C` : '...'}
        </span>
      </Card>
    </div>
  );
};

export default WeatherWidget;