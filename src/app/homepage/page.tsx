
'use client';

import Logo from "../public/images/flare_logo.svg";
import Image from "next/image";
import styles from "./homepage.module.css";
import { CircleHelp, Wind, Bell } from "lucide-react";
import Link from "next/link";
import BottomNavBar from "@/components/BottomNavBar";
import WildfireRisk from "@/components/wildfireRisk/WildfireRisk";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import sendNotification, { fetchSubscription } from "@/lib/notification/sendNotification";
import getAllSubscription from "./actions";
import { fetchWeatherData } from "@/utils/fetchWeatherData";

interface NavigatorStandalone extends Navigator {
    standalone?: boolean;
}

interface BeforeInstallPromptEvent extends Event {
    prompt: () => void;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function getOrCreateClientId() {
    let clientId = localStorage.getItem("clientId");
    if (!clientId) {
        clientId = crypto.randomUUID();
        localStorage.setItem("clientId", clientId);
    }
    return clientId;
}

function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
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
    const [subscriptionRegistered, setSubscriptionRegistered] = useState(false);

    useEffect(() => {
        async function requestPermissionAndSubscribe() {
            if (Notification.permission === "default" && !subscriptionRegistered) {
                const permission = await Notification.requestPermission();
                if (permission === "granted") {
                    const registration = await navigator.serviceWorker.register("/sw.js", {
                        scope: "/",
                        updateViaCache: "none",
                    });
                    const subscription = await registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array(
                            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
                        ),
                    });

                    const clientId = getOrCreateClientId();
                    await fetchSubscription(clientId, subscription);
                    setSubscriptionRegistered(true);

                    const msg = "You have agreed to get a notification from our app";

                    await sendNotification(msg, subscription, '/homepage');
                }
            }
        }

        if ("serviceWorker" in navigator && "PushManager" in window) {
            requestPermissionAndSubscribe().catch((error) =>
                console.error("Error during subscription:", error)
            );
        }
    }, [subscriptionRegistered]);

    const handleHelpClick = () => {
        setIsWildfireRiskVisible(true);
    };

    const handlePopupClose = () => {
        setIsWildfireRiskVisible(false);
    };

    async function handleNotification() {
        console.log('hit');
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
                    await sendNotification(msg, subscription, '/article');
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
