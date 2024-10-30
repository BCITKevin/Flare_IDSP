import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import "./safety.css"
import { Backpack, Map, Flag, Car } from "lucide-react";
import prepareHero from "../public/images/prepareHero.png"
import evacHero from "../public/images/EvacHero.png"
import emergencyHero from "../public/images/EmergencyHero.png"
import BottomNavBar from "@/components/BottomNavBar";


import Image from "next/image";

// Card can be reformatted into a reusable component

export default function Safety() {

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
        <body>
            <div className="appLayout">
                <h1 className="">Safety</h1>
                <h3 className="mt-32">AI Insight</h3>
                <Card className="p-5 mt-3">
                    <strong>Based on your Location and Recent Weather:</strong>
                    <p>Consider bringing extra water and cooling supplies to prevent heatstroke while outside</p>
                </Card>
                <div></div>
                <h3 className="mt-8">Safety Tips</h3>
                <div className="mt-2">
                    <Tabs defaultValue="account" className="w-full flex flex-col">
                        <TabsList className="space-x-8">
                            <TabsTrigger value="Prepare" className="w-full">Prepare</TabsTrigger>
                            <TabsTrigger value="Emergency" className="w-full">Emergency</TabsTrigger>
                            <TabsTrigger value="Evacuation" className="w-full">Evacuation</TabsTrigger>

                        </TabsList>
                        <TabsContent value="Prepare">
                            <Card className="p-6 flex flex-col items-center">
                                <Image src={prepareHero} width={340} height={189} alt="a rescue worker looking towards a wildfire"/>
                                <Flag color="black" className="m-6"/>
                                <p dangerouslySetInnerHTML={{ __html: prepareText }} className="articleBody"/>
                            </Card>
                        </TabsContent>
                        <TabsContent value="Emergency">
                            <Card className="p-6 flex flex-col items-center">
                                <Image src={emergencyHero} width={340} height={189} alt="a rescue worker looking towards a wildfire"/>
                                <Backpack color="black" className="m-6"/>
                                <p dangerouslySetInnerHTML={{ __html: emergencyText }} className="articleBody"/>
                            </Card>
                        </TabsContent>
                        <TabsContent value="Evacuation">
                            <Card className="p-6 flex flex-col items-center">
                                <Image src={evacHero} width={340} height={189} alt="a rescue worker looking towards a wildfire"/>
                                <Map color="black" className="m-6"/>
                                <p dangerouslySetInnerHTML={{ __html: evacuationText }} className="articleBody"/>
                            </Card>
                        </TabsContent>

                    </Tabs>
                </div>



            </div>
            <BottomNavBar/>
        </body>
    )
}