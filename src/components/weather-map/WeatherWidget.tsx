import { Cloud } from 'lucide-react';
import styles from './WeatherMap.module.css';

export const WeatherWidget = ({ temperature }) => {
  return (
    <div className={styles.weatherWidget}>
      <div className={styles.weatherTemp}>{temperature}°</div>
      <Cloud size={20} />
    </div>
  );
};