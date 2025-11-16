"use client";

import { Box, Tab, Tabs } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@/state/store";
import { fetchWeather } from "@/state/weatherSlice";
import WeatherCardsList from "./components/cards/WeatherCardList";
import WeatherChart from "./components/chart/WeatherChart";
import LeaftletMap from "./components/map/LeafletMap";
import StaticMap from "./components/staticMap/StaticMap";

export default function Home() {
  const [tab, setTab] = useState<number>(0);
  const dispatch = useDispatch<AppDispatch>();

  const { selectedLocation } = useSelector((state: RootState) => state.weather);

  const fetchWeatherForSelectedLocation = useCallback(() => {
    const { lat, long, name } = selectedLocation;
    if (lat !== 0 && long !== 0 && name) {
      dispatch(fetchWeather({ lat, lon: long }));
    }
  }, [selectedLocation, dispatch]);

  useEffect(() => {
    fetchWeatherForSelectedLocation();
  }, [fetchWeatherForSelectedLocation]);

  const tabs = [
    { label: "Leaflet", component: <LeaftletMap /> },
    { label: "Static", component: <StaticMap /> },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)} centered>
        {tabs.map((t, index) => (
          <Tab key={index} label={t.label} />
        ))}
      </Tabs>

      <Box sx={{ mt: 2 }}>
        <div className="flex w-full flex-col items-center align-center py-10 px-16">
          <div>Select a climbing spot on the map to see the forecast.</div>

          {tabs[tab].component}
          <WeatherCardsList />
          <WeatherChart />
        </div>
      </Box>
    </Box>
  );
}
