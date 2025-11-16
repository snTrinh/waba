"use client";

import { mapCenter } from "@/config/mapConfig";
import { RootState } from "@/state/store";
import { setSelectedLocation } from "@/state/weatherSlice";
import { boulderingAreas } from "@/types/location";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./LeafletMap.module.css";

const LeafletMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<any>(null);
  const dispatch = useDispatch();
  const selectedLocation = useSelector(
    (state: RootState) => state.weather.selectedLocation
  );

  useEffect(() => {
    if (map.current || !mapContainer.current) return; 

    const container = mapContainer.current; 

    const initMap = async () => {
      try {
        const L = (await import("leaflet")).default;
        const { MaptilerLayer } = await import("@maptiler/leaflet-maptilersdk");

        map.current = L.map(container, {
          center: [mapCenter.lat, mapCenter.long],
          zoom: 7.5,
          scrollWheelZoom: false,
          doubleClickZoom: false,
          boxZoom: false,
        });

        new MaptilerLayer({
          apiKey: process.env.NEXT_PUBLIC_MAPTILER_API_KEY!,
          style: process.env.NEXT_PUBLIC_MAPTILER_STYLE_URL,
        }).addTo(map.current);

        boulderingAreas.forEach((spot) => {
          const circle = L.circle([spot.lat, spot.long], {
            radius: 6000,
            color: "green",
            fillOpacity: 0.4,
          }).addTo(map.current);

          const handleSelect = () => {
            if (
              !selectedLocation ||
              selectedLocation.lat !== spot.lat ||
              selectedLocation.long !== spot.long
            ) {
              dispatch(
                setSelectedLocation({
                  name: spot.name,
                  lat: spot.lat,
                  long: spot.long,
                })
              );
            }
          };

          circle.on("click", handleSelect);

          const customLabelIcon = L.divIcon({
            className: "custom-spot-label",
            html: `<span>${spot.name}</span>`,
            iconAnchor: [25, -15],
            iconSize: [100, 20],
          });

          L.marker([spot.lat, spot.long], { icon: customLabelIcon })
            .addTo(map.current)
            .on("click", handleSelect);
        });
      } catch (err) {
        console.error("Failed to initialize map:", err);
      }
    };

    initMap();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [dispatch]); 

  return (
    <div className={styles.mapWrap}>
      <div ref={mapContainer} className={styles.map}></div>
    </div>
  );
};

export default React.memo(LeafletMap);
