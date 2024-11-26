"use client"
import Logo from "../public/images/flare_logo.svg";
import Image from "next/image";
import styles from "./homepage.module.css"
import { Circle, CircleHelp, Wind, Bell, Bot } from "lucide-react"
import Link from "next/link";
import BottomNavBar from "@/components/BottomNavBar";
import { fetchWeatherData, WeatherData } from "@/utils/fetchWeatherData";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/router";


export default function HomePage() {
    const [cityName, setCityName] = useState("Vancouver");
    const [weatherData, setWeatherData] = useState(null);
    const [fireRisk, setFireRisk] = useState() 

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

    }, [])


    //text will be replaced with imported data
    return (
        <>
            <div>
                <div className="homeLayout">
                    <div className={styles.header}>
                        <header className={`flex items-center ${styles.homeIcons}`}>
                            <Image src={Logo} alt="Flare logo" className="w-12 h-12mb-4" />
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
                            <h3>{weatherData ? `${weatherData.cityName}` : <p>My Location</p>}</h3>
                            {weatherData ? (
                                <>
                                    <h1>{weatherData.current.temp.toFixed(0)}°C</h1>
                                    <div className="flex space-x-6 items-center">
                                        <p className="">{weatherData.current.weather[0].description}</p>
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

                        <Link href="/news" className={styles.news}>
                            <h3>News</h3>
                            <p>Vancouver’s Unique Coastal Climate: A Balance of Rain and Mild Temperatures: mild, wet winters and pleasantly warm summers</p>
                        </Link>
                    </div>
                </div>
                <BottomNavBar />
            </div>
        </>
    )
}
