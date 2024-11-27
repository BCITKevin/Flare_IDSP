'use client';


import Logo from "../public/images/flare_logo.svg";
import Image from "next/image";
import styles from "./homepage.module.css";
import { CircleHelp, Wind, Bell } from "lucide-react";
import Link from "next/link";
import BottomNavBar from "@/components/BottomNavBar";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import sendNotification, { fetchSubscription, deleteTokenFromServer } from "@/lib/notification/sendNotification";
import getAllSubscription from "./actions";
import { fetchWeatherData } from "@/utils/fetchWeatherData";
import { messaging, getToken } from '../../lib/firebase';
import { isSupported, deleteToken } from "firebase/messaging";

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

    useEffect(() => {
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
            const requestPermission = async () => {
                if (messaging) {
                    const permission = await Notification.requestPermission();
                    if (permission === 'granted') {
                        console.log('Notification permission granted.');
                        await getToken(messaging, {
                            vapidKey: 'BPXsQYDzZY2XA5zHU_rEawyf2hVSUK0Bb8uhndW9oPlCgtQF5npThPLcCTF5m81rPiDiFu6dJZEYhN3fMbqK23o',
                        }).then(async (currentToken) => {
                            if (currentToken) {
                                console.log('FCM Token:', currentToken);
                                const clientId = getOrCreateClientId();
                                if (clientId) {
                                    await fetchSubscription(clientId, currentToken);
                                    await sendNotification(
                                        clientId,
                                        currentToken,
                                        'Agreed notification',
                                        'You have agreed notification from Flare',
                                        { url: '/homepage' },
                                    )
                                }
                            } else {
                                console.log('No registration token available.');
                            }
                        }).catch((err) => {
                            console.error('An error occurred while retrieving token. ', err);
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
            }
            if (Notification.permission === 'default') {
                requestPermission();
            }
        }
    }, []);

    const handleHelpClick = () => {
        setIsWildfireRiskVisible(true);
    };

    const handlePopupClose = () => {
        setIsWildfireRiskVisible(false);
    };

    async function handleNotification() {
        const tokens = await getAllSubscription();

        if (tokens) {
            for (const token of tokens) {
                await sendNotification(
                    token.id,
                    token.data,
                    'New article released',
                    'New Article have been released! Go check it!',
                    { url: '/news' },
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
        <>
            <div>
                <div className="homeLayout">
                    <div className={styles.header}>
                        <header className={`flex items-center ${styles.homeIcons}`}>
                            <Image src={Logo} alt="Flare logo" className="w-12 mb-4" />
                            <Bell size={32} color="white" />
                        </header>
                        <h1 className={`font-black ${styles.landingLogo}`}>FLARE</h1>
                    </div>

                    <div className={`grid ${styles.contentContainer}`}>
                        <div className={`grid grid-cols-2 gap-4 ${styles.fireRisk}`}>
                            <h2 className={styles.homeHeading}>Wildfire Risk: Low</h2>
                            <CircleHelp size={24} />
                        </div>

                        <Link href="/map" className={styles.location}>
                            <h3>My Location</h3>
                            <h1>26°</h1>
                            <div className="flex space-x-6">
                                <h3>Windy</h3>
                                <Wind size={32} />
                            </div>
                        </Link>

                        <Link href="/safety" className={styles.safety}>
                            <h3>Safety</h3>
                            <p>Learn how to prepare for a wildfire. Learn the early signs</p>
                        </Link>

                        <Link href="/news" className={styles.news}>
                            <h3>News</h3>
                            <p>Vancouver&rsquo;s Unique Coastal Climate: A Balance of Rain and Mild Temperatures: mild, wet winters and pleasantly warm summers</p>
                        </Link>
                    </div>
                    {!isStandalone && isIOS && (
                        // Description how to install the app on IOS& Safari
                        <div>
                            <p className="text-white">
                                To install this app, tap <span className="share-icon">⬆️</span> and select &quot;Add to Home Screen&quot;.
                            </p>
                        </div>
                    )}
                    {isInstallable && (
                        // Install button for Android
                        <Button onClick={handleInstallClick}>
                            Install App
                        </Button>
                    )}
                    <button
                        onClick={() => handleNotification()}
                        style={{
                            width: '100px',
                            height: '50px',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                        }}>
                    </button>
                </div>
                <BottomNavBar />
            </div>
        </>
    )
}
