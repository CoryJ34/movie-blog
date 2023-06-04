import FilterHandler from "../../models/FilterHandler";
import { Movie } from "../../models/Movie";

const YearFilter: FilterHandler = {
  matches: (m: Movie, filterValues: string[]): boolean => {
    if (filterValues.indexOf(m.year.toString()) < 0) {
      return false;
    }

    return true;
  },
};

export default YearFilter;
