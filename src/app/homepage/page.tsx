import Logo from "../public/images/flare_logo.svg";
import Image from "next/image";
import styles from "./homepage.module.css"
import { Circle, CircleHelp, Wind, Bell, Bot } from "lucide-react"
import Link from "next/link";
import BottomNavBar from "@/components/BottomNavBar";

export default function HomePage() {

    //text will be replaced with imported data
    return (
        <>
            <div>
                <div className="appLayout">
                    <div className={styles.header}>
                        <header className="flex items-center">
                            <Image src={Logo} alt="Flare logo" className="w-12 mb-4" />
                            <Bell size={32} />
                        </header>
                        <h1 className={`font-black ${styles.landingLogo}`}>FLARE</h1>
                    </div>

                    <div className={`grid ${styles.contentContainer}`}>
                        <div className={`grid grid-cols-2 gap-4 ${styles.fireRisk}`}>
                            <h2 className="col-span-2">Wildfire Risk: Low</h2>
                            <CircleHelp size={24} />
                        </div>

                        <Link href="/map" className={styles.location}>
                            <h3>My Location</h3>
                            <h1>26°</h1>
                            <div className="flex space-x-20 items-center">
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
                </div>
                <BottomNavBar />
            </div>
        </>
    )
}
