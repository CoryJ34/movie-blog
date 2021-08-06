import { Filter, FilterType } from "../models/Filter";
import { Movie } from "../models/Movie";

const filterMovies = (movies: Movie[], filters: Filter[]) => {
  return movies.filter((m: Movie) => {
    for (let i = 0; i < filters.length; i++) {
      const f = filters[i];

      if (f.type === FilterType.TAG) {
        if ((m.tags || []).indexOf(f.value) < 0) {
          return false;
        }
      } else if (f.type === FilterType.LABEL) {
        if (m.label !== f.value) {
          return false;
        }
      } else if (f.type === FilterType.FORMAT) {
        if (m.format !== f.value) {
          return false;
        }
      } else if (f.type === FilterType.WATCHLIST) {
        if (m.titleBreakout.category !== f.value) {
          return false;
        }
      } else if (f.type === FilterType.YEAR) {
        if (m.titleBreakout.year.substr(1, 4) !== f.value) {
          return false;
        }
      } else if (f.type === FilterType.DECADE) {
        if (m.titleBreakout.year.substr(1, 3) !== f.value.substr(0, 3)) {
          return false;
        }
      } else {
        return false;
      }
    }

    return true;
  });
};

export default filterMovies;
