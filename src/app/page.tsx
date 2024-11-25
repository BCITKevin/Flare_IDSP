"use client"
import Logo from "./public/images/flare_logo 2.svg"
import Image from "next/image";
import BottomNavBar from "@/components/BottomNavBar";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {

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
                <h1 className="landingHead">FLARE</h1>
                <Link href={"/homepage"} >
                    <Button className="bg-gray-300 text-neutral-800">Placeholder Start</Button>
                </Link>
            </div>
        </>
    )
}