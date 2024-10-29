// src/app/page.tsx
"use client";

import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Logo from "../../public/images/logo_Flare.png";
import BottomNavBar from "../components/BottomNavBar";
import Flare from "../../public/images/FLARE.png";
import Bell from "../../public/icons/Bell.png";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  // CarouselNext,
  // CarouselPrevious,
} from "@/components/ui/carousel";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-flare-gradient">
      {/* 메인 카드 */}
      <div className="flex flex-col flex-1 w-full max-w-6xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden p-6 pb-16 sm:pb-20 md:pb-24 bg-flare-gradient">
        <header className="flex justify-between items-center mb-6">
          <Image src={Logo} alt="Flare logo" className="w-12 h-12" />
          <button
            className="text-gray-700 hover:text-green-500 p-2"
            aria-label="icon bell"
            type="button"
          >
            <Image src={Bell} alt="Bell icon" className="w-6 h-6" />
          </button>
        </header>
        <main>
          <Image src={Flare} alt="Flare" className="mb-6" />
          <div className="shadow-xl p-10 rounded-sm flex flex-col bg-flare-gradientlow gap-4 mb-6">
            <h3 className="text-xs font-bold">Wildfire Risk:Low</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="px-3 py-2 bg-white rounded-md flex flex-col items-center text-center text-sm"></div>
            </div>
          </div>
          <section className="grid grid-cols-2 gap-6 w-full max-w-6xl mx-auto">
            <div className="shadow-2xl p-6 rounded-sm bg-fuchsia-900 flex flex-col justify-center items-center aspect-square">
              <p className="text-white text-lg font-semibold">카드 1 내용</p>
            </div>
            <div className="shadow-2xl p-6 rounded-sm bg-fuchsia-800 flex flex-col justify-center items-center row-span-2">
              <Carousel
                className="w-full h-full"
                plugins={[
                  Autoplay({
                    delay: 2000,
                  }),
                ]}
              >
                <CarouselContent className="w-full h-full">
                  <CarouselItem className="w-full h-full">123</CarouselItem>
                  <CarouselItem className="w-full h-full">456</CarouselItem>
                  <CarouselItem className="w-full h-full">789</CarouselItem>
                </CarouselContent>
              </Carousel>
            </div>
            <div className="shadow-2xl p-6 rounded-sm bg-fuchsia-600 flex flex-col justify-center items-center aspect-square">
              <p className="text-white text-lg font-semibold">카드 2 내용</p>
            </div>
          </section>
        </main>
      </div>
      <BottomNavBar />
    </div>
  );
}
