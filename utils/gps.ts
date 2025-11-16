
import { CragLocation } from "@/types/location";
  
  
  const REF = {
    calgary: {
      lat: 51.0447,
      long: -114.0719,
      x: 1487,
      y: 401,
    },
    cathedral: {
      lat: 51.431349,
      long: -116.4025712,
      x: 670,
      y: 190,
    },
  };
  

export function gpsToMap(lat: number, long: number, imgWidth: number, imgHeight: number) {
    const A = REF.calgary;
    const B = REF.cathedral;
  
    const fx = (long - A.long) / (B.long - A.long);
    const fy = (lat - A.lat) / (B.lat - A.lat);
  
    const xOriginal = A.x + fx * (B.x - A.x);
    const yOriginal = A.y + fy * (B.y - A.y);
  
    const scaledX = (xOriginal / 2417) * imgWidth; 
    const scaledY = (yOriginal / 1380) * imgHeight; 
  
    return { x: scaledX, y: scaledY };
  }
  
  
  
  export function generateMarkersFromLocations(
    locations: CragLocation[],
    imgWidth: number,
    imgHeight: number
  ) {
    return locations.map((loc) => {
      const pixel = gpsToMap(loc.lat, loc.long, imgWidth, imgHeight);
      return {
        id: loc.name.toLowerCase().replace(/\s+/g, "-"),
        name: loc.name,
        pixel: {
          x: Number(pixel.x.toFixed(1)),
          y: Number(pixel.y.toFixed(1)),
        },
        gps: {
          lat: loc.lat,
          long: loc.long,
        },
      };
    });
  }
  