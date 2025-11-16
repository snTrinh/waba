import data from "../data/boulderingLocations.json";

export type CragLocation = {
  name: string;
  lat: number;
  long: number;
};

export const boulderingAreas = data as CragLocation[];
