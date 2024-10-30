import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Sun, Bell, Earth, Info } from 'lucide-react';


function Settings() {
  return (
    <div className="settings-container bg-black text-white min-h-screen p-6">
      <h1 className="text-2xl mb-4">Settings</h1>
      
      <section className="mb-4">
        <h2 className="text-lg mb-2">App Preferences</h2>
        
        <Accordion type="single" collapsible>
          <AccordionItem value="appearance">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Sun className="text-gray-400" />
                <span>Appearance</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex items-center justify-between">
                <span>Toggle Light and Dark Mode</span>
                <Switch defaultChecked={false} />
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="notifications">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Bell className="text-gray-400" />
                <span>Notifications</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Toggle Push Notifications</span>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <span>Critical Alerts</span>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <span>Fire Alerts</span>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <span>Heavy Rain</span>
                  <Switch />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="language">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Earth className="text-gray-400" />
                <span>Language</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <p>Select Language Options Here...</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
      
      <section>
        <h2 className="text-lg mb-2">App Details</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="about">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Info className="text-gray-400" />
                <span>About Flare</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <p>Information about the Flare app...</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}


export default Settings;