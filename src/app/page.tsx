import Image from "next/image";
import Logo from "./public/images/flare_logo.svg";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 landingContainer">
      <div className="flex flex-col items-center text-center">
        <Image src={Logo} alt="Flare logo" className="w-80 mb-4" />
        <h1 className="font-black mb-2 landingLogo">FLARE</h1>
        <Link href="/homepage">
          <Button
            className="">
            Start
          </Button>
        </Link>
      </div>
    </main>
  );
}
