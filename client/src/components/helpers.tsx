export const multipleSpeciesStringConverter = (species: string) => {
  if (species === "bunny") {
    return "Bunnies";
  } else {
    return species ? species.charAt(0).toUpperCase() + species.slice(1) + "s" : "Unknown Species";

  }
};
