// src/utils/fetchWeatherData.ts

export interface WeatherData {
    cityName: string;
    current: {
      temp: number;
      humidity: number;
      wind_speed: number;
      weather: { description: string }[];
    };
  }
  
  export const fetchWeatherData = async (cityName: string): Promise<WeatherData> => {
    try {
      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
      );
      const geoData = await geoResponse.json();
  
      if (geoData.length === 0) {
        throw new Error("Location not found");
      }
  
      const { lat, lon, name } = geoData[0];
  
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=metric`
      );
      const weatherData = await weatherResponse.json();
      
      return { cityName: name, ...weatherData };
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw error;
    }
  };
  