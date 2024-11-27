"use client"

import Logo from "./public/images/flare_logo 2.svg";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from 'react'
import sendNotification, { fetchSubscription } from "@/lib/notification/sendNotification";




function getOrCreateClientId() {

    let clientId = localStorage.getItem('clientId');
    console.log(clientId);
    if (!clientId) {
        clientId = crypto.randomUUID();
        localStorage.setItem('clientId', clientId);
        return clientId;
    }
    return clientId;
}

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding)
        .replace(/\\-/g, '+')
        .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

export default function Main() {
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

                    await sendNotification(msg, subscription, '/homepage');
                }
            }
        }

        if ("serviceWorker" in navigator && "PushManager" in window) {
            requestPermissionAndSubscribe().catch((error) => console.error("Error during subscription:", error));
        }
    }, []);

    return (
        <>
            <div className="flex flex-col landingLayout items-center justify-center">
                <Image
                    src={Logo}
                    alt="logo of Flare"
                    width={191}
                    height={191}
                    priority
                />
                <h1 className="landingHead font-black">FLARE</h1>
                <Link href={"/homepage"} >
                    <Button className="bg-gray-300 text-neutral-800">Placeholder Start</Button>
                </Link>
            </div>
        </>
    )
}