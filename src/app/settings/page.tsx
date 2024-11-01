import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Sun, Bell, Languages, Info } from 'lucide-react';
import './Settings.css';
import BottomNavBar from "@/components/BottomNavBar";


function Settings() {
    return (
      <div className="settings-container">
        <h3 style={{
            color: "var(--white)",
            marginBottom: "1.5rem",
        }}
        >Settings</h3>
        
        <section>
          <h4 style={{
            color: "var(--white)",
            // marginBottom: "1.5rem",
        }}>App Preferences</h4>
          
          <Accordion type="single" collapsible>
            <AccordionItem value="appearance">
              <AccordionTrigger>
                <div className="accordion-trigger">
                  <Sun className="icon-gray" />
                  <span>Appearance</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="accordion-content">
                  <span>Toggle Light and Dark Mode</span>
                  <Switch defaultChecked={false} />
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="notifications">
              <AccordionTrigger>
                <div className="accordion-trigger">
                  <Bell className="icon-gray" />
                  <span>Notifications</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="accordion-content space-y-2">
                  <div className="accordion-content">
                    <span>Toggle Push Notifications</span>
                    <Switch />
                  </div>
                  <div className="accordion-content">
                    <span>Critical Alerts</span>
                    <Switch />
                  </div>
                  <div className="accordion-content">
                    <span>Fire Alerts</span>
                    <Switch />
                  </div>
                  <div className="accordion-content">
                    <span>Heavy Rain</span>
                    <Switch />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="language">
              <AccordionTrigger>
                <div className="accordion-trigger">
                  <Languages className="icon-gray" />
                  <span>Language</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p>Change Language</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
        
        <section>
          <h2>App Details</h2>
          <Accordion type="single" collapsible>
            <AccordionItem value="about">
              <AccordionTrigger>
                <div className="accordion-trigger">
                  <Info className="icon-gray" />
                  <span>About Flare</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p>Information about the Flare app...</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
        <BottomNavBar/>
      </div>
    );
  }
  
  export default Settings;
  
