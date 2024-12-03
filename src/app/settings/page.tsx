import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Sun, Bell, Languages, Info } from 'lucide-react';
import { Combobox } from "@/components/ui/combobox";
import './settings.css';
import BottomNavBar from "@/components/BottomNavBar/BottomNavBar";


function Settings() {
  return (
    <div>
      <div className="settings-container">
        <h3 style={{
          marginBottom: "1.5rem",
        }}
          className="headerz"
        >Settings</h3>

        <section>
          <h4 style={{
            color: "var(--white)",
            // marginBottom: "1.5rem",
          }}
            className="headerz"
          >App Preferences</h4>

          <Accordion type="single" collapsible>
            <AccordionItem value="appearance">
              <AccordionTrigger>
                <div className="accordion-trigger">
                  <Sun className="icon-gray" />
                  <span className="theSpan">Appearance</span>
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
                  <span className="theSpan">Notifications</span>
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
                  <span className="theSpan">Language</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="accordion-content">
                  <p>Change Language</p>
                  <Combobox />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section>
          <h4
            style={{
              marginTop: "9rem"
            }}
            className="headerz"
          >App Details</h4>
          <Accordion type="single" collapsible>
            <AccordionItem value="about">
              <AccordionTrigger>
                <div className="accordion-trigger">
                  <Info className="icon-gray" />
                  <span className="theSpan">About Flare</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="accordion-contentAbout">
                  <span>Version: 1.01</span>
                  <span className="underlineSpan">Terms of Service</span>
                  <span className="underlineSpan">Privacy Policy</span>
                  <span className="underlineSpan">Contact Us</span>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </div>
      <BottomNavBar />
    </div>
  );
}

export default Settings;


