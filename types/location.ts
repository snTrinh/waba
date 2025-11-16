import data from "../data/boulderingLocations.json";

export type CragLocation = {
  name: string;
  lat: number;
  long: number;
};

export enum Crag {
  BigChoss = "Big Choss",
  Calgary = "Calgary",
  Cathedral = "Cathedral",
  FrankSlide = "Frank Slide",
  Highwood = "Highwood",
  Skyline = "Skyline",
}

export const boulderingAreas = data as CragLocation[];
