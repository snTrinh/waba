import { boulderingAreas, Crag, CragLocation } from "@/types/location";

// these reference points are based on a 2417x1380 image of the climbing areas
const REF = {
  calgary: {
    ...findLocation(Crag.Calgary)!,
    x: 1487, 
    y: 401,
  },
  cathedral: {
    ...findLocation(Crag.Cathedral)!,
    x: 670,
    y: 190,
  },
};

function findLocation(name: string) {
  return boulderingAreas.find(
    (loc) => loc.name.toLowerCase() === name.toLowerCase()
  );
}

export function gpsToMap(
  lat: number,
  long: number,
  imgWidth: number,
  imgHeight: number
) {
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
    //   id: loc.name.toLowerCase().replace(/\s+/g, "-"),
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
