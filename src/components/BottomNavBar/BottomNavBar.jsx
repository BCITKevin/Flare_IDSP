// src/components/BottomNavBar.tsx
"use client";

import { usePathname } from "next/navigation";
import styles from "./BottomNavBar.module.css";
import Image from "next/image";
import Link from "next/link";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomeIcon, NewspaperIcon, CogIcon, ShieldCheck, MapIcon } from "lucide-react";


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
  const IconProps = {
    IconSize: 48,
  }

  return (
    <div>
      <Link href={"/homepage"}>
        <HomeIcon
          size={IconProps.IconSize}
          alt="Home Icon"
          className={styles.icon}
        />
      </Link>
      <Link href={"/news"}>
        <NewspaperIcon
          size={IconProps.IconSize}
          alt="News Icon"
          className={styles.icon}
        />
      </Link>
      <Link href={"/map"}>
        <MapIcon
          size={IconProps.IconSize}
          alt="Map Icon"
          className={styles.icon}
        />
      </Link>
      <Link href={"/safety"}>
        <ShieldCheck
          size={IconProps.IconSize}
          alt="Safety Icon"
          className={styles.icon}
        />
      </Link>
      <Link href={"/settings"}>
        <CogIcon
          size={IconProps.IconSize}
          alt="Settings Icon"
          className={styles.icon}
        />
      </Link>
    </div>
  );
}
