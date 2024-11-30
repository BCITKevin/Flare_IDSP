'use client';

import Logo from "../public/images/flare_logo.svg"
import Image from "next/image";
import styles from "./homepage.module.css";
import { CircleHelp, Wind, Bell } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import sendNotification, { fetchSubscription, deleteTokenFromServer } from "@/lib/notification/sendNotification";
import getAllSubscription from "./actions";
import { fetchWeatherData } from "@/utils/fetchWeatherData";
import { messaging, getToken } from '../../lib/firebase';
import { isSupported, deleteToken } from "firebase/messaging";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"
import WildfireRisk from "@/components/wildfireRisk/WildfireRisk";
import BottomNavBar from "@/components/BottomNavBar/BottomNavBar";
import TextLogo from "../public/images/FLARE.svg";
import NotificationBell from "@/components/ui/NotificationBell/NotificationBell";
import NotificationMessage from "@/components/NotificationMessage/NotificationMessage";


interface NavigatorStandalone extends Navigator {
  standalone?: boolean;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function getOrCreateClientId() {
  if (typeof window !== "undefined") {
    let clientId = localStorage.getItem("clientId");
    if (!clientId) {
      clientId = crypto.randomUUID();
      localStorage.setItem("clientId", clientId);
    }
    return clientId;
  }
  return null;
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
  const [notify, setNotify] = useState(false)
  const [notifyMessage, setNotifyMessage] = useState(false)

  const toggleWildfireRisk = () => {
    setIsWildfireRiskVisible(!isWildfireRiskVisible)
    console.log("Toggle Infograph")
  }


  useEffect(() => {
    const requestPermission = async () => {
      // Notification API와 Service Worker 지원 여부 확인
      if (typeof Notification === "undefined" || typeof navigator.serviceWorker === "undefined") {
        console.error("Notifications or Service Workers are not supported in this browser.");
        return;
      }

      const supported = await isSupported();
      if (!supported) {
        console.error("Firebase Messaging is not supported on this browser.");
        return;
      }

      if (messaging) {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          console.log("Notification permission granted.");
          await getToken(messaging, {
            vapidKey: 'BPXsQYDzZY2XA5zHU_rEawyf2hVSUK0Bb8uhndW9oPlCgtQF5npThPLcCTF5m81rPiDiFu6dJZEYhN3fMbqK23o',
          }).then(async (currentToken) => {
            if (currentToken) {
              console.log("FCM Token:", currentToken);
              const clientId = getOrCreateClientId();
              if (clientId) {
                await fetchSubscription(clientId, currentToken);
                await sendNotification(
                  currentToken,
                  "Agreed notification",
                  "You have agreed notification from Flare",
                  "/homepage",
                );
              }
            } else {
              console.log("No registration token available.");
            }
          }).catch((err) => {
            console.error("An error occurred while retrieving token. ", err);
          });
        } else if (permission === "denied") {
          console.log("Permission denied. Deleting token.");
          const clientId = getOrCreateClientId();
          const currentToken = await getToken(messaging);
          if (currentToken && clientId) {
            await deleteToken(messaging);
            await deleteTokenFromServer(clientId, currentToken);
          }
        }
      }
    };

    if (Notification.permission === "default") {
      requestPermission();
    }
  }, []);

  function clearNotifications() {
    setNotify(false);
    setNotifyMessage(!notifyMessage)
  }

  async function handleNotification() {
    setNotify(true);
    const tokens = await getAllSubscription();

    if (tokens) {
      for (const token of tokens) {
        await sendNotification(
          token.data,
          'New article released',
          'New Article have been released! Go check it!',
          "/news",
        )
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
        setRiskColour("bg-gradient-to-r from-emerald-900 to-emerald-500");
      } else if (temp < 25) {
        setFireRisk("Medium");
        setRiskColour("bg-gradient-to-r from-yellow-900 to-yellow-500");
      } else {
        setFireRisk("High");
        setRiskColour("bg-gradient-to-r from-red-900 to-red-500");
      }
    }
  }, [weatherData]);

  return (
    <>
      <div>
        {isWildfireRiskVisible &&
          <div className={`${styles.wildFireRisk}`}>
            <WildfireRisk onClose={toggleWildfireRisk} />
          </div>
        }
        <div className="homeLayout">
          <div className={styles.header}>
            <header className={`flex items-center ${styles.homeIcons}`}>
              <Image src={Logo} alt="Flare logo" className="w-12" />
              <Image src={TextLogo} alt="Flare logo" className="w-26" />
              <div className={`${styles.notification}`}>
                <NotificationBell clearNotifications={clearNotifications} handleNotification={handleNotification} notify={notify} />
                {notifyMessage && <NotificationMessage />}
              </div>
            </header>
          </div>

          <div className={`${styles.contentPosition}`}>
            <div className={`grid ${styles.contentContainer}`}>
              <div className={`grid grid-cols-2 gap-4 ${styles.fireRisk} ${riskColour}`}>
                <h3 className={styles.homeHeading}>Wildfire Risk: <span className="font-bold">{fireRisk}</span></h3>
                <div onClick={toggleWildfireRisk} className="cursor-pointer" >
                  <CircleHelp size={24} />
                </div>
              </div>

              <Link href="/map" className={styles.location}>
                <h5>{weatherData ? `${weatherData.cityName}` : <p>My Location</p>}</h5>
                {weatherData ? (
                  <>
                    <h1>{weatherData.current.temp.toFixed(0)}°C</h1>
                    <div className="flex space-x-6 items-center">
                      <p className="leading-5">{weatherData.current.weather[0].description}</p>
                      <Wind size={48} />
                    </div>
                  </>
                ) : (
                  <h1>Loading...</h1>
                )}
              </Link>

              <Link href="/safety" className={styles.safety}>
                <h3>Safety</h3>
                <p className="h-full flex items-center leading-5">Learn how to prepare for a wildfire. Learn the early signs</p>
              </Link>

              <Link href="/news" className={`${styles.news} ${styles.newsItemOne}`}>
                <Carousel
                  className="w-full h-full"
                  plugins={[
                    Autoplay({
                      delay: 6000,
                    }),
                  ]}
                >
                  <CarouselContent className={`w-full h-full`}>
                    <CarouselItem className={`w-full h-full`}>
                      <h3>News</h3>
                      <p className="leading-5">
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
        </div >
        <button
          onClick={() => handleNotification()}
          style={{
            width: '100px',
            height: '50px',
            border: 'none',
            cursor: 'pointer',
            position: 'absolute',
            bottom: '250px'
          }}>
        </button>
        <BottomNavBar />
      </div >
    </>
  )
}