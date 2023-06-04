import FilterHandler from "../../models/FilterHandler";
import { Movie } from "../../models/Movie";

const StartDateFilter: FilterHandler = {
  matches: (m: Movie, filterValues: string[]): boolean => {
    return parseInt(filterValues[0]) <= new Date(m.date).getTime();
  },
};

export default StartDateFilter;
