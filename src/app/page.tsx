// src/app/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Logo from "../../public/images/logo_Flare.png";
import BottomNavBar from "../components/BottomNavBar";
import Flare from "../../public/images/FLARE.png";
import Bell from "../../public/icons/Bell.png";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

//fake data of news
import articles from "./news/mockData";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  SunCloud,
  Moon,
  CloudBolt,
} from "lucide-react";
//----------------------------------------------
//날ㅆㅣ죵뵤 가Zㅕ Oㅓ는 햠슈
import { fetchWeatherData, WeatherData } from "@/utils/fetchWeatherData";

const getWeatherIcon = (description: string) => {
  const desc = description.toLowerCase();
  if (desc.includes("clear"))
    return <Sun className="w-16 h-16 text-yellow-400" />;
  if (desc.includes("cloud")) {
    if (desc.includes("rain"))
      return <CloudRain className="w-16 h-16 text-blue-400" />;
    if (desc.includes("snow"))
      return <CloudSnow className="w-16 h-16 text-blue-200" />;
    if (desc.includes("thunder"))
      return <CloudBolt className="w-16 h-16 text-yellow-500" />;
    return <Cloud className="w-16 h-16 text-gray-400" />;
  }
  if (desc.includes("moon"))
    return <Moon className="w-16 h-16 text-gray-500" />;
  return <Sun className="w-16 h-16 text-yellow-400" />; // 기본 아이콘
};

const getWeatherBackground = (description: string) => {
  const desc = description.toLowerCase();
  if (desc.includes("clear")) {
    return "from-yellow-400 to-yellow-600";
  }
  if (desc.includes("cloud")) {
    if (desc.includes("rain")) return "from-blue-400 to-blue-600";
    if (desc.includes("snow")) return "from-blue-200 to-blue-400";
    if (desc.includes("thunder")) return "from-purple-600 to-purple-800";
    return "from-gray-400 to-gray-600";
  }
  if (desc.includes("moon")) {
    return "from-gray-700 to-gray-900";
  }
  // 기본 배경색
  return "from-green-400 to-green-600";
};

export default function Home() {
  const router = useRouter();
  const [cityName] = useState("Vancouver");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    const loadWeatherData = async () => {
      try {
        const data = await fetchWeatherData(cityName);
        setWeatherData(data);
      } catch (error) {
        console.error("Failed to load weather data", error);
      }
    };

    loadWeatherData();
  }, [cityName]);
  const [carouselArticles, setCarouselArticles] = useState<typeof articles>([]);
  useEffect(() => {
    const sortedArticles = [...articles].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const selectedArticles = sortedArticles.slice(0, 3);
    setCarouselArticles(selectedArticles);
  }, []);

  const handleCard1Click = () => {
    router.push("/map");
  };

  return (
    <div className="flex flex-col min-h-screen bg-flare-gradient">
      {/* 메인 카드 */}
      <div className="flex flex-col flex-1 w-full max-w-6xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden p-6 pb-16 sm:pb-20 md:pb-24 bg-flare-gradient">
        <header className="flex justify-between items-center mb-6">
          <Image src={Logo} alt="Flare logo" className="w-12 h-12" />
          <button
            className="text-gray-700 hover:text-green-500 p-2"
            aria-label="icon bell"
            type="button"
          >
            <Image src={Bell} alt="Bell icon" className="w-6 h-6" />
          </button>
        </header>
        <main>
          <Image src={Flare} alt="Flare" className="mb-6" />
          <div className="shadow-xl p-10 rounded-sm flex flex-col justify-between bg-flare-gradientlow gap-4 mb-6">
            <h1 className="text-white self-start">
              Wildfire Risk:<b>Low</b>
            </h1>
          </div>
          <section className="grid grid-cols-2 gap-6 w-full max-w-6xl mx-auto">
            <Card
              onClick={handleCard1Click}
              className={`cursor-pointer shadow-2xl rounded-lg bg-gradient-to-r ${
                weatherData
                  ? getWeatherBackground(
                      weatherData.current.weather[0].description
                    )
                  : "from-green-400 to-green-600"
              } border-none flex flex-col justify-center items-center p-6 transition-transform duration-300 ease-in-out transform hover:scale-105`}
            >
              <CardContent className="flex flex-col items-center">
                {/* 날씨 아이콘 */}
                {weatherData &&
                  getWeatherIcon(weatherData.current.weather[0].description)}
                <CardTitle className="text-white text-xl font-semibold mb-2">
                  {weatherData ? `${weatherData.cityName}` : "Loading..."}
                </CardTitle>
                {weatherData ? (
                  <div className="text-white text-center">
                    <p className="text-lg">
                      {weatherData.current.temp.toFixed(1)}°C
                    </p>
                    <p className="text-sm capitalize">
                      {weatherData.current.weather[0].description}
                    </p>
                  </div>
                ) : (
                  <CardDescription className="text-white">
                    Loading...
                  </CardDescription>
                )}
              </CardContent>
            </Card>
            <div className="shadow-2xl rounded-sm bg-fuchsia-800 flex flex-col justify-center items-center row-span-2">
              <Carousel
                className="w-full h-full"
                plugins={[
                  Autoplay({
                    delay: 2000,
                  }),
                ]}
              >
                <CarouselContent className="w-full h-full flex">
                  {carouselArticles.map((article) => (
                    <CarouselItem
                      key={article.id}
                      className="w-full h-full flex justify-center items-center"
                    >
                      <div className="relative w-full h-64 bg-white rounded-lg shadow-md overflow-hidden">
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4">
                          <h2 className="text-xl font-semibold text-white truncate">
                            {article.title}
                          </h2>
                          <p className="text-gray-300 text-sm truncate">
                            {new Date(article.date).toLocaleDateString()}
                          </p>
                          <p className="text-gray-200 text-sm line-clamp-2">
                            {article.description}
                          </p>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
            <Card className="shadow-2xl rounded-sm bg-flare-gradienttr border-none flex flex-col justify-center items-center aspect-square">
              <CardContent>
                <CardTitle className="text-white text-lg font-semibold">
                  Card 3
                </CardTitle>
                <CardDescription className="text-white">
                  This is the third card.
                </CardDescription>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
      <BottomNavBar />
    </div>
  );
}
