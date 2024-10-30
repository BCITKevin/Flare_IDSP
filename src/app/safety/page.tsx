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

export default function Safety() {
    return (
        <body>
            <div className="appLayout">
                <h1>Safety</h1>
                <h3>AI Insight</h3>
                <div></div>
                <h3>Safety Tips</h3>
                <div className="mt-8">
                    <Tabs defaultValue="account" className="w-full flex flex-col">
                        <TabsList>
                            <TabsTrigger value="Prepare">Prepare</TabsTrigger>
                            <TabsTrigger value="Emergency">Emergency</TabsTrigger>
                            <TabsTrigger value="Evacuation">Evacuation</TabsTrigger>

                        </TabsList>
                        <TabsContent value="Prepare">Make changes to your account here.</TabsContent>
                        <TabsContent value="Emergency">Change your password here.</TabsContent>
                        <TabsContent value="Evacuation">Make changes to your account here.</TabsContent>

                    </Tabs>
                </div>



            </div>
        </body>
    )
}