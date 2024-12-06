'use client';

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch";
import { Sun, Bell, Languages, Info, CircleArrowDown } from 'lucide-react';
import { Combobox } from "@/components/ui/combobox";
import './settings.css';
import BottomNavBar from "@/components/BottomNavBar/BottomNavBar";
import { useEffect, useState } from "react";

interface NavigatorStandalone extends Navigator {
  standalone?: boolean;
}

function Settings() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    const isIOSDevice = /iPhone|iPad|iPod/i.test(userAgent);
    setIsIOS(isIOSDevice);

    const isStandaloneMode =
      (window.navigator as NavigatorStandalone).standalone || window.matchMedia("(display-mode: standalone)").matches;
    setIsStandalone(isStandaloneMode);

    const handleBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt as EventListener);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt as EventListener);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt && !isIOS) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      setDeferredPrompt(null);
    }
  };


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
          }}
            className="headerz"
          >App Preferences</h4>

          <Accordion type="single" collapsible>
            {/* <AccordionItem value="appearance">
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
            </AccordionItem> */}

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

            {/* <AccordionItem value="language">
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
            </AccordionItem> */}

            <AccordionItem value="install">
              <AccordionTrigger>
                <div className="accordion-trigger">
                  <CircleArrowDown className="icon-gray" />
                  <span className="theSpan">Install</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {isIOS !== false ?
                  (
                    <div className="accordion-content">
                      <p>
                        To install this app on IOS, tap ⬆️ and select &quot;Add to Home Screen&quot;.
                      </p>
                    </div>
                  )
                  : (
                    <div className="accordion-content">
                      <span>Install the app on your machine</span>
                      <Button onClick={handleInstallClick}>Install</Button>
                    </div>
                  )}
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
                  <a href="https://flare-wildfire-blog.vercel.app/legal" target="_blank" className="underlineSpan">Terms of Service</a>
                  <a href="https://flare-wildfire-blog.vercel.app/legal" target="_blank" className="underlineSpan">Privacy Policy</a>
                  <a href="https://flare-wildfire-blog.vercel.app/contact" target="_blank" className="underlineSpan">Contact Us</a>
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


