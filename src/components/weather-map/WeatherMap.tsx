'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { WeatherWidget } from './WeatherWidget';
import { Legend } from './Legend';
import { createRoot } from 'react-dom/client';
import { Card } from '@/components/ui/card';
import { Loader } from '@googlemaps/js-api-loader';
import styles from './WeatherMap.module.css';
import CitySearch from './CitySearch';



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

   // Mock data for Vernon
   if (lat === 50.2671 && lon === -119.2720) {
    return {
      current: {
        temp: 37.8,
        feels_like: 40.2,
        humidity: 12,
        wind_speed: 35.5,
        uvi: 9.8
      },
      daily: Array(7).fill(null).map((_, i) => ({
        dt: Math.floor(Date.now() / 1000) + i * 86400,
        temp: {
          max: 36.5 - i * 0.5,
        },
      })),
      alerts: [
        {
          event: "Extreme Fire Risk Warning",
          description: "Dangerous fire conditions. High temperatures, low humidity, and strong winds creating extreme fire risk.",
          start: Math.floor(Date.now() / 1000),
          end: Math.floor(Date.now() / 1000) + 172800
        }
      ],
      fwi: 45.2,
      danger_rating: "Very High",
      daily_fwi: [
        { fwi: 45.2, danger_rating: "Very High" },
        { fwi: 43.8, danger_rating: "Very High" },
        { fwi: 42.5, danger_rating: "Very High" },
        { fwi: 40.1, danger_rating: "Very High" },
        { fwi: 38.7, danger_rating: "Very High" }
      ]
    };
  }

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
    const daily_fwi: Array<{ fwi: number; danger_rating: string }> = [];
    for (let i = 0; i < 5; i++) {
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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    if (error) {
      console.error(error);
    }
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
          center: { lat: 49.2827, lng: -123.1207 },
          zoom: isMobile ? 11 : 12,
          streetViewControl: false,
          mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
          mapTypeControl: false,
          fullscreenControl: false,
          zoomControl: true,
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM,
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
            }
          ]
        });

        googleMapRef.current = map;

        // Create Search Container
        const searchContainer = document.createElement('div');
        searchContainer.className = styles.searchContainer;
        const searchRoot = createRoot(searchContainer);
        searchRoot.render(
          <div className={styles.searchForm}>
            <CitySearch
              onCitySelect={async (city) => {
                setLoading(true);
                setError('');
                try {
                  const weatherData = await fetchWeatherData(city.lat, city.lon);

                  if (markerRef.current) {
                    markerRef.current.map = null;
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
      <div style="padding: 30px; width: 280px; max-width: 90vw; background-color: #000000; color: #ffffff;"
      class="min-h-full">
        <h3 style="font-size: 24px; font-weight: bold; margin-bottom: 16px; color: #ffffff;">${city.label}</h3>
        
        <!-- Current Conditions -->
        <div style="margin-bottom: 16px;">
          <div style="background-color: ${fwiInfo.color}; color: ${fwiInfo.textColor};
            padding: 4px 8px; border-radius: 4px; display: inline-block; margin-bottom: 8px;">
            Current Fire Danger: ${weatherData.danger_rating}
          </div>
          <div style="color: #ffffff;">Current FWI Value: ${weatherData.fwi.toFixed(1)}</div>
        </div>
                          
                          <!-- Current Weather Details -->
<!-- Current Weather Details -->
        <div style="background-color: #000000; color: #ffffff; padding-top: 1rem; border-radius: 0.375rem; margin-bottom: 1rem; display: flex; flex-direction: column; width: 100%; justify-content: center;">
          <div style="display: flex; justify-content: space-between; padding: 0.25rem 0; border-bottom: 1px solid #374151;">
            <div style="display: flex; align-items: center;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.5rem">
                <path d="M12 2a5 5 0 1 1-5 5v10a5 5 0 1 1 0-10V7a5 5 0 0 1 5-5Z"/>
              </svg>
              Temperature:
            </div>

      
            <span>${weatherData.current.temp.toFixed(1)}°C</span>
          </div>
                            <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #374151;">
                              <div style="display: flex; align-items: center;">
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
          <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #374151;">
            <div style="display: flex; align-items: center;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.5rem">
                <path d="M2 12h20"/>
                <path d="M2 17h20"/>
                <path d="M2 7h20"/>
              </svg>
              Humidity:

            </div>
            <span>${weatherData.current.humidity}%</span>
          </div>
            <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #374151;">
            <div style="display: flex; align-items: center;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.5rem">
                <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/>
                <path d="M9.6 4.6A2 2 0 1 1 11 8H2"/>
                <path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>
              </svg>
              Wind:
            </div>
            <span>${(weatherData.current.wind_speed * 3.6).toFixed(1)} km/h</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 0.25rem 0; border-bottom: 1px solid #374151;">
            <div style="display: flex; align-items: center;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.5rem">
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
        </div>
                    
                          <!-- 5-Day Forecast -->
                           <div style="margin-top: 1.5rem;">
          <h4 style="font-size: 16px; font-weight: bold; margin-bottom: 1rem; color: #ffffff;">5-Day Forecast of Risk</h4>
<div style="display: flex; flex-direction: column; gap: 8px;">
  ${weatherData.daily.slice(0, 5).map((day, index) => {
                      const dayFWI = weatherData.daily_fwi[index].fwi;
                      const dayFWIInfo = getFWILevel(dayFWI);
                      return `
      <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px solid #374151;
      ">
        <!-- Day of the Week -->
        <div style="display: flex; align-items: center; width: 40%; font-weight: bold;">
          ${new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
        </div>
        
        <!-- Max Temperature -->
        <div style="display: flex; align-items: center; width: 30%; justify-content: center;">
          ${day.temp.max.toFixed(1)}°C
        </div>
        
        <!-- FWI Level -->
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: ${dayFWIInfo.color}; 
          color: ${dayFWIInfo.textColor};
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          width: 30%;
          white-space: nowrap;
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

                    // backgroundColor: '#000000',
                    minWidth: 300,
                    maxWidth: 350,
                    zIndex: 1000,

                  });
                  const markerElement = new google.maps.marker.AdvancedMarkerElement({
                    map: googleMapRef.current,
                    position: { lat: city.lat, lng: city.lon },
                    title: city.label,
                    content: pinElement.element
                  });

                  markerElement.addListener('click', () => {
                    infoTab.open({
                      anchor: markerElement,
                      map: googleMapRef.current
                    });
                  });

                  google.maps.event.addListener(infoTab, 'domready', () => {
                    // Locate the InfoWindow container
                    const infoWindowContainer = document.querySelector('.gm-style-iw');
                    console.log('InfoWindow Container:', infoWindowContainer); // Debugging: Ensure the element exists

                    if (infoWindowContainer) {
                      // Hide the default close button
                      const closeButton = document.querySelector('.gm-ui-hover-effect') as HTMLElement;
                      if (closeButton) {
                        closeButton.style.display = 'none'; // Hide the default close button
                      }
                    }
                  });

                  google.maps.event.addListener(googleMapRef.current!, 'click', () => {
                    infoTab.close();
                  });



                  markerRef.current = markerElement;
                  googleMapRef.current?.panTo({ lat: city.lat, lng: city.lon });
                  googleMapRef.current?.setZoom(13);
                  infoTab.open({
                    anchor: markerElement,
                    map: googleMapRef.current
                  });

                } catch (err) {
                  console.error('Error:', err);
                  if (err instanceof Error) {
                    setError(err.message || 'Failed to fetch weather data');
                  } else {
                    setError('Failed to fetch weather data');
                  }
                } finally {
                  setLoading(false);
                }
              }}
            />
            {loading && (
              <div className="ml-2">
                <Loader2 className="animate-spin text-white" size={20} />
              </div>
            )}
          </div>
        );
        map.controls[google.maps.ControlPosition.LEFT_TOP].push(searchContainer);


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



  return (
    <Card className={styles.mapContainer}>
      <div ref={mapRef} className={styles.mapWrapper} />
    </Card>
  );
}
export default WeatherMap;
