import FilterHandler from "../../models/FilterHandler";
import { Movie } from "../../models/Movie";

const WatchlistFilter: FilterHandler = {
  matches: (m: Movie, filterValues: string[]): boolean => {
    return filterValues.indexOf(m.category) >= 0;
  },
};

export default WatchlistFilter;
