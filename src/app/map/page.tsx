"use client";

import BottomNavBar from "@/components/BottomNavBar";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import sendNotification from "@/lib/notification/sendNotification";

const WeatherMap = dynamic(
  () => import("@/components/weather-map/WeatherMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center h-[60vh] w-full">
        <Loader2 className="animate-spin h-8 w-8 text-neutral-500" />
      </div>
    ),
  }
);

export default function MapPage() {

  useEffect(() => {
    const msg = 'Fire Alert near your location! RUN ASAP!!';

    const subscriptionStr = localStorage.getItem('pushSubscription');
    if (!subscriptionStr) {
      console.error('No subscription found in localStorage.');
      return;
    }
    const subscription = JSON.parse(subscriptionStr);

    sendNotification(msg, subscription);

    // vibrating the machine after send alert noti. BUT only work on "Android".
    navigator.vibrate([
      100, 30, 100, 30, 100, 30, 200, 30, 200, 30, 200, 30, 100, 30, 100, 30, 100,
    ]);
  }, [])


  return (
    <div className="flex justify-center p-4">
      <WeatherMap />
      <BottomNavBar />
    </div>
  );
}
