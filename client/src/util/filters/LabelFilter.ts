import FilterHandler from "../../models/FilterHandler";
import { Movie } from "../../models/Movie";

const LabelFilter: FilterHandler = {
  matches: (m: Movie, filterValues: string[]): boolean => {
    return filterValues.indexOf(m.label) >= 0;
  },
};

export default LabelFilter;
