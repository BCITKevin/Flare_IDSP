"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import styles from "./css/HamburgerMenu.module.css";
import { Menu, X } from "lucide-react";

interface NavItem {
  href: string;
  icon: string;
  label: string;
}

const HamburgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { href: "/homepage", icon: "/icons/Home.png", label: "Home" },
    { href: "/news", icon: "/icons/News.png", label: "News" },
    { href: "/map", icon: "/icons/Weather.png", label: "Map" },
    { href: "/safety", icon: "/icons/Safety.png", label: "Safety" },
    { href: "/settings", icon: "/icons/Settings.png", label: "Settings" },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.hamburgerMenu}>
      {/* Hamburger Button */}
      <button onClick={toggleMenu} className={styles.menuButton}>
        {isOpen ? <X size={32} /> : <Menu size={32} />}
      </button>

      {/* Menu Items */}
      {isOpen && (
        <div className={styles.menu}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${pathname === item.href ? styles.active : ""
                }`}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              <Image
                src={item.icon}
                alt={`${item.label} icon`}
                width={24}
                height={24}
                className={styles.icon}
              />
              <span className={styles.label}>{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
