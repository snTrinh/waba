"use client";
import { setSelectedLocation } from "@/state/weatherSlice";
import { boulderingAreas } from "@/types/location";
import { generateMarkersFromLocations, gpsToMap } from "@/utils/gps";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

export type MapMarker = {
  name: string;
  pixel: {
    x: number;
    y: number;
  };

  gps: {
    lat: number;
    long: number;
  };
};

export default function StaticMap() {
  const imgRef = useRef<HTMLImageElement>(null);
  const [renderTick, setRenderTick] = useState(0);
  const dispatch = useDispatch();
  const w = imgRef.current?.clientWidth ?? 1;
  const h = imgRef.current?.clientHeight ?? 1;
  const markers: MapMarker[] = generateMarkersFromLocations(
    boulderingAreas,
    w,
    h
  );

  const handleImageLoad = () => {
    setRenderTick((t) => t + 1);
  };

  useEffect(() => {
    const handleResize = () => setRenderTick((t) => t + 1);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onMarkerClick = (marker: MapMarker) => {
    dispatch(
      setSelectedLocation({
        name: marker.name,
        lat: marker.gps.lat,
        long: marker.gps.long,
      })
    );
  };

  return (
    <div className="relative w-full max-w-6xl">
      <img
        ref={imgRef}
        src="/locations.png"
        alt="Static Map"
        className="w-full h-auto"
        draggable={false}
        onLoad={handleImageLoad}
      />

      {markers.map((m) => {
        const w = imgRef.current?.clientWidth ?? 1;
        const h = imgRef.current?.clientHeight ?? 1;
        const pixel = gpsToMap(m.gps.lat, m.gps.long, w, h);
        const markerSize = Math.max(10, Math.min(80, (w / 2417) * 80));
        return (
          <div
          key={m.name}
            onClick={() => onMarkerClick(m)}
            className="absolute rounded-full cursor-pointer"
            style={{
              width: `${markerSize}px`,
              height: `${markerSize}px`,
              backgroundColor: "rgba(0,128,0,0.4)",
              border: "2px solid green",
              transform: "translate(-50%, -50%)",
              left: pixel.x,
              top: pixel.y,
            }}
          />
        );
      })}
    </div>
  );
}
