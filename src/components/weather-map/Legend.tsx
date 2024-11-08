import { Info } from 'lucide-react';
import styles from './WeatherMap.module.css';

const FWI_SCALE = [
  { class: 0, range: '<5.2', level: 'Very Low', color: '#126E00' },
  { class: 1, range: '5.2-11.2', level: 'Low', color: '#FFEB3B' },
  { class: 2, range: '11.2-21.3', level: 'Moderate', color: '#ED8E3E' },
  { class: 3, range: '21.3-38.0', level: 'High', color: '#FF0000' },
  { class: 4, range: '38.0-50.0', level: 'Very High', color: '#890000' },
  { class: 5, range: '≥50', level: 'Extreme', color: '#4A0404' }
];

const getLegendDescription = (level) => {
  switch(level) {
    case 'Very Low':
      return 'Minimal Risk; fires are unlikely to spread significantly.';
    case 'Low':
      return 'Low spread potential; fires generally manageable.';
    case 'Moderate':
      return 'Moderate spread potential; usually manageable under standard conditions.';
    case 'High':
      return 'Significant spread risk; would require more resources to control.';
    case 'Very High':
      return 'Rapid fire spread is likely, with challenging containment.';
    case 'Extreme':
      return 'Fires would spread aggressively and be extremely difficult to control.';
    default:
      return '';
  }
};

export const MapLegend = ({ show, onToggle }) => {
  return (
    <div className={styles.legendControl}>
      <button 
        className={styles.mapButton} 
        onClick={onToggle}
        aria-label="Toggle legend"
      >
        <Info />
      </button>
      <div className={`${styles.legendContent} ${show ? styles.visible : ''}`}>
        <h4 className={styles.legendTitle}>Legend</h4>
        {FWI_SCALE.map(({ class: classNum, level, color }) => (
          <div key={classNum} className={styles.legendItem}>
            <div 
              className={styles.legendMarker} 
              style={{ backgroundColor: color }}
            />
            <div className={styles.legendText}>
              <div className={styles.legendLevel}>Class {classNum}: {level}</div>
              <div className={styles.legendDescription}>
                {getLegendDescription(level)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};