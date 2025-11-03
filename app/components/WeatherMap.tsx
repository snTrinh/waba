import React, { useRef, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import styles from "./WeatherMap.module.css";
import { useDispatch } from "react-redux";
import { setSelectedLocation } from "@/state/weatherSlice";
import { mapCenter } from "@/config/mapConfig";
import { boulderingAreas } from "@/types/location";

const WeatherMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<any>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    let initialized = false;

    (async () => {
      if (map.current || !mapContainer.current) return;

      try {
        const L = (await import("leaflet")).default;
        const { MaptilerLayer, MapStyle } = await import(
          "@maptiler/leaflet-maptilersdk"
        );


        map.current = new L.Map(mapContainer.current!, {
          center: L.latLng(mapCenter.lat, mapCenter.long),
          zoom: 7.5,
          scrollWheelZoom: false, 
          doubleClickZoom: false, 
          boxZoom: false,
        //   zoomControl: false, 
        });

        const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;
        if (!apiKey) {
            throw new Error("MapTiler API key is missing. Please set NEXT_PUBLIC_MAPTILER_API_KEY in .env.local");
          }
        const styleURL = process.env.NEXT_PUBLIC_MAPTILER_STYLE_URL;
        new MaptilerLayer({
          apiKey: apiKey,
          style: styleURL, 
        }).addTo(map.current);


        map.current.invalidateSize();
        boulderingAreas.forEach((spot) => {
          const circle = L.circle([spot.lat, spot.long], {
            radius: 6000,
            color: "green",
            fillOpacity: 0.4,
          }).addTo(map.current);

          circle.on("click", () => {
            dispatch(
              setSelectedLocation({
                name: spot.name,
                lat: spot.lat,
                long: spot.long, 
              })
            );
          });


          const customLabelIcon = L.divIcon({
            className: "custom-spot-label", 
            html: `<span>${spot.name}</span>`,
            iconAnchor: [25, -15], 
            iconSize: [100, 20],
          });

          L.marker([spot.lat, spot.long], {
            icon: customLabelIcon,
          })
            .addTo(map.current)
            .on("click", () => {
              dispatch(
                setSelectedLocation({
                  name: spot.name,
                  lat: spot.lat,
                  long: spot.long, 
                })
              );
            });
        });

        initialized = true;
      } catch (error) {
        console.error("Failed to initialize map:", error);
      }
    })();


    return () => {
      if (map.current && initialized) {
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

export default React.memo(WeatherMap);
