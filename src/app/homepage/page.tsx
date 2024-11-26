
'use client';

import Logo from "../public/images/flare_logo.svg";
import Image from "next/image";
import styles from "./homepage.module.css";
import { CircleHelp, Wind, Bell } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import BottomNavBar from "@/components/BottomNavBar";
import WildfireRisk from "@/components/wildfireRisk/WildfireRisk";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import sendNotification from "@/lib/notification/sendNotification";
import getAllSubscription from "./actions";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/router";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { fetchWeatherData } from "@/utils/fetchWeatherData";

interface NavigatorStandalone extends Navigator {
  standalone?: boolean;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function HomePage() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [cityName, setCityName] = useState<string>("Vancouver");
  const [weatherData, setWeatherData] = useState<any>(null);
  const [fireRisk, setFireRisk] = useState<string | undefined>();
  const [riskColour, setRiskColour] = useState<string | undefined>();
  const [isWildfireRiskVisible, setIsWildfireRiskVisible] = useState(false);

  const handleHelpClick = () => {
    setIsWildfireRiskVisible(true);
  };

  const handlePopupClose = () => {
    setIsWildfireRiskVisible(false);
  };
  
  async function handleNotification() {
    if (Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.error("Notification permission not granted");
        return;
      }
    }
    const msg = "replace this to the proper msg later";

    const clientId = localStorage.getItem("clientId");
    if (clientId) {
      const subData = await getAllSubscription(clientId);
      if (subData) {
        for (const sub of subData) {
          const subscription = JSON.parse(sub.data);
          await sendNotification(msg, subscription);
        }
      }
    }
  }

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      setDeferredPrompt(null);
    }
  };

  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    const isIOSDevice = /iPhone|iPad|iPod/i.test(userAgent);
    setIsIOS(isIOSDevice);

    const isStandaloneMode =
      (window.navigator as NavigatorStandalone).standalone || window.matchMedia("(display-mode: standalone)").matches;
    setIsStandalone(isStandaloneMode);

    const handleBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt as EventListener);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt as EventListener);
    };
  }, []);

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

  useEffect(() => {
    if (weatherData?.current.temp) {
      const temp = weatherData.current.temp.toFixed(0);
      if (temp < 16) {
        setFireRisk("Low");
        setRiskColour("bg-gradient-to-r from-green-800 to-green-500");
      } else if (temp < 25) {
        setFireRisk("Medium");
        setRiskColour("bg-gradient-to-r from-yellow-800 to-yellow-500");
      } else {
        setFireRisk("High");
        setRiskColour("bg-gradient-to-r from-red-800 to-red-500");
      }
    }
  }, [weatherData]);

  return (
    <div>
      <div className="homeLayout">
       {isWildfireRiskVisible && <WildfireRisk onClose={handlePopupClose} />}
        <div className={styles.header}>
          <header className={`flex items-center ${styles.homeIcons}`}>
            <Image src={Logo} alt="Flare logo" className="w-12 h-12 mb-4" />
            <Bell size={32} color="white" />
          </header>
          <h1 className={`font-black ${styles.landingLogo}`}>FLARE</h1>
        </div>
        <div className={`${styles.contentPosition}`}>
          <div className={`grid ${styles.contentContainer}`}>
            <div className={`grid grid-cols-2 gap-4 ${styles.fireRisk} ${riskColour}`}>
              <h2 className={styles.homeHeading}>Wildfire Risk: {fireRisk}</h2>
              <CircleHelp size={24} onClick={handleHelpClick} className="cursor-pointer"/>
            </div>
            <Link href="/map" className={styles.location}>
              <h3>{weatherData ? `${weatherData.cityName}` : "My Location"}</h3>
              {weatherData ? (
                <>
                  <h1>{weatherData.current.temp.toFixed(0)}°C</h1>
                  <div className="flex space-x-6 items-center">
                    <p>{weatherData.current.weather[0].description}</p>
                    <Wind size={32} />
                  </div>
                </>
              ) : (
                <h1>Loading...</h1>
              )}
            </Link>
            <Link href="/safety" className={styles.safety}>
              <h3>Safety</h3>
              <p>Learn how to prepare for a wildfire. Learn the early signs</p>
            </Link>
            <Link href="/news" className={`${styles.news} ${styles.newsItemOne}`}>
              <Carousel
                className="w-full h-full"
                plugins={[
                  Autoplay({
                    delay: 2000,
                  }),
                ]}
              >
                <CarouselContent className={`w-full h-full`}>
                  <CarouselItem className={`w-full h-full`}>
                    <h3>News</h3>
                    <p>
                      Vancouver’s Unique Coastal Climate: A Balance of Rain and Mild Temperatures: mild,
                      wet winters and pleasantly warm summers
                    </p>
                  </CarouselItem>
                  <CarouselItem className={`w-full h-full`}>
                    <h3>News</h3>
                    <p>
                      How Vancouver’s Rain Shapes Urban Life: The city receives around 160 days of rain each
                      year...
                    </p>
                  </CarouselItem>
                  <CarouselItem className={`w-full h-full`}>
                    <h3>News</h3>
                    <p>
                      The Best and Worst Seasons to Visit Vancouver: Weather Insights for Travelers: For those
                      planning a trip...
                    </p>
                  </CarouselItem>
                </CarouselContent>
              </Carousel>
            </Link>
          </div>
        </div>
      </div>
      <BottomNavBar />
    </div>
  );
}
