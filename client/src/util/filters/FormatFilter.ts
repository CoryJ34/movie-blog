import FilterHandler from "../../models/FilterHandler";
import { Movie } from "../../models/Movie";

const FormatFilter: FilterHandler = {
  matches: (m: Movie, filterValues: string[]): boolean => {
    return filterValues.indexOf(m.format) >= 0;
  },
};

export default FormatFilter;
