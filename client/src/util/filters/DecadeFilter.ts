import FilterHandler from "../../models/FilterHandler";
import { Movie } from "../../models/Movie";

const DecadeFilter: FilterHandler = {
  matches: (m: Movie, filterValues: string[]): boolean => {
    if (filterValues.indexOf(m.year.toString().substring(0, 3) + "0") < 0) {
      return false;
    }

    return true;
  },
};

export default DecadeFilter;
