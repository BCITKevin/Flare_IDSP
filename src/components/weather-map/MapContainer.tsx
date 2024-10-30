// src/components/weather-map/MapContainer.tsx
'use client';

import { useEffect, useRef } from 'react';

interface MapContainerProps {
  id: string;
  className?: string;
}

const MapContainer = ({ id, className }: MapContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return <div id={id} ref={containerRef} className={className} />;
};

export default MapContainer;