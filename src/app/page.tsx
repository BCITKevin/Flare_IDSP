"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import logoAnimation from "./public/videos/LogoAnimation.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function Main() {
    const [fadeOut, setFadeOut] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => {
                router.push("/homepage");
            }, 1000);
        }, 4000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div
            className={`flex flex-col landingLayout items-center justify-center ${fadeOut ? "fade-out" : ""
                }`}
            style={{
                objectFit: "cover",
                width: "440px",
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div>
                <Lottie
                    animationData={logoAnimation}
                    loop={false}
                    style={{
                        width: "80rem",
                    }}
                />
            </div>
        </div>
    );
}
