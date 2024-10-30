'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, Info } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import styles from './WeatherMap.module.css';

const FWI_SCALE = [
  { range: '0-5.2', level: 'Low', color: '#44BB44' },
  { range: '5.2-11.2', level: 'Moderate', color: '#FFEB3B' },
  { range: '11.2-21.3', level: 'High', color: '#FF9800' },
  { range: '21.3-38.0', level: 'Very High', color: '#FF5722' },
  { range: '38.0+', level: 'Extreme', color: '#B71C1C' }
];

const getFWILevel = (fwiValue) => {
  if (fwiValue < 5.2) return { level: 'Low', color: '#44BB44' };
  if (fwiValue < 11.2) return { level: 'Moderate', color: '#FFEB3B' };
  if (fwiValue < 21.3) return { level: 'High', color: '#FF9800' };
  if (fwiValue < 38.0) return { level: 'Very High', color: '#FF5722' };
  return { level: 'Extreme', color: '#B71C1C' };
};

const fetchWeatherData = async (lat, lon, date) => {
  const formattedDate = date.toISOString().split('T')[0];
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=metric&date=${formattedDate}`
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

const WeatherMap = () => {
  const mapRef = useRef(null);
  const [marker, setMarker] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [layers, setLayers] = useState({
    fwi: null,
    temperature: null,
    precipitation: null
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && mapRef.current === null) {
      const L = window.L;
      const newMap = L.map('map').setView([49.2827, -123.1207], isMobile ? 10 : 11);

      const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      });

      const today = new Date().toISOString().split('T')[0];
      const fwiLayer = L.tileLayer(
        `https://maps.openweathermap.org/maps/2.0/fwi/{z}/{x}/{y}?appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&date=${today}`,
        { opacity: 0.7, attribution: '© OpenWeatherMap' }
      );

      osmLayer.addTo(newMap);
      fwiLayer.addTo(newMap);

      const baseMaps = { "OpenStreetMap": osmLayer };
      const overlayMaps = { "Fire Weather Index": fwiLayer };

      L.control.layers(baseMaps, overlayMaps, { collapsed: isMobile, position: 'topright' }).addTo(newMap);
      L.control.scale({ metric: true, imperial: false }).addTo(newMap);

      const legend = L.control({ position: isMobile ? 'bottomleft' : 'bottomright' });
      legend.onAdd = () => {
        const div = L.DomUtil.create('div', `${styles.legend}`);
        div.innerHTML = `<h4 class="${styles.legendTitle}">Fire Weather Index</h4>`;
        FWI_SCALE.forEach(({ range, level, color }) => {
          div.innerHTML += `
            <div class="${styles.legendItem}">
              <div class="${styles.legendColor}" style="background: ${color}"></div>
              <span>${level}${isMobile ? '' : ` (${range})`}</span>
            </div>
          `;
        });
        return div;
      };
      legend.addTo(newMap);

      mapRef.current = newMap;
      setLayers({ fwi: fwiLayer });

      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    }
  }, [isMobile]);

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

      if (marker) mapRef.current.removeLayer(marker);

      const L = window.L;
      const fwiValue = weatherData.daily[0].fwi || 0;
      const { level, color } = getFWILevel(fwiValue);

      const popupContent = `
        <div class="p-2">
          <h3 class="text-lg font-bold mb-2">${name}</h3>
          <div class="mb-3">
            <div style="background-color: ${color}; color: ${color === '#FFEB3B' ? 'black' : 'white'};
              padding: 4px 8px; border-radius: 4px; display: inline-block; margin-bottom: 8px;">
              Fire Danger: ${level}
            </div>
            <div>FWI Value: ${fwiValue.toFixed(1)}</div>
            <div>Date: ${selectedDate.toLocaleDateString()}</div>
          </div>
          <div class="grid gap-1 text-sm">
            <div>Temperature: ${weatherData.daily[0].temp.day.toFixed(1)}°C</div>
            <div>Humidity: ${weatherData.daily[0].humidity}%</div>
            <div>Wind: ${(weatherData.daily[0].wind_speed * 3.6).toFixed(1)} km/h</div>
            <div>Weather: ${weatherData.daily[0].weather[0].description}</div>
          </div>
        </div>
      `;

      const newMarker = L.marker([lat, lon])
        .addTo(mapRef.current)
        .bindPopup(popupContent, { maxWidth: 300, className: 'custom-popup' })
        .openPopup();

      setMarker(newMarker);
      mapRef.current.setView([lat, lon], 11);

    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Failed to fetch location data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={styles.mapContainer}>
      <CardHeader>
        <CardTitle>Vancouver Weather Map</CardTitle>
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

        <div id="map" className={styles.mapWrapper} />
      </CardContent>
    </Card>
  );
};

export default WeatherMap;