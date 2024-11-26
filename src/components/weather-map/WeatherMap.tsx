'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, Info, Cloud, Thermometer, SunSnow, Waves, Wind, Sun  } from 'lucide-react';
import { WeatherWidget } from './WeatherWidget';
import { Legend } from './Legend';
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



// Define the structure of FWI level info
type FWIInfo = {
  class: number;
  level: string;
  color: string;
  textColor: string;
};

// Define the structure of fetched weather data
interface WeatherData {
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    uvi: number;
  };
  alerts?: Array<{
    event: string;
    description: string;
    start: number;
    end: number;
  }>;
  daily: Array<{
    dt: number;
    temp: {
      max: number;
    };
  }>;
  fwi: number;
  danger_rating: string;
  daily_fwi: Array<{
    fwi: number;
    danger_rating: string;
  }>;
}

const getFWILevel = (fwiValue: number | null | undefined): FWIInfo => {
  if (fwiValue === null || fwiValue === undefined || isNaN(fwiValue)) {
    return { class: -1, level: 'Unknown', color: '#808080', textColor: 'white' };
  }
  if (fwiValue < 5.2) return { class: 0, level: 'Very Low', color: '#126E00', textColor: 'white' };
  if (fwiValue < 11.2) return { class: 1, level: 'Low', color: '#FFEB3B', textColor: 'white' };
  if (fwiValue < 21.3) return { class: 2, level: 'Moderate', color: '#ED8E3E', textColor: 'white' };
  if (fwiValue < 38.0) return { class: 3, level: 'High', color: '#FF0000', textColor: 'white' };
  if (fwiValue < 50.0) return { class: 4, level: 'Very High', color: '#890000', textColor: 'white' };
  return { class: 5, level: 'Extreme', color: '#4A0404', textColor: 'white' };
};

const fetchWeatherData = async (lat: number, lon: number): Promise<WeatherData> => {

  try {
    // Fetch regular weather data
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=metric`
    );
    const weatherData = await weatherResponse.json();

    // Fetch current FWI data
    const fwiResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/fwi?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
    );
    const fwiData = await fwiResponse.json();

    // Get current FWI value
    const currentFWI = fwiData?.list?.[0]?.main?.fwi || 0;
    const currentDangerRating = fwiData?.list?.[0]?.danger_rating?.description || 'Unknown';

    // Get next 5 days timestamps
    const daily_fwi: Array<{fwi: number; danger_rating: string }> = [];
    for(let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const timestamp = Math.floor(date.getTime() / 1000);

      try {
        const dayFwiResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/fwi?lat=${lat}&lon=${lon}&dt=${timestamp}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
        );
        const dayFwiData = await dayFwiResponse.json();
        
        daily_fwi.push({
          fwi: dayFwiData?.list?.[0]?.main?.fwi || currentFWI,
          danger_rating: dayFwiData?.list?.[0]?.danger_rating?.description || currentDangerRating
        });
      } catch (error) {
        console.error(`Error fetching FWI for day ${i}:`, error);
        // Fallback to current FWI if request fails
        daily_fwi.push({
          fwi: currentFWI,
          danger_rating: currentDangerRating
        });
      }
    }

    console.log('Current FWI:', currentFWI);
    console.log('Daily FWI:', daily_fwi);

    return {
      ...weatherData,
      fwi: currentFWI,
      danger_rating: currentDangerRating,
      daily_fwi
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};
const WeatherMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Your existing map initialization useEffect remains the same
  useEffect(() => {
    const initializeMap = async () => {
      if (!mapRef.current) return;

      const loader = new Loader({

        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        version: 'weekly',
        libraries: ['marker']
      });

      try {
        const google = await loader.load();
        const map = new google.maps.Map(mapRef.current as HTMLDivElement, {
          center: { lat: 49.2827, lng: -123.1207 }, // Vancouver center
          zoom: isMobile ? 11 : 12,
          streetViewControl: false,
          mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
          mapTypeControl: false,
          zoomControl: true,
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM
          },
          clickableIcons: false,
          styles: [
            {
              "elementType": "geometry",
              "stylers": [{ "color": "#242f3e" }]
            },
        
            
            {
              "featureType": "water",
              "elementType": "labels.text.stroke",
              "stylers": [{ "color": "#17263c" }]
            },
          ]
        });

        googleMapRef.current = map;

        // Create Legend Container
        const legendContainer = document.createElement('div');
        const legendRoot = createRoot(legendContainer);
        legendRoot.render(<Legend />);
        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legendContainer);

        // Create Weather Widget Container
        const weatherContainer = document.createElement('div');
        const weatherRoot = createRoot(weatherContainer);
        weatherRoot.render(
          <WeatherWidget temperature={26} />
        );
        map.controls[google.maps.ControlPosition.LEFT_TOP].push(weatherContainer);
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        setError('Failed to load map');
      }
    };

    if (typeof window !== 'undefined' && !googleMapRef.current) {
      initializeMap();
    }
  }, [isMobile]);





  const handleSearch = async (e: React.FormEvent) => {
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
      const weatherData = await fetchWeatherData(lat, lon);

      if (markerRef.current) {
        markerRef.current.setMap = (null);
      }

      const fwiInfo = getFWILevel(weatherData.fwi);

      const pinElement = new google.maps.marker.PinElement({
        background: fwiInfo.color,
        scale: 1.2,
        borderColor: fwiInfo.color === '#FFEB3B' ? '#000000' : fwiInfo.color,
        glyphColor: fwiInfo.color === '#FFEB3B' ? '#000000' : '#FFFFFF'
      });


      const infoTab = new google.maps.InfoWindow({
        content: `
        <style>
          /* Custom scrollbar for info window */
          .gm-style-iw-d::-webkit-scrollbar {
            width: 4px !important;
            height: 4px !important; /* Set height for the horizontal scrollbar */
          }
          .gm-style-iw-d::-webkit-scrollbar-track {
            background: none !important;
          }
          .gm-style-iw-d::-webkit-scrollbar-thumb {
            background: red;
            border-radius: 4px !important;
          }

          /* Custom horizontal scrollbar (bottom scrollbar) */
          .gm-style-iw-d::-webkit-scrollbar-horizontal {
            height: 4px !important;
          }

          .gm-style-iw-d::-webkit-scrollbar-thumb:horizontal {
            background: red;
            border-radius: 4px !important;
          }
        </style>
        <div style="padding: 10px; width: 310px; max-width: 90vw; background-color: #000000; color: #ffffff;"
        class="min-h-full">
          <h3 style="font-size: 24px; font-weight: bold; margin-bottom: 16px; color: #ffffff;">${name}</h3>
            <!-- Current Conditions -->
            <div style="margin-bottom: 16px;">
              <div style="background-color: ${fwiInfo.color}; color: ${fwiInfo.textColor};
                padding: 4px 8px; border-radius: 4px; display: inline-block; margin-bottom: 8px;">
                Current Fire Danger: ${weatherData.danger_rating}
              </div>
              <div style="color: #ffffff;">Current FWI Value: ${weatherData.fwi.toFixed(1)}</div>
            </div>
       </div>
            
            <!-- Current Weather Details -->
            <div class="bg-black text-white pt-4 rounded-md mb-4 divide-y divide-gray-700 flex flex-col w-9/12 justify-center">
              <div class="flex justify-between py-1">
                <div class="flex">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  class="mr-2"
                  >
                    <path d="M12 2a5 5 0 1 1-5 5v10a5 5 0 1 1 0-10V7a5 5 0 0 1 5-5Z"/>
                  </svg>
                  Temperature:
                </div>
                <span>${weatherData.current.temp.toFixed(1)}°C</span>
              </div>
              <div class="flex justify-between py-1">
                <div class="flex">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  class="mr-2"
                  >
                    <path d="M12 8a4 4 0 1 1-8 0a4 4 0 0 1 8 0Z"/>
                    <path d="M8 2v2"/>
                    <path d="M8 12v2"/>
                    <path d="M2 8h2"/>
                    <path d="M12 8h2"/>
                    <path d="m3.5 3.5 1.5 1.5"/>
                    <path d="m11 11 1.5 1.5"/>
                    <path d="m3.5 12.5 1.5-1.5"/>
                    <path d="m11 5 1.5-1.5"/>
                    <path d="M16 12v10"/>
                    <path d="M20 12v10"/>
                    <path d="M16 18h4"/>
                  </svg>
                  Feels Like:
                </div>
                <span>${weatherData.current.feels_like.toFixed(1)}°C</span>
              </div>
              <div class="flex justify-between py-1">
                <div class="flex">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  class="mr-2"
                  >
                    <path d="M2 12h20"/>
                    <path d="M2 17h20"/>
                    <path d="M2 7h20"/>
                  </svg>
                  Humidity:
                </div>
                <span>${weatherData.current.humidity}%</span>
              </div>
              <div class="flex justify-between py-1">
                <div class="flex">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  class="mr-2"
                  >
                    <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/>
                    <path d="M9.6 4.6A2 2 0 1 1 11 8H2"/>
                    <path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>
                  </svg>
                  Wind:
                </div>
                <span>${(weatherData.current.wind_speed * 3.6).toFixed(1)} km/h</span>
              </div>
              <div class="flex justify-between py-1">
                <div class="flex">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  class="mr-2"
                  >
                    <circle cx="12" cy="12" r="4"/>
                    <path d="M12 2v2"/>
                    <path d="M12 20v2"/>
                    <path d="m4.93 4.93 1.41 1.41"/>
                    <path d="m17.66 17.66 1.41 1.41"/>
                    <path d="M2 12h2"/>
                    <path d="M20 12h2"/>
                    <path d="m6.34 17.66-1.41 1.41"/>
                    <path d="m19.07 4.93-1.41 1.41"/>
                  </svg>
                  UV Index:

                </div>
                <span>${weatherData.current.uvi}</span>
              </div>
      
            <!-- 5-Day Forecast -->
            <div style="margin-top: 16px;">
              <h4 style="font-size: 16px; font-weight: bold; margin-bottom: 8px; color: #ffffff;">5-Day Forecast of Risk</h4>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                ${weatherData.daily.slice(0, 5).map((day, index) => {
                  const dayFWI = weatherData.daily_fwi[index].fwi;
                  const dayFWIInfo = getFWILevel(dayFWI);
                  return `
                    <div style="
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      padding: 8px;
                      color: #ffffff;
                      font-size: 14px;
                    ">
                      <div style="font-weight: bold; min-width: 60px;">
                        ${new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div style="margin: 0 12px;">
                        ${day.temp.max.toFixed(1)}°C
                      </div>
                      <div style="
                        background-color: ${dayFWIInfo.color}; 
                        color: ${dayFWIInfo.textColor};
                        padding: 4px 8px; 
                        border-radius: 4px; 
                        font-size: 12px;
                        margin-left: auto;
                      ">
                        ${weatherData.daily_fwi[index].danger_rating}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
      
            <!-- Weather Alerts -->
            ${weatherData.alerts && weatherData.alerts.length > 0 ? 
              `<div style="margin-top: 16px;">
                <h4 style="font-size: 16px; font-weight: bold; margin-bottom: 8px; color: #ffffff;">Weather Alerts</h4>
                ${weatherData.alerts.map(alert => `
                  <div style="margin-top: 8px; padding: 8px; background-color: #2a2a2a; border: 1px solid #DC2626; border-radius: 4px;">
                    <strong style="color: #DC2626;">${alert.event}</strong>
                    <div style="font-size: 12px; margin-top: 4px; color: #ffffff;">
                      ${alert.description ? 
                        alert.description.split('\n')[0] : 
                        'No additional details available'
                      }
                    </div>
                    <div style="font-size: 11px; color: #888888; margin-top: 4px;">
                      ${new Date(alert.start * 1000).toLocaleString()} - 
                      ${new Date(alert.end * 1000).toLocaleString()}
                    </div>
                  </div>
                `).join('')}
              </div>`
              : ''
            }
          </div>
        `,
        options: {
          backgroundColor: '#000000',
          borderRadius: '8px',
          minWidth: 300,
          maxWidth: 350,
        }
      });

      const style = document.createElement('style');
style.textContent = `
  .gm-style-iw {
    background-color: #000000 !important;
    padding: 0 !important;
  }
  .gm-style-iw-d {
    overflow: auto !important;
    background-color: #000000 !important;
  }
  /* Close button container */
  .gm-style-iw > button {
    background-color: red !important;
    border: none !important;
    padding: 8px !important;
    border-radius: 0 !important;
    opacity: 1 !important;
    top: 0 !important;
    right: 0 !important;
  }
  /* The X image itself */
  .gm-style-iw > button > img {
    background:white;
    filter: invert(1) !important;
    opacity: 1 !important;
    width: 16px !important;
    height: 16px !important;
    margin: 0 !important;
  }
  /* Remove info window shadow */
  .gm-style-iw-t::after {
    display: none;
  }
`;
document.head.appendChild(style);
      const markerElement = new google.maps.marker.AdvancedMarkerElement({
        map: googleMapRef.current,
        position: { lat, lng: lon },
        title: name,
        content: pinElement.element
      });

      markerElement.addListener('click', () => {
        infoTab.open({
          anchor: markerElement,
          map: googleMapRef.current
        });
      });

      markerRef.current = markerElement;
      googleMapRef.current?.panTo({ lat, lng: lon });
      googleMapRef.current?.setZoom(13);
      infoTab.open({
        anchor: markerElement,
        map: googleMapRef.current
      });

    } catch (err) {
      console.error('Error:', err);
      if (err instanceof Error) {
        setError(err.message || 'Failed to fetch location data');
      } else {
        setError('Failed to fetch location data');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={styles.mapContainer}>
      <CardHeader className="flex flex-row items-center justify-between border-b border-gray-800">
        <CardTitle className="flex items-center gap-2 text-white">
          {/* <Cloud className="h-6 w-6" /> */}
          <h2>Wildfire Risk / Weather Map</h2>
        </CardTitle>
      </CardHeader>
      <CardContent className='m-0 p-0 text-white'>
        <h4>Search </h4>
      </CardContent>
      <CardContent className="p-0 pt-1">
        <div className={styles.searchContainer}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter your destination here..."
              className={styles.searchInput}
            />

            <Button 
              type="submit" 
              disabled={loading || !searchQuery} 
              className="bg-[#00b8d4] hover:bg-[#00a0c0] text-white"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                'Search'
              )}
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