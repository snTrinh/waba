import data from "../data/boulderingLocations.json";

export type Location = {
    name: string;
    lat: number;
    long: number;
  };

  export const boulderingAreas = data as Location[];