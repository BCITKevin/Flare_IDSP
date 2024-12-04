// src/components/BottomNavBar.tsx
"use client";

import { usePathname } from "next/navigation";
import styles from "./BottomNavBar.module.css";
import Image from "next/image";
import Link from "next/link";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomeIcon, NewspaperIcon, Settings, ShieldCheck, CloudSunIcon } from "lucide-react";


// interface NavItem {
//   href: string;
//   icon: string;
//   label: string;
// }

// const BottomNavBar: React.FC = () => {
//   const pathname = usePathname();

//   const navItems: NavItem[] = [
//     { href: "/homepage", icon: "/icons/Home.png", label: "Home" },
//     { href: "/news", icon: "/icons/News.png", label: "News" },
//     { href: "/map", icon: "/icons/Weather.png", label: "Map" },
//     { href: "/safety", icon: "/icons/Safety.png", label: "Safety" },
//     { href: "/settings", icon: "/icons/Settings.png", label: "Settings" },
//   ];

//   return (
//     <div
//       className={`${styles.bottomNav} font-sans`}
//       aria-label="bottom navigation"
//     >
//       {navItems.map((item) => (
//         <Link
//           key={item.href}
//           href={item.href}
//           className={`${styles.navItem} ${pathname === item.href ? styles.active : ""
//             }`}
//           aria-current={pathname === item.href ? "page" : undefined}
//         >
//           <Image
//             src={item.icon}
//             alt={`${item.label} icon`}
//             width={24}
//             height={24}
//             className={styles.icon}
//           />
//           <span className={styles.label}>{item.label}</span>
//         </Link>
//       ))}
//     </div>
//   );
// };
// export default BottomNavBar;

export default function BottomNavBar() {
  const pathname = usePathname();
  const IconProps = {
    IconSize: 42,
  }

  return (
    <div className={styles.navContainer}>
      <Link href={"/homepage"} className={styles.navIcon}>
        <HomeIcon
          size={IconProps.IconSize}
          alt="Home Icon"
          className={`${styles.icon} ${pathname === '/homepage' ? styles.active : ''}`}
        />
        <p>Home</p>
      </Link>
      <Link href={"/news"} className={styles.navIcon}>
        <NewspaperIcon
          size={IconProps.IconSize}
          alt="News Icon"
          className={`${styles.icon} ${pathname ==='/news' ? styles.active:''}`}
        />
        <p>News</p>
      </Link>
      <Link href={"/map"} className={styles.navIcon}>
        <CloudSunIcon
          size={IconProps.IconSize}
          alt="Map Icon"
          className={`${styles.icon} ${pathname ==='/map' ? styles.active:''}`}
        />
        <p>Map</p>
      </Link>
      <Link href={"/safety"} className={styles.navIcon}>
        <ShieldCheck
          size={IconProps.IconSize}
          alt="Safety Icon"
          className={`${styles.icon} ${pathname ==='/safety' ? styles.active:''}`}
        />
        <p>Safety</p>
      </Link>
      <Link href={"/settings"} className={styles.navIcon}>
        <Settings
          size={IconProps.IconSize}
          alt="Settings Icon"
          className={`${styles.icon} ${pathname ==='/settings' ? styles.active:''}`}
        />
        <p>Setting</p>
      </Link>
    </div>
  );
}
