"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import WeatherDayCard from "./WeatherDayCard";

export default function WeatherCardsList() {
  const { dailyForecast, status, error, selectedLocation } = useSelector(
    (state: RootState) => state.weather
  );

  if (status === "pending") {
    return <div>Loading weather for {selectedLocation?.name ?? "location"}...</div>;
  }

  if (status === "failed") {
    return <div className="text-red-500">Error fetching weather: {error}</div>;
  }

  if (!dailyForecast || dailyForecast.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 p-4">
      <h2 className="text-lg font-semibold mb-2">
        Forecast for {selectedLocation?.name ?? "Selected Location"}
      </h2>
      <div className="flex gap-4 flex-wrap">
        {dailyForecast.map((day, index) => (
          <WeatherDayCard
            key={index}
            date={day.date.toString()}
            high={day.high}
            low={day.low}
            precip={day.precip ?? 0}
          />
        ))}
      </div>
    </div>
  );
}
