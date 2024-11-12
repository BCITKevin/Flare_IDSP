import React from 'react';
import { Cloud } from 'lucide-react';
import { Card } from '@/components/ui/card';
import styles from "./WeatherWidget.module.css"

export const WeatherWidget = ({ temperature }) => {
  return (
    <div className="absolute top-4 left-4 z-10">
      <Card className="bg-[#1a1a1a] border-gray-700 p-3 flex items-center gap-2">
        <Cloud className="h-5 w-5 text-[#00b8d4]" />
        <span className="text-white font-medium">{temperature}°C</span>
      </Card>
    </div>
  );
};