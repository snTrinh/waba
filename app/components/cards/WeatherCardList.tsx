"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import WeatherDayCard from "./WeatherDayCard";
import { Status } from "@/types/status";
import { setSelectedDay } from "@/state/weatherSlice";


export default function WeatherCardsList() {
  const { dailyForecast, status, error, selectedLocation, selectedDay } =
    useSelector((state: RootState) => state.weather);
  const dispatch = useDispatch<AppDispatch>();

 
  if (status === Status.PENDING) {
    return (
      <div>Loading weather for {selectedLocation?.name ?? "location"}...</div>
    );
  }

  if (status === Status.FAILED) {
    return <div className="text-red-500">Error fetching weather: {error}</div>;
  }

  if (!dailyForecast || dailyForecast.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold mb-2">
        Forecast for {selectedLocation?.name ?? "Selected Location"}
      </h2>
      <div className="flex gap-4 flex-wrap">
      {dailyForecast.map((day) => (
        <WeatherDayCard
          key={day.date}
          date={day.date}
          high={day.high}
          low={day.low}
          precip={day.precip}
          onClick={() => dispatch(setSelectedDay(day.date))}
        />
      ))}
      </div>
    </div>
  );
}
