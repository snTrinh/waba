
import React from "react";
import styles from "./WeatherDayCard.module.css";

type WeatherDayCardProps = {
  date: string; // ISO string from Open-Meteo
  high: number;
  low: number;
  precip: number;
};

const WeatherDayCard: React.FC<WeatherDayCardProps> = ({ date, high, low, precip }) => {
  const dayName = new Date(date).toLocaleDateString(undefined, { weekday: "short" });
  const monthDay = new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" });

  return (
    <div className={styles.card}>
      <div className={styles.day}>{dayName}</div>
      <div className={styles.date}>{monthDay}</div>
      <div className={styles.info}>High: {high.toFixed(1)}°C</div>
      <div className={styles.info}>Low: {low.toFixed(1)}°C</div>
      <div className={styles.info}>Precip: {precip.toFixed(1)} mm</div>
    </div>
  );
};

export default WeatherDayCard;
