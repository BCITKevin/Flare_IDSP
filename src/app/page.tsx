import Image from "next/image";
import Logo from "../../public/images/logo_Flare.png";
import { Button } from "@/components/ui/button";
import BottomNavBar from "../components/BottomNavBar";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-xs text-center">
        <Image src={Logo} alt="Flare logo" className="w-24 h-24 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Flare</h1>
        <Button>Hi there</Button>
      </div>
      <BottomNavBar />
    </main>
  );
}
