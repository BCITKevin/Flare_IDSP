// src/app/map/page.tsx
'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const WeatherMap = dynamic(
  () => import('@/components/weather-map/WeatherMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center h-[60vh] w-full">
        <Loader2 className="animate-spin h-8 w-8 text-neutral-500" />
      </div>
    )
  }
);

export default function MapPage() {
  return (
    <div className="flex justify-center p-4">
      <WeatherMap />
    </div>
  );
}