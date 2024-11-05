'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
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

const FWI_SCALE = [
  { range: '0-5.2', level: 'Very Low', color: '#126E00' },
  { range: '5.2-11.2', level: 'Low', color: '#FFEB3B' },
  { range: '11.2-21.3', level: 'Moderate', color: '#ED8E3E' },
  { range: '21.3-38.0', level: 'High', color: '#FF0000' },
  { range: '38.0-50.0', level: 'Very High', color: '#890000' },
  { range: '50+', level: 'Extreme', color: '#FF00FB' }
];

const getFWILevel = (fwiValue) => {
  if (fwiValue < 5.2) return { level: 'Very Low', color: '#126E00' };
  if (fwiValue < 11.2) return { level: 'Low', color: '#FFEB3B' };
  if (fwiValue < 21.3) return { level: 'Moderate', color: '#ED8E3E' };
  if (fwiValue < 38.0) return { level: 'High', color: '#FF0000' };
  if (fwiValue < 50.0) return { level: 'Very High', color: '#890000' };
  return { level: 'Extreme', color: '#FF00FB' };
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
      });

      try {
        const google = await loader.load();
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 49.2827, lng: -123.1207 }, // Vancouver coordinates
          zoom: isMobile ? 10 : 11,
          streetViewControl: false,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        googleMapRef.current = map;

        const legendDiv = document.createElement('div');
        legendDiv.className = styles.legend;
        
        const titleElem = document.createElement('h4');
        titleElem.className = styles.legendTitle;
        titleElem.textContent = 'Fire Weather Index';
        legendDiv.appendChild(titleElem);
        
        FWI_SCALE.forEach(({ range, level, color }) => {
          const itemDiv = document.createElement('div');
          itemDiv.className = styles.legendItem;
        
          const colorDiv = document.createElement('div');
          colorDiv.className = styles.legendColor;
          colorDiv.style.background = color;
        
          const textSpan = document.createElement('span');
          textSpan.textContent = `${level}${isMobile ? '' : ` (${range})`}`;
        
          itemDiv.appendChild(colorDiv);
          itemDiv.appendChild(textSpan);
          legendDiv.appendChild(itemDiv);
        });
        
        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legendDiv);

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
    
      const marker = new google.maps.Marker({
        position: { lat, lng: lon },
        map: googleMapRef.current
      });

      marker.addListener('click', () => {
        infowindow.open(googleMapRef.current, marker);
      });

      markerRef.current = marker;
      googleMapRef.current.panTo({ lat, lng: lon });
      googleMapRef.current.setZoom(13);
      infowindow.open(googleMapRef.current, marker);

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