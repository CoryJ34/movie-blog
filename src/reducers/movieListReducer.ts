import {
  breakoutTitleYearAndCategory,
  extractRating,
} from "../actions/TransferUtils";
import { Movie } from "../models/Movie";
import testData from "../data/test-data";
import categoryMeta from "../data/category-meta";
import { Filter, FilterType } from "../models/Filter";

interface StateType {
  movies: Movie[] | null;
  filteredMovies: Movie[] | null;
  filters: Filter[] | null;
  sortField: string | null;
  sortDir: string | null;
}

const initialState: StateType = {
  movies: null,
  filteredMovies: null,
  filters: null,
  sortField: null,
  sortDir: null,
};

const ratingComparator = (a: Movie, b: Movie): number => {
  return parseFloat(b.rating) - parseFloat(a.rating);
};

const yearComparator = (a: Movie, b: Movie): number => {
  return (
    parseInt(b.titleBreakout.year.substring(1, 5)) -
    parseInt(a.titleBreakout.year.substring(1, 5))
  );
};

const filterMovies = (movies: Movie[], filters: Filter[]) => {
  return movies.filter((m: Movie) => {
    for (let i = 0; i < filters.length; i++) {
      const f = filters[i];

      if (f.type === FilterType.TAG) {
        if ((m.tags || []).indexOf(f.value) < 0) {
          return false;
        }
      } else if (f.type === FilterType.WATCHLIST) {
        if (m.titleBreakout.category !== f.value) {
          return false;
        }
      }
      // TODO: implement year/decade
      else {
        return false;
      }
    }

    return true;
  });
};

export default function movieListReducer(state = initialState, action: any) {
  switch (action.type) {
    case "movies/load": {
      const allMovies = testData.map((original: any) => {
        return {
          ...original,
          rating: parseFloat(extractRating(original).split("/")[0].trim()),
          titleBreakout: breakoutTitleYearAndCategory(original.title),
        };
      });

      return {
        ...state,
        movies: allMovies,
        filteredMovies: [...allMovies],
        categoryMeta,
      };
    }
    case "movies/applyFilter": {
      const { filter } = action;
      let existingFilters = state.filters || [];
      if (
        !existingFilters.find(
          (f: Filter) => f.type === filter.type && f.value === filter.value
        )
      ) {
        existingFilters.push({ type: filter.type, value: filter.value });
      }

      return {
        ...state,
        filters: existingFilters,
        filteredMovies: filterMovies(state.movies || [], existingFilters),
      };
    }
    case "movies/removeFilter": {
      const { filter } = action;
      let existingFilters = state.filters || [];
      existingFilters = existingFilters.filter(
        (f) => !(f.type === filter.type && f.value === filter.value)
      );

      return {
        ...state,
        filters: existingFilters,
        filteredMovies: filterMovies(state.movies || [], existingFilters),
      };
    }
    case "movies/filterByCategory": {
      return {
        ...state,
        currentFilter: action.filter,
        filteredMovies: (state.movies || []).filter(
          (m: Movie) => action.filter === m.titleBreakout.category
        ),
      };
    }
    case "movies/filterByTag": {
      return {
        ...state,
        currentFilter: action.filter,
        filteredMovies: (state.movies || []).filter((m: Movie) =>
          (m.tags || []).includes(action.filter)
        ),
      };
    }
    case "movies/resetFilter": {
      return {
        ...state,
        currentFilter: null,
        filters: [],
        filteredMovies: [...(state.movies || [])],
      };
    }
    case "movies/sort": {
      let comparator = (a: Movie, b: Movie) => {
        return parseInt(a.id, 10) - parseInt(b.id, 10);
      };

      if (action.sortField === "Year") {
        comparator = yearComparator;
      } else if (action.sortField === "Rating") {
        comparator = ratingComparator;
      }

      let sorted = [...(state.filteredMovies || [])].sort(comparator);

      if (action.sortDir === "DESC") {
        sorted = sorted.reverse();
      }

      return {
        ...state,
        sortField: action.sortField,
        sortDir: action.sortDir,
        filteredMovies: sorted
      };
    }
    case "movies/resetSort": {
      return {
        ...state,
        sortField: null,
        sortDir: null,
        filteredMovies: filterMovies((state.movies || []), (state.filters || []))
      };
    }
    default:
      return state;
  }
}
