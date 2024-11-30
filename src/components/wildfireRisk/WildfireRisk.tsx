import styles from "./WildfireRisk.module.css";

interface WildfireRiskProps {
  onClose: () => void;
}

export default function WildfireRisk({ onClose }: WildfireRiskProps) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Wildfire Risk</h1>
        <p className={styles.description}>
          This indicates the <span className={styles.bold}>RISK</span> of a wildfire occurring:
        </p>
        <ul className={styles.list}>
          <li>
            <span className={styles.low}>Low:</span> Minimal fire danger. No immediate precautions required.
          </li>
          <li>
            <span className={styles.medium}>Medium:</span> Moderate risk of wildfires. Dry vegetation and warm temperatures could cause fires.
          </li>
          <li>
            <span className={styles.high}>High:</span> Significant fire danger. Hot, dry weather with strong winds.
          </li>
          <li>
            <span className={styles.extreme}>Extreme:</span> Critical risk. Have an emergency plan in place, and stay updated.
          </li>
        </ul>
        <button className={styles.button} onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
}