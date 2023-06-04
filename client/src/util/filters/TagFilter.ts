import FilterHandler from "../../models/FilterHandler";
import { Movie } from "../../models/Movie";

const TagFilter: FilterHandler = {
  matches: (m: Movie, filterValues: string[]): boolean => {
    let hasTag = false;

    (m.tags || []).forEach((tag) => {
      if (filterValues.indexOf(tag) >= 0) {
        hasTag = true;
      }
    });

    return hasTag;
  },
};

export default TagFilter;
