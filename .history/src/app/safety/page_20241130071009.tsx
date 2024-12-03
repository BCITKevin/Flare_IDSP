'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    // CardDescription,
    // CardFooter,
    CardHeader,
    // CardTitle,
} from "@/components/ui/card"
import styles from "./safety.module.css"
import { Backpack, Map, Flag } from "lucide-react";
import prepareHero from "../public/images/prepareHero.png"
import evacHero from "../public/images/EvacHero.png"
import emergencyHero from "../public/images/EmergencyHero.png"
import BottomNavBar from "@/components/BottomNavBar/BottomNavBar";
import React from "react";

import { useState } from "react";
import Image from "next/image";

type Message = {
    text: string;
    sender: string;
};

// Card can be reformatted into a reusable component

export default function Safety() {
    const [showChat, setShowChat] = useState(false);
    const [activeTab, setActiveTab] = useState('Prepare');
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
                throw new Error('OOPS, SOMETHIN WRONG WITH BOT');
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
    <strong>Stay informed:</strong> It’s crucial to stay updated on emergency alerts and evacuation orders issued by local authorities. Regularly check with Flare and turn on notifications and stay updated with the news. These alerts provide critical information about wildfire locations, safe zones, and road closures.
    <br><br>
    <strong>Assemble an emergency kit:</strong> Include:
    <ul>
        <li>- First aid supplies, such as bandages, antiseptics, and pain relievers.</li>
        <li>- Enough non-perishable food and water to sustain your household for at least 3 days.</li>
        <li>- Flashlights with spare batteries, a multi-tool, a whistle for signaling, and a fire extinguisher.</li>
        <li>- Personal hygiene items, blankets, and clothing suitable for various weather conditions.</li>
    </ul>
    <br>
    <strong>Follow evacuation routes:</strong> Use the safest, predefined routes recommended by local authorities. Avoid unfamiliar roads that could be blocked or unsafe. Always have a physical map in case of GPS or mobile network failure.
    <br><br>
    <strong>Leave as early as possible:</strong> Don’t wait until the last moment to evacuate. Early action reduces risks and allows emergency responders to focus on critical areas. Traffic congestion and panic during last-minute evacuations can pose additional dangers.
    <br><br>
    <strong>Assist neighbors if possible:</strong> Check on those in your community who may need help, especially the elderly, people with disabilities, or families without transportation. Offer support by carpooling or sharing resources.
    <br><br>
    <strong>Keep your vehicle ready:</strong> Ensure your vehicle is in good condition with a full gas tank. Keep the keys easily accessible, park the car facing outward for a quick exit, and load essential items in advance to save time during an emergency.
    <br><br>
    <strong>Practice your evacuation plan:</strong> Conduct regular drills with your household to ensure everyone knows their roles and responsibilities. Familiarity with the process can reduce stress and confusion during an actual emergency.
    <br><br>
    <strong>Create a defensible space around your home:</strong> Clear dry leaves, branches, and other flammable materials at least 30 feet from your home. Trim tree branches to a height of at least 6 feet to prevent fire from climbing. Regularly maintain gutters and roofs by removing debris. Store firewood and other combustible items far from structures.
    <br><br>
    `;
    

    const emergencyText = `
    <strong>If you are in danger, contact emergency services immediately:</strong> Dial the emergency hotline 911 if your safety is compromised. Or  call 1 800 663-5555 toll-free or <strong>*5555</strong> on a cellphone to report a wildfire. Clearly state your location and the nature of the emergency to ensure responders can locate you quickly. Avoid using the line for non-critical updates to keep it free for those in immediate need.
    <br><br>
    <strong>Stay inside if safe:</strong> If evacuation is not possible, shelter in place in a safe room. Select an area with minimal windows and external doors, preferably one located at the center of your home or on the opposite side of the fire’s path. Keep the space stocked with basic necessities, including water, flashlights, and communication devices.
    <br><br>
    <strong>Block air entry:</strong> Use duct tape, wet towels, or other materials to seal gaps around doors and windows to prevent smoke infiltration. Shut off HVAC systems and close vents to further limit the entry of hazardous air.
    <br><br>
    <strong>Listen to official information:</strong> Stay tuned to updates from local authorities via radio, mobile apps, or reliable online sources. Avoid spreading or acting on unverified information that may cause unnecessary panic.
    <br><br>
    <strong>Use face coverings:</strong> If you need to go outside or smoke enters your shelter, use wet towels, bandanas, or certified N95 masks to filter harmful particles. This is especially important for individuals with respiratory issues, the elderly, and young children.
    <br><br>
    <strong>Stay hydrated:</strong> Drink plenty of water to combat dehydration caused by heat and smoke inhalation. Avoid alcohol or caffeinated drinks, which can exacerbate dehydration. If possible, keep oral rehydration salts or electrolyte drinks on hand.
    <br><br>
    <strong>Be prepared for power outages:</strong> Wildfires may disrupt electricity. Keep flashlights, extra batteries, and a manual crank radio available. Charge your devices in advance and consider using portable power banks.
    <br><br>
    <strong>Plan for communication:</strong> If mobile networks are down, use walkie-talkies or pre-established signals with neighbors and family to communicate effectively.
    <br><br>
    <strong>Protect pets and livestock:</strong> Keep your pets in a secure area with food and water. If possible, move livestock to open areas far from fire hazards.
    <br><br>
    <strong>Monitor air quality:</strong> Use air purifiers indoors if available and check air quality levels through official channels to minimize smoke-related health risks.
    `;
    

    const evacuationText = `
    <strong>Develop a family emergency plan:</strong> Create a detailed emergency plan that includes designated meeting spots, multiple communication strategies, and escape routes for different scenarios. Assign responsibilities to each family member and rehearse the plan frequently to ensure everyone is prepared.
    <br><br>
    <strong>Prepare to leave immediately:</strong> 
    - Ensure you have gathered all essential items ahead of time to avoid delays. These include:
    <br><br>
    <ul>
        <li>- <strong>Medications</strong>, including prescription drugs and a basic first aid kit for minor injuries.</li>
        <li>- <strong>Important documents</strong>, such as government-issued IDs, insurance papers, property deeds, and emergency contact information.</li>
        <li>- Your <strong>emergency kit</strong> as outlined in the prepare section</li>
        <li>- Personal items like clothing, toiletries, and any essential supplies for infants, pets, or elderly family members.</li>
    </ul>
    <br>
    <strong>Keep important documents ready:</strong> Store essential documents like birth certificates, passports, medical records, and insurance policies in a waterproof, fireproof safe. Back up digital copies to cloud storage or an external hard drive.
    <br><br>
    <strong>Know your local risk level:</strong> Familiarize yourself with wildfire risks in your area by consulting local government websites and fire risk maps. Participate in community evacuation drills to understand the best practices and routes in case of an emergency.
    <br><br>
    <strong>Sign up for emergency alerts:</strong> Subscribe to wildfire and weather warning systems offered by local authorities.
    <br><br>
    <strong>Invest in fire-resistant building materials:</strong> Upgrade your home with fire-resistant roofing, siding, and windows. Install ember-resistant vents to prevent sparks from entering your home.
    <br><br>
    <strong>Prepare your vehicle:</strong> Keep your car in good working condition, with a full gas tank and an emergency kit inside. Include maps, a spare tire, tools, and extra supplies to ensure mobility during an evacuation.
    <br><br>
    <strong>Coordinate with your neighbors:</strong> Work together with your community to create a wildfire response plan. Share resources, such as tools and safety tips, to enhance collective preparedness.
    <br><br>
    <strong>Learn fire suppression techniques:</strong> Take basic training on how to use a fire extinguisher and other suppression tools effectively. Know when to evacuate instead of attempting to combat the fire yourself.
    <br><br>
    <strong>Advocate for local safety measures:</strong> Encourage local governments to implement wildfire prevention strategies, such as controlled burns, community fuel breaks, and infrastructure upgrades.
    `;
    



    return (
        <body className="min-h-screen overflow-y-auto">
            <div className="safetyLayout h-full overflow-y-auto mb-44">
                <div className={styles.safetyHeading}>
                    <h3>
                        Wildfire Safety Guide
                    </h3>
                    <h5 className={styles.whiteText}>
                        Learn how to prepare and stay safe during wildfire season
                    </h5>
                </div>
                {/* <Card className="p-5 mt-3 transition-all duration-300 hover:shadow-lg border-l-4 border-l-orange-500">
                    <CardHeader className="p-0 mb-3">
                        <div className="flex items-center gap-2">
                            <strong className={`${styles.articleBody} text-lg`}>
                                Based on your Location and Recent Weather
                            </strong>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="flex flex-col gap-2">
                            <p className={`${styles.articleBody} leading-relaxed`}>
                                Consider bringing:
                            </p>
                            <ul className="list-disc ml-5 space-y-1">
                                <li className={styles.articleBody}>Extra water (1 gallon per person)</li>
                                <li className={styles.articleBody}>Cooling towels</li>
                                <li className={styles.articleBody}>Sun protection (hat, sunscreen)</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card> */}
                <div className={`${styles.safetyHeading} mb-6 mt-6`}>
                    <h3 className="text-2xl font-bold">
                        Safety Tips
                    </h3>
                </div>
                <div className="mt-2">
                <Tabs defaultValue="Prepare" className="w-full flex flex-col" onValueChange={setActiveTab}>
                        <TabsList className="space-x-8 p-6">
                            <TabsTrigger value="Prepare" className={`w-full ${activeTab === 'Prepare' ? styles.activeTab : ''}`}>Prepare</TabsTrigger>
                            <TabsTrigger value="Emergency" className={`w-full ${activeTab === 'Emergency' ? styles.activeTab : ''}`}>Emergency</TabsTrigger>
                            <TabsTrigger value="Evacuation" className={`w-full ${activeTab === 'Evacuation' ? styles.activeTab : ''}`}>Evacuation</TabsTrigger>
                        </TabsList>
                        <TabsContent value="Prepare">
                            <Card className={`${styles.card} p-6 flex flex-col items-center mb-24`}>
                                <Image src={prepareHero} width={340} height={189} alt="a rescue worker looking towards a wildfire" />
                                <Flag color="black" className="m-6" />
                                <p dangerouslySetInnerHTML={{ __html: prepareText }} className={styles.articleBody} />
                            </Card>
                        </TabsContent>
                        <TabsContent value="Emergency">
                            <Card className={`${styles.card} p-6 flex flex-col items-center mb-24`}>
                                <Image src={emergencyHero} width={340} height={189} alt="a rescue worker looking towards a wildfire" />
                                <Backpack color="black" className="m-6" />
                                <p dangerouslySetInnerHTML={{ __html: emergencyText }} className={styles.articleBody} />
                            </Card>
                        </TabsContent>
                        <TabsContent value="Evacuation">
                            <Card className={`${styles.card} p-6 flex flex-col items-center mb-24`}>
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
                            <div className="relative w-full h-full mx-auto max-w-3xl px-4 pt-6 pb-24">
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full h-full bg-white outline-none focus:outline-none">
                                    {/* Header */}
                                    <div className="flex items-center justify-between p-4 border-b border-solid border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-900">Flare Assistant</h3>
                                        <button
                                            className="p-1 ml-auto border-0 text-black float-right text-3xl leading-none font-semibold"
                                            onClick={() => setShowChat(false)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                    
                                    {/* Chat Messages */}
                                    <div className="relative p-4 flex-auto overflow-y-auto">
                                        {prevMsg.map((msg, i) => (
                                            <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                                                <div className={`rounded-lg px-4 py-2 max-w-[80%] ${
                                                    msg.sender === 'user' 
                                                    ? 'bg-[var(--orange)] text-white' 
                                                    : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {msg.text}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Input Form */}
                                    <div className="border-t border-solid border-gray-200 p-4">
                                        <form onSubmit={handleSubmit} className="flex gap-2">
                                            <input
                                                type="text"
                                                id="message"
                                                placeholder="Type your message..."
                                                className="flex-grow px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-[var(--orange)]"
                                            />
                                            <button
                                                type="submit"
                                                className="bg-[var(--orange)] text-white rounded-full px-6 py-2"
                                            >
                                                Send
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                    </>
                ) : null}
                <div className="flex flex-col fixed bottom-24 rounded-md px-6 py-3 m-2 items-center gap-4 transition-all duration-300">
                    {/* <div>
                        <span className="flex justify-center text-white ">Flare Assistant</span>
                        <p className="text-white text-base">Ask us about how you can stay safe</p>
                    </div> */}
                    <button 
                        className="flex justify-center bg-[var(--orange)] text-white rounded-full shadow-lg transition-all duration-300 flex items-center gap-2 px-4 py-2 w-3/4 hover:border-2 hover:border-white box-border w-52 h-12"
                        onClick={() => setShowChat(true)}
                    >
                        <img src="/icons/message-circle.svg" alt="chatbot icon" className="w-5 h-5 filter invert brightness-0" />
                        <span>Chat now</span>
                    </button>
                </div>
            </div>
            <BottomNavBar />
        </body>
    )
}