import FilterHandler from "../../models/FilterHandler";
import { Movie } from "../../models/Movie";

const GenreFilter: FilterHandler = {
  matches: (m: Movie, filterValues: string[]): boolean => {
    return m.genres?.includes(filterValues[0]);
  },
};

export default GenreFilter;
