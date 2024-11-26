"use client";

import Logo from "./public/images/flare_logo 2.svg";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import sendNotification from "@/lib/notification/sendNotification";

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

async function fetchSubscription(id: string, subscription: any) {
    const res = await fetch("/api/subscription", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            clientId: id,
            subscription: subscription,
        }),
    });

    const data = await res.json();
    return data.ok ? true : data.error;
}

export default function Page() {
    const router = useRouter();
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => {
                router.push("/homepage");
            }, 1000);
        }, 1000);

        return () => clearTimeout(timer);
    }, [router]);

    useEffect(() => {
        async function requestPermissionAndSubscribe() {
            if (Notification.permission === "default") {
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

                    const msg = "You have agreed to get a notification from our app";
                    sendNotification(msg, subscription);
                }
            }
        }

        if ("serviceWorker" in navigator && "PushManager" in window) {
            requestPermissionAndSubscribe().catch((error) =>
                console.error("Error during subscription:", error)
            );
        }
    }, []);

    return (
        <div
            className={`flex flex-col landingLayout items-center justify-center ${
                fadeOut ? "fade-out" : ""
            }`}
        >
            <Image
                src={Logo}
                alt="logo of Flare"
                width={191}
                height={191}
                priority
            />
            <h1 className="landingHead">FLARE</h1>
        </div>
    );
}
