'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, Info, Cloud } from 'lucide-react';
import { WeatherWidget } from './WeatherWidget';
import { MapLegend } from './Legend';
import { createRoot } from 'react-dom/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Image from 'next/image';
import { Loader } from '@googlemaps/js-api-loader';
import styles from './WeatherMap.module.css';


const getFWILevel = (fwiValue) => {
  if (fwiValue < 5.2) return { class: 0, level: 'Very Low', color: '#126E00' };
  if (fwiValue < 11.2) return { class: 1, level: 'Low', color: '#FFEB3B' };
  if (fwiValue < 21.3) return { class: 2, level: 'Moderate', color: '#ED8E3E' };
  if (fwiValue < 38.0) return { class: 3, level: 'High', color: '#FF0000' };
  if (fwiValue < 50.0) return { class: 4, level: 'Very High', color: '#890000' };
  return { class: 5, level: 'Extreme', color: '#4A0404' };
};

const fetchWeatherData = async (lat, lon, date) => {
  const timestamp = Math.floor(date.getTime() / 1000);
  
  try {
    // Fetch regular weather data
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=metric`
    );
    const weatherData = await weatherResponse.json();

    // Fetch FWI data
    const fwiResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/fwi?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
    );
    const fwiData = await fwiResponse.json();

    return {
      ...weatherData,
      fwi: fwiData.fwi || 0
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

const WeatherMap = () => {
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const markerRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weatherOverlay, setWeatherOverlay] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const initializeMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        version: 'weekly',
        libraries: ['marker']
      });
    
      try {
        const google = await loader.load();
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 54.5, lng: -125.5 }, // Center of BC
          zoom: isMobile ? 5 : 6,
          streetViewControl: false,
          mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
          mapTypeControl: false, // Remove map type control completely
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            },
            {
              featureType: 'transit',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#b3d1ff' }]
            },
            {
              featureType: 'landscape',
              elementType: 'geometry',
              stylers: [{ color: '#f5f5f5' }]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{ color: '#ffffff' }]
            },
            {
              featureType: 'road',
              elementType: 'labels',
              stylers: [{ visibility: 'on' }]
            },
            {
              featureType: 'administrative',
              elementType: 'geometry',
              stylers: [{ visibility: 'off' }]
            },
            {
              featureType: 'administrative.province',
              elementType: 'geometry',
              stylers: [{ visibility: 'on' }]
            }
          ]
        });
    
        googleMapRef.current = map;
    
        // Create Legend Container
        const legendContainer = document.createElement('div');
        const legendRoot = createRoot(legendContainer);
        legendRoot.render(
          <MapLegend 
            show={showLegend} 
            onToggle={() => setShowLegend(!showLegend)} 
          />
        );
        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legendContainer);
    
        // Create Weather Widget Container
        const weatherContainer = document.createElement('div');
        const weatherRoot = createRoot(weatherContainer);
        weatherRoot.render(
          <WeatherWidget temperature={26} />
        );
        map.controls[google.maps.ControlPosition.LEFT_TOP].push(weatherContainer);
    
        // Add the weather overlay
        const timestamp = Math.floor(selectedDate.getTime() / 1000);
        const weatherMapUrl = `https://maps.openweathermap.org/maps/2.0/fwi/{z}/{x}/{y}?appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&date=${timestamp}`;
        
        const newOverlay = new google.maps.ImageMapType({
          getTileUrl: function(coord, zoom) {
            return weatherMapUrl
              .replace('{z}', zoom)
              .replace('{x}', coord.x)
              .replace('{y}', coord.y);
          },
          tileSize: new google.maps.Size(256, 256),
          opacity: 0.7
        });
    
        map.overlayMapTypes.push(newOverlay);
        setWeatherOverlay(newOverlay);
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        setError('Failed to load map');
      }
    };
    if (typeof window !== 'undefined' && !googleMapRef.current) {
      initializeMap();
    }
  }, [isMobile, selectedDate]);

  useEffect(() => {
    if (googleMapRef.current && weatherOverlay) {
      const timestamp = Math.floor(selectedDate.getTime() / 1000);
      const weatherMapUrl = `https://maps.openweathermap.org/maps/2.0/fwi/{z}/{x}/{y}?appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&date=${timestamp}`;
      
      const newOverlay = new google.maps.ImageMapType({
        getTileUrl: function(coord, zoom) {
          return weatherMapUrl
            .replace('{z}', zoom)
            .replace('{x}', coord.x)
            .replace('{y}', coord.y);
        },
        tileSize: new google.maps.Size(256, 256),
        opacity: 0.7
      });

      googleMapRef.current.overlayMapTypes.clear();
      googleMapRef.current.overlayMapTypes.push(newOverlay);
      setWeatherOverlay(newOverlay);
    }
  }, [selectedDate]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${searchQuery},CA&limit=1&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
      );
      const data = await response.json();

      if (!data.length) throw new Error('Location not found');

      const { lat, lon, name } = data[0];
      const weatherData = await fetchWeatherData(lat, lon, selectedDate);

      if (markerRef.current) {
        markerRef.current.setMap(null);
      }

      const { level, color } = getFWILevel(weatherData.fwi);

      const pin = new google.maps.marker.PinElement({
        background: color,
        scale: 1.2,
        borderColor: color === '#FFEB3B' ? '#000000' : color, // Black border for yellow pin
        glyphColor: color === '#FFEB3B' ? '#000000' : '#FFFFFF' // Black glyph for yellow pin
      });
  

      const infowindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 16px;">
            <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 8px;">${name}</h3>
            <div style="margin-bottom: 12px;">
              <div style="background-color: ${color}; color: ${color === '#FFEB3B' ? 'black' : 'white'};
                padding: 4px 8px; border-radius: 4px; display: inline-block; margin-bottom: 8px;">
                Fire Danger: ${level}
              </div>
              <div>FWI Value: ${weatherData.fwi.toFixed(1)}</div>
            </div>
            <div style="display: grid; gap: 4px; font-size: 14px;">
              <div>Temperature: ${weatherData.current.temp.toFixed(1)}°C</div>
              <div>Feels Like: ${weatherData.current.feels_like.toFixed(1)}°C</div>
              <div>Humidity: ${weatherData.current.humidity}%</div>
              <div>Wind: ${(weatherData.current.wind_speed * 3.6).toFixed(1)} km/h</div>
              <div>UV Index: ${weatherData.current.uvi}</div>
              <div>Weather: ${weatherData.current.weather[0].description}</div>
              ${weatherData.alerts && weatherData.alerts.length > 0 ? weatherData.alerts.map(alert => `
                <div style="margin-top: 8px; padding: 8px; background-color: #FEE2E2; border: 1px solid #DC2626; border-radius: 4px;">
                  <strong style="color: #DC2626;">${alert.event}</strong>
                  <div style="font-size: 12px; margin-top: 4px;">
                    ${alert.description ? 
                      alert.description.split('\n')[0] : // Just take the first line of description if it's too long
                      'No additional details available'
                    }
                  </div>
                  <div style="font-size: 11px; color: #666; margin-top: 4px;">
                    ${new Date(alert.start * 1000).toLocaleString()} - 
                    ${new Date(alert.end * 1000).toLocaleString()}
                  </div>
                </div>
              `).join('') : ''}
            </div>
          </div>
        `
      });
    
      const markerElement = new google.maps.marker.AdvancedMarkerElement({
        map: googleMapRef.current,
        position: { lat, lng: lon },
        title: name
      });
  
      markerElement.addListener('click', () => {
        infowindow.open({
          anchor: markerElement,
          map: googleMapRef.current
        });
      });
  
      markerRef.current = markerElement;
      googleMapRef.current.panTo({ lat, lng: lon });
      googleMapRef.current.setZoom(13);
      infowindow.open({
        anchor: markerElement,
        map: googleMapRef.current
      });
  
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Failed to fetch location data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={styles.mapContainer}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Image 
            src="/icons/Weather.png" 
            alt="Weather Icon" 
            width={24} 
            height={24} 
            priority={true}
            style={{ width: '24px', height: '24px' }}
          />
          Vancouver Weather Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={styles.searchContainer}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search locations in Vancouver..."
              className={styles.searchInput}
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="ml-2">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate.toLocaleDateString()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-[1000]">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button type="submit" disabled={loading || !searchQuery} className="ml-2">
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Search'}
            </Button>
          </form>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div ref={mapRef} className={styles.mapWrapper} />
      </CardContent>
    </Card>
  );
};

export default WeatherMap;