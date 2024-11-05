// src/components/BottomNavBar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./css/BottomNavBar.module.css";
import Image from "next/image";

interface NavItem {
  href: string;
  icon: string;
  label: string;
}

const BottomNavBar: React.FC = () => {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { href: "/", icon: "/icons/Home.png", label: "Home" },
    { href: "/news", icon: "/icons/News.png", label: "News" },
    { href: "/map", icon: "/icons/Weather.png", label: "Map" },
    { href: "/safety", icon: "/icons/Safety.png", label: "Safety" },
    { href: "/settings", icon: "/icons/Settings.png", label: "Settings" },
  ];

  return (
    <nav
      className={`${styles.bottomNav} font-sans`}
      aria-label="bottom navigation"
    >
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
    </nav>
  );
};
export default BottomNavBar;
