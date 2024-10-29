// src/components/weather-map/WeatherMap.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Search, Loader2, Info } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import styles from './WeatherMap.module.css';

const FWI_SCALE = [
  { range: '0-5.2', level: 'Low', color: '#44BB44' },
  { range: '5.2-11.2', level: 'Moderate', color: '#FFEB3B' },
  { range: '11.2-21.3', level: 'High', color: '#FF9800' },
  { range: '21.3-38.0', level: 'Very High', color: '#FF5722' },
  { range: '38.0+', level: 'Extreme', color: '#B71C1C' }
];

const getFWILevel = (fwiValue: number) => {
    if (fwiValue < 5.2) return { level: 'Low', color: '#44BB44' };
    if (fwiValue < 11.2) return { level: 'Moderate', color: '#FFEB3B' };
    if (fwiValue < 21.3) return { level: 'High', color: '#FF9800' };
    if (fwiValue < 38.0) return { level: 'Very High', color: '#FF5722' };
    return { level: 'Extreme', color: '#B71C1C' };
  };
  
  // Add this function to fetch FWI data
  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=metric`
      );
      const weatherData = await response.json();
      return weatherData;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  };

const WeatherMap = () => {
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [layers, setLayers] = useState<any>({
    fwi: null,
    temperature: null,
    precipitation: null
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && !map) {
      const L = window.L;
      const newMap = L.map('map').setView([49.2827, -123.1207], 11);
      
      // Base map layers
      const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      });

      const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri'
      });

      const topoLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenTopoMap contributors'
      });

      // Weather layers
      const today = new Date().toISOString().split('T')[0];
      
      const fwiLayer = L.tileLayer(
        `https://maps.openweathermap.org/maps/2.0/fwi/{z}/{x}/{y}?appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&date=${today}`,
        {
          opacity: 0.7,
          attribution: '© OpenWeatherMap'
        }
      );

      const temperatureLayer = L.tileLayer(
        `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`,
        {
          opacity: 0.7,
          attribution: '© OpenWeatherMap'
        }
      );

      const precipitationLayer = L.tileLayer(
        `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`,
        {
          opacity: 0.7,
          attribution: '© OpenWeatherMap'
        }
      );

      // Set up layer groups
      const baseMaps = {
        "OpenStreetMap": osmLayer,
        "Satellite": satelliteLayer,
        "Topographic": topoLayer
      };

      const overlayMaps = {
        "Fire Weather Index": fwiLayer,
        "Temperature": temperatureLayer,
        "Precipitation": precipitationLayer
      };

      // Add default layers
      osmLayer.addTo(newMap);
      fwiLayer.addTo(newMap);

      // Add layer control
      L.control.layers(baseMaps, overlayMaps, {
        collapsed: false,
        position: 'topright'
      }).addTo(newMap);

      // Add scale control
      L.control.scale().addTo(newMap);

      // Add legend
      const legend = L.control({ position: isMobile ? 'bottomleft' : 'bottomright' });
      legend.onAdd = () => {
        const div = L.DomUtil.create('div', `${styles.legend}`);
        div.innerHTML = `<h4 class="${styles.legendTitle}">Fire Weather Index</h4>`;
        
        FWI_SCALE.forEach(({ range, level, color }) => {
          div.innerHTML += `
            <div class="${styles.legendItem}">
              <div class="${styles.legendColor}" style="background: ${color}"></div>
              <span>${level} (${range})</span>
            </div>
          `;
        });
        
        return div;
      };
      legend.addTo(newMap);

      // Store references
      setMap(newMap);
      setLayers({
        fwi: fwiLayer,
        temperature: temperatureLayer,
        precipitation: precipitationLayer
      });
    }
    
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    if (layers.fwi && map) {
      // Update FWI layer
      map.removeLayer(layers.fwi);
      const L = window.L;
      const newFwiLayer = L.tileLayer(
        `https://maps.openweathermap.org/maps/2.0/fwi/{z}/{x}/{y}?appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&date=${date}`,
        {
          opacity: 0.7,
          attribution: '© OpenWeatherMap'
        }
      ).addTo(map);
     //@ts-ignore
      setLayers(prev => ({
        ...prev,
        fwi: newFwiLayer
      }));
  
      // Update marker data if exists
      if (marker) {
        const position = marker.getLatLng();
        fetchWeatherData(position.lat, position.lng)
          .then(weatherData => {
            const fwiValue = weatherData.current?.fire_weather_index || 0;
            const { level, color } = getFWILevel(fwiValue);
            
            const popupContent = `
              <div class="p-2">
                <h3 class="text-lg font-bold mb-2">${marker.getPopup().getContent().split('</h3>')[0].split('>').pop()}</h3>
                
                <div class="mb-3">
                  <div style="
                    background-color: ${color};
                    color: ${color === '#FFEB3B' ? 'black' : 'white'};
                    padding: 4px 8px;
                    border-radius: 4px;
                    display: inline-block;
                    margin-bottom: 8px;
                  ">
                    Fire Danger: ${level}
                  </div>
                  <div>FWI Value: ${fwiValue.toFixed(1)}</div>
                </div>
  
                <div class="grid gap-1 text-sm">
                  <div>Temperature: ${weatherData.current.temp.toFixed(1)}°C</div>
                  <div>Humidity: ${weatherData.current.humidity}%</div>
                  <div>Wind: ${(weatherData.current.wind_speed * 3.6).toFixed(1)} km/h</div>
                  <div>Weather: ${weatherData.current.weather[0].description}</div>
                </div>
              </div>
            `;
            
            marker.setPopupContent(popupContent);
          })
          .catch(err => {
            setError('Failed to update location data');
          });
      }
    }
  };

// Update the handleSearch function with correct data access
const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${searchQuery},CA&limit=1&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
      );
      const data = await response.json();
      
      if (!data.length) {
        throw new Error('Location not found');
      }
  
      const { lat, lon, name } = data[0];
      
      // Fetch weather data
      const weatherData = await fetchWeatherData(lat, lon);
      
      // Update marker
      if (marker) {
        map.removeLayer(marker);
      }
      
      const L = window.L;
      const fwiValue = weatherData.current?.fire_weather_index || 0;
      const { level, color } = getFWILevel(fwiValue);
      
      const popupContent = `
        <div class="p-2">
          <h3 class="text-lg font-bold mb-2">${name}</h3>
          
          <div class="mb-3">
            <div style="
              background-color: ${color};
              color: ${color === '#FFEB3B' ? 'black' : 'white'};
              padding: 4px 8px;
              border-radius: 4px;
              display: inline-block;
              margin-bottom: 8px;
            ">
              Fire Danger: ${level}
            </div>
            <div>FWI Value: ${fwiValue.toFixed(1)}</div>
          </div>
  
          <div class="grid gap-1 text-sm">
            <div>Temperature: ${weatherData.current.temp.toFixed(1)}°C</div>
            <div>Humidity: ${weatherData.current.humidity}%</div>
            <div>Wind: ${(weatherData.current.wind_speed * 3.6).toFixed(1)} km/h</div>
            <div>Weather: ${weatherData.current.weather[0].description}</div>
          </div>
        </div>
      `;
      
      const newMarker = L.marker([lat, lon])
        .addTo(map)
        .bindPopup(popupContent, {
          maxWidth: 300,
          className: 'custom-popup'
        })
        .openPopup();
      
      setMarker(newMarker);
      map.setView([lat, lon], 11);
      
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch location data');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card className={styles.mapContainer}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Vancouver Weather Map</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className={styles.searchContainer}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={styles.searchInputWrapper}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search locations in Vancouver..."
                className={styles.searchInput}
              />
              <Search className={styles.searchIcon} size={20} />
            </div>
            <button
              type="submit"
              disabled={loading || !searchQuery}
              className="px-4 py-2 bg-neutral-500 text-white rounded-md hover:bg-neutral-600 disabled:bg-neutral-300"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                'Search'
              )}
            </button>
          </form>
          
          <input
            type="date"
            onChange={handleDateChange}
            defaultValue={new Date().toISOString().split('T')[0]}
            className={styles.dateInput}
          />
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div id="map" className={styles.mapWrapper} />
      </CardContent>
    </Card>
  );
};

export default WeatherMap;