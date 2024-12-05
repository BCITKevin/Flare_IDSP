"use client";

import Logo from "../public/images/flare_logo.svg";
import Image from "next/image";
import styles from "./homepage.module.css";
import { CircleHelp, Wind, Bell, Loader2 } from "lucide-react"; // Import the loading spinner
import Link from "next/link";
import { useEffect, useState } from "react";
import sendNotification, {
  fetchSubscription,
  deleteTokenFromServer,
} from "@/lib/notification/sendNotification";
import { fetchWeatherData } from "@/utils/fetchWeatherData";
import { messaging, getToken } from "../../lib/firebase";
import { isSupported, deleteToken } from "firebase/messaging";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import WildfireRisk from "@/components/wildfireRisk/WildfireRisk";
import BottomNavBar from "@/components/BottomNavBar/BottomNavBar";
import TextLogo from "../public/images/FLARE.svg";
import NotificationBell from "@/components/ui/NotificationBell/NotificationBell";
import NotificationMessage from "@/components/NotificationMessage/NotificationMessage";
import { demoArticles } from "@/data/demoArticles";
import { useRouter } from "next/navigation";

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
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [cityName, setCityName] = useState<string>("Vancouver");
  const [weatherData, setWeatherData] = useState<any>(null);
  const [fireRisk, setFireRisk] = useState<string | undefined>();
  const [riskColour, setRiskColour] = useState<string | undefined>();
  const [isWildfireRiskVisible, setIsWildfireRiskVisible] = useState(false);
  const [notify, setNotify] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();


  const toggleWildfireRisk = () => {
    setIsWildfireRiskVisible(!isWildfireRiskVisible);
  };

  function clearNotifications() {
    setNotify(false);
    setNotifyMessage(!notifyMessage);
  }

  async function handleNotification() {
    setNotify(true);
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
      (window.navigator as NavigatorStandalone).standalone ||
      window.matchMedia("(display-mode: standalone)").matches;
    setIsStandalone(isStandaloneMode);

    const handleBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setIsInstallable(true);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as EventListener
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as EventListener
      );
    };
  }, []);

  useEffect(() => {
    const loadWeatherData = async () => {
      try {
        const data = await fetchWeatherData(cityName);
        setWeatherData(data);
        setLoading(false); // Set loading to false after data is fetched
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

  const handleArticleClick = (article: any) => {
    const formattedContent = article.content.paragraphs
      .map((paragraph: string) => {
        const trimmedParagraph = paragraph.trim();

        if (trimmedParagraph.startsWith('"') || trimmedParagraph.startsWith('"')) {
          return `"${trimmedParagraph.replace(/^[""]|[""]$/g, '')}"\n`;
        }

        return `${trimmedParagraph}\n`;
      })
      .join("\n");

    const articleData = {
      title: article.title,
      content: formattedContent,
      date: article.date,
      author: article.author,
      image: article.image,
      source: article.publisher || article.puplisher,
      imageDescription: article.imageDescription || "",
    };

    localStorage.setItem("articleData", JSON.stringify(articleData));
    router.push("/demoArticle");
  };

  return (
    <>
      <div>
        {isWildfireRiskVisible && (
          <div className={`${styles.wildFireRisk}`}>
            <WildfireRisk onClose={toggleWildfireRisk} />
          </div>
        )}
        <div className="homeLayout">
          <div className={styles.header}>
            <header className={`flex items-center ${styles.homeIcons}`}>
              <Image src={Logo} alt="Flare logo" className="w-12" />
              <Image src={TextLogo} alt="Flare logo" className="w-26" />
              <div className={`${styles.notification}`}>
                <NotificationBell
                  clearNotifications={clearNotifications}
                  handleNotification={handleNotification}
                  notify={notify}
                />
                {notifyMessage && <NotificationMessage />}
              </div>
            </header>
          </div>

          <div className={`${styles.contentPosition}`}>
            <div className={`grid ${styles.contentContainer}`}>
              <div
                className={`grid grid-cols-2 gap-4 ${styles.fireRisk} ${riskColour}`}
              >
                <h3 className={styles.homeHeading}>
                  Wildfire Risk: <span className="font-bold">{fireRisk}</span>
                </h3>
                <div onClick={toggleWildfireRisk} className="cursor-pointer">
                  <CircleHelp size={24} />
                </div>
              </div>

              <Link href="/map" className={styles.location}>
                <h5>
                  {weatherData ? `${weatherData.cityName}` : <p>My Location</p>}
                </h5>
                {loading ? (
                  <div className="flex justify-center items-center h-24"> {/* Center the spinner */}
                    <Loader2 className="animate-spin text-white" size={48} /> {/* White loading spinner */}
                  </div>
                ) : (
                  <>
                    <h1>{weatherData.current.temp.toFixed(0)}°C</h1>
                    <div className="flex space-x-6 items-center">
                      <p className="leading-5">
                        {weatherData.current.weather[0].description}
                      </p>
                      <Wind size={48} />
                    </div>
                  </>
                )}
              </Link>

              <Link href="/safety" className={styles.safety}>
                <h3>Safety</h3>
                <p className="h-full flex items-center leading-5">
                  Learn how to prepare for a wildfire. Learn the early signs
                </p>
              </Link>

              <div className={`${styles.news}`}>
                <Carousel
                  className={`w-full h-full ${styles.carouselContainer}`}
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  plugins={[
                    Autoplay({
                      delay: 3000,
                      stopOnInteraction: false,
                    }),
                  ]}
                >
                  <CarouselContent>
                    {demoArticles.LocalArticles.slice(0, 3).map((article, index) => (
                      <CarouselItem
                        key={index}
                        onClick={() => handleArticleClick(article)}
                      >
                        <div className={`${styles.newsContainer} relative cursor-pointer`}>
                          <span className={styles.gradient}></span>
                          <Image
                            src={article.image}
                            alt={article.imageDescription || article.title}
                            fill
                            priority={index === 0}
                            className={`${styles.newsImage}`}
                          />
                          <div>
                            <div className="absolute p-4 z-10">
                              <h3 className="font-bold">
                                News
                              </h3>
                              <p>
                                {article.title}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>
            </div>
          </div>
          <button
            onClick={() => handleNotification()}
            style={{
              width: "100px",
              height: "50px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          ></button>
        </div>
        <BottomNavBar />
      </div>
    </>
  );
}