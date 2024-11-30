import { Bell, Dot } from "lucide-react";
import styles from './NotificationBell.module.css';
import { useState } from "react";

interface NotificationBellProps {
  notify: boolean;
  clearNotifications: () => void;
  handleNotification: () => void;
}

export default function NotificationBell({
  notify,
  clearNotifications,
  handleNotification,
}: NotificationBellProps) {
  return (
    <>
      <div
        className={`${styles.notification}`}
        onClick={() => {
          handleNotification();
          clearNotifications();
        }}
      >
        <Bell size={32} color="#FAF8F8" className={`${styles.bell}`} />
        {notify && <Dot size={48} color="#F45D01" className={`${styles.dot}`} />}
      </div>
    </>
  );
}
