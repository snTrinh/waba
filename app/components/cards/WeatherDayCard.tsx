import React from "react";
import styles from "./WeatherDayCard.module.css";

type WeatherDayCardProps = {
  date: string;
  high: number;
  low: number;
  precip: number;
  onClick?: () => void;
};

const WeatherDayCard: React.FC<WeatherDayCardProps> = ({
  date,
  high,
  low,
  precip,
  onClick,
}) => {
  const localDate = new Date(`${date}T12:00:00`);

  const dayName = localDate.toLocaleDateString(undefined, { weekday: "short" });
  const monthDay = localDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className={`${styles.card}`}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <div className={styles.day}>{dayName}</div>
      <div className={styles.date}>{monthDay}</div>
      <div className={styles.info}>High: {high.toFixed(1)}°C</div>
      <div className={styles.info}>Low: {low.toFixed(1)}°C</div>
      <div className={styles.info}>Precip: {precip.toFixed(1)} mm</div>
    </div>
  );
};

export default WeatherDayCard;
