'use client';

import Logo from "../public/images/flare_logo.svg";
import Image from "next/image";
import styles from "./homepage.module.css"
import { CircleHelp, Wind, Bell } from "lucide-react"
import Link from "next/link";
import BottomNavBar from "@/components/BottomNavBar";
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import sendNotification from "@/lib/notification/sendNotification";
import getAllSubscription from "./actions";

interface NavigatorStandalone extends Navigator {
    standalone?: boolean;
}



export default function HomePage() {
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstallable, setIsInstallable] = useState(false);

    async function handleNotifiaction() {
        if (Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                console.error('Notification permission not granted');
                return;
            }
        }
        const msg = 'replace this to the proper msg later';

        const clientId = localStorage.getItem('clientId');
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

            // This is for testing. Remove this if statement after testing with Android.
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
            (window.navigator as NavigatorStandalone).standalone || window.matchMedia('(display-mode: standalone)').matches;
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
                            <p>Vancouver’s Unique Coastal Climate: A Balance of Rain and Mild Temperatures: mild, wet winters and pleasantly warm summers</p>
                        </Link>
                    </div>
                    {!isStandalone && isIOS && (
                        // Description how to install the app on IOS& Safari
                        <div>
                            <p className="text-white">
                                To install this app, tap <span className="share-icon">⬆️</span> and select "Add to Home Screen".
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
                        onClick={() => handleNotifiaction()}
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
