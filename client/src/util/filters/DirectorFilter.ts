import FilterHandler from "../../models/FilterHandler";
import { Movie } from "../../models/Movie";

const DirectorFilter: FilterHandler = {
  matches: (m: Movie, filterValues: string[]): boolean => {
    return m.directors?.includes(filterValues[0]);
  },
};

export default DirectorFilter;
