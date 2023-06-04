import FilterHandler from "../../models/FilterHandler";
import { Movie } from "../../models/Movie";

const CastFilter: FilterHandler = {
  matches: (m: Movie, filterValues: string[]): boolean => {
    return m.cast?.includes(filterValues[0]);
  },
};

export default CastFilter;
