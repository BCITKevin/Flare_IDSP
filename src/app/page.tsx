"use client"
import Logo from "./public/images/flare_logo 2.svg"
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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