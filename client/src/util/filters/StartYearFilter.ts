import FilterHandler from "../../models/FilterHandler";
import { Movie } from "../../models/Movie";

const StartYearFilter: FilterHandler = {
  matches: (m: Movie, filterValues: string[]): boolean => {
    return parseInt(filterValues[0], 10) <= m.year;
  },
};

export default StartYearFilter;
