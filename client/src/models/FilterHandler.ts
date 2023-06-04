import { Movie } from "./Movie";

interface FilterHandler {
  matches: (m: Movie, filterValues: string[]) => boolean;
}

export default FilterHandler;
