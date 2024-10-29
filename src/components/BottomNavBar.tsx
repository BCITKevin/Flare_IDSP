//path: src/components/BottomNavBar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
//import { FaHome, FaSearch, FaBell, FaUser } from "react-icons/fa";
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
    { href: "/", icon: "/icons/home.png", label: "home" },
    { href: "/news", icon: "/icons/news.png", label: "news" },
    { href: "/weather", icon: "/icons/weather.png", label: "weather" },
    { href: "/safety", icon: "/icons/safety.png", label: "safety" },
    { href: "/settings", icon: "/icons/settings.png", label: "setting" },
  ];

  return (
    <nav className={styles.bottomNav} aria-label="하단 네비게이션">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`${styles.navItem} ${
            pathname === item.href ? styles.active : ""
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
