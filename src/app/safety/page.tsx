'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    // CardContent,
    // CardDescription,
    // CardFooter,
    // CardHeader,
    // CardTitle,
} from "@/components/ui/card"
import styles from "./safety.module.css"
import { Backpack, Map, Flag } from "lucide-react";
import prepareHero from "../public/images/prepareHero.png"
import evacHero from "../public/images/EvacHero.png"
import emergencyHero from "../public/images/EmergencyHero.png"
import BottomNavBar from "@/components/BottomNavBar";

import { useState } from "react";
import Image from "next/image";

type Message = {
    text: string;
    sender: string;
};

// Card can be reformatted into a reusable component

export default function Safety() {
    const [showChat, setShowChat] = useState(false);
    // const [error, setError] = useState<null | string>(null);
    const [prevMsg, setMsg] = useState<Message[]>([
        { text: "Hello! Is there anything about wildfires I could help you with today?", sender: 'bot' },
    ]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        try {
            const message = (document.querySelector('#message') as HTMLInputElement)?.value;
            (document.querySelector('#message') as HTMLInputElement).value = '';

            console.log(message);
            setMsg((prevMsg) => [...prevMsg, { text: message, sender: 'user' }]);

            const res = await fetch('/api/safety', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            if (!res.ok) {
                console.error();
                throw new Error('OPPPS, SOMETHIN WRONG WITH BOT');
            }
            const data = await res.json();

            const botResponse = data.chat.content || "Sorry, I can't process your request. Please try again";

            setMsg((prevMsg) => [...prevMsg, { text: botResponse, sender: 'bot' }]);

            console.log('from gpt: ', botResponse);
        }
        catch (err) {
            console.error(err);
        }
    }

    const prepareText = `
    <strong>Stay informed:</strong> Monitor emergency alerts and evacuation orders from local authorities.
    <br><br>
    <strong>Prepare to leave immediately:</strong> 
    - Gather essential items, including:
    <br><br>
    <ul>
        <li>- Medications</li>
        <li>- Important documents (ID, insurance)</li>
        <li>- Emergency kit (water, food, flashlight)</li>
    </ul>
    <br>
    <strong>Follow evacuation routes:</strong> Use the safest, predefined routes recommended by local authorities.
    <br><br>
    <strong>Leave as early as possible:</strong> Don't wait for the last moment. Protect your safety and others.
    <br><br>
    <strong>Assist neighbors if possible:</strong> Especially the elderly or those with disabilities.
    <br><br>
    <strong>Keep your vehicle ready:</strong> Full gas tank, keys accessible, and parked facing outward.
    `;

    const emergencyText = `
    <strong>If you are in danger, contact emergency services immediately.</strong>
    <br><br>
    <strong>Stay inside if safe:</strong> If you can't evacuate, move to a safe room with minimal windows.
    <br><br>
    <strong>Block air entry:</strong> Seal windows and doors to prevent smoke from entering.
    <br><br>
    <strong>Listen to official information:</strong> Use radio or mobile apps for updates.
    <br><br>
    <strong>Use face coverings:</strong> Wet towels or N95 masks can help filter smoke.
    <br><br>
    <strong>Stay hydrated:</strong> Drink plenty of water to combat heat and smoke inhalation effects.
    `;

    const evacuationText = `
    <strong>Create a defensible space around your home:</strong> Clear away flammable materials like dry leaves and wood piles.
    <br><br>
    <strong>Develop a family emergency plan:</strong> Include meeting spots, communication strategies, and escape routes.
    <br><br>
    <strong>Assemble an emergency kit:</strong> Include:
    <ul>
        <li>- First aid supplies</li>
        <li>- Non-perishable food and water (enough for 3 days)</li>
        <li>- Flashlights, batteries, and a whistle</li>
    </ul>
    <br>
    <strong>Keep important documents ready:</strong> Store them in a fireproof safe or have digital backups.
    <br><br>
    <strong>Know your local risk level:</strong> Stay informed about wildfire risks in your area and practice evacuation drills.
    <br><br>
    <strong>Sign up for emergency alerts:</strong> Subscribe to local wildfire and weather warning systems.
    `;




    return (
        <div>
            <div className="safetyLayout">

                <h1 className={styles.safetyHeading}>Safety</h1>
                <h3 className={`${styles.safetyHeading} mt-12`}>AI Insight</h3>
                <Card className={`${styles.card} p-5 mt-3`}>
                    <strong className={styles.articleBody}>Based on your Location and Recent Weather:</strong>
                    <p className={styles.articleBody}>Consider bringing extra water and cooling supplies to prevent heatstroke while outside</p>
                </Card>
                <h3 className={`${styles.safetyHeading} mt-8`}>Safety Tips</h3>
                <div className="mt-2">
                    <Tabs defaultValue="account" className="w-full flex flex-col">
                        <TabsList className="space-x-8">
                            <TabsTrigger value="Prepare" className="w-full">Prepare</TabsTrigger>
                            <TabsTrigger value="Emergency" className="w-full">Emergency</TabsTrigger>
                            <TabsTrigger value="Evacuation" className="w-full">Evacuation</TabsTrigger>
                        </TabsList>
                        <TabsContent value="Prepare">
                            <Card className={`${styles.card} p-6 flex flex-col items-center`}>
                                <Image src={prepareHero} width={340} height={189} alt="a rescue worker looking towards a wildfire" />
                                <Flag color="black" className="m-6" />
                                <p dangerouslySetInnerHTML={{ __html: prepareText }} className={styles.articleBody} />
                            </Card>
                        </TabsContent>
                        <TabsContent value="Emergency">
                            <Card className={`${styles.card} p-6 flex flex-col items-center`}>
                                <Image src={emergencyHero} width={340} height={189} alt="a rescue worker looking towards a wildfire" />
                                <Backpack color="black" className="m-6" />
                                <p dangerouslySetInnerHTML={{ __html: emergencyText }} className={styles.articleBody} />
                            </Card>
                        </TabsContent>
                        <TabsContent value="Evacuation">
                            <Card className={`${styles.card} p-6 flex flex-col items-center`}>
                                <Image src={evacHero} width={340} height={189} alt="a rescue worker looking towards a wildfire" />
                                <Map color="black" className="m-6" />
                                <p dangerouslySetInnerHTML={{ __html: evacuationText }} className={styles.articleBody} />
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
                {showChat ? (
                    <>
                        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                            <div className="relative w-[calc(100%-20px)] h-[calc(100%-200px)] mx-auto my-6">
                                {/* Content */}
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full h-full bg-white outline-none focus:outline-none">
                                    {/* Header */}
                                    <div className="flex items-center justify-between p-4 border-b border-solid border-gray-200 rounded-t">
                                        <div className="flex items-center space-x-2">
                                            <img src="/icons/laugh.svg" alt="smile icon" width={24} />
                                            <p className="text-gray-600">Flare Chatbot</p>
                                        </div>
                                        <button
                                            className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                            onClick={() => setShowChat(false)}
                                        >
                                            <span className="flex items-center h-6 w-6 text-2xl block outline-none focus:outline-none">
                                                x
                                            </span>
                                        </button>
                                    </div>

                                    {/* Body */}
                                    <div className="relative p-6 flex-auto bg-neutral-800 h-full flex flex-col justify-between overflow-y-auto">

                                        <div className="chat-messages flex flex-col space-y-4">

                                            {prevMsg.map((msg, i) => (
                                                <>
                                                    <div key={i} className="chat-message">
                                                        <div className={msg.sender === "bot" ? "flex items-end" : "flex items-end justify-end"}>
                                                            <div className={msg.sender === "bot" ? "flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start" : "flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end"}>
                                                                <div>
                                                                    <span className={msg.sender === "bot" ? "px-4 py-2 rounded-lg inline-block rounded-bl-none bg-neutral-900 text-gray-100" : "px-4 py-2 rounded-lg inline-block rounded-br-none bg-gray-200 text-black"}>
                                                                        {msg.text}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="border-t-2 border-gray-200 px-4 py-4">
                                        <div className="relative flex items-center space-x-2 w-full">
                                            <span className="absolute inset-y-0 flex items-center">
                                                <button type="button" className="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-600">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                                                    </svg>
                                                </button>
                                            </span>
                                            <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
                                                <input
                                                    type="text"
                                                    id="message"
                                                    placeholder="Enter your Message..."
                                                    className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"
                                                />
                                                <button type="submit" className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white hover:bg-gray-400 focus:outline-none">
                                                    <img src="/icons/send.svg" alt="send icon" />
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                    </>
                ) : <></>}
                <button className="bg-neutral-800 rounded-md fixed bottom-24" onClick={() => setShowChat(true)}>
                    <img src="/icons/message-circle.svg" alt="chatbot icon" className="w-full h-full" />
                </button>
            </div>
            <BottomNavBar />
        </div>
    )
}