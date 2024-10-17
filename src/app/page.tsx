import Image from "next/image";
import Logo from "./public/images/logo_Flare.png";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-xs text-center">
        <Image src={Logo} alt="Flare logo" className="w-24 h-24 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Flare</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-600 transition duration-300 ease-in-out">
          Start
        </button>
      </div>
    </main>
  );
}
