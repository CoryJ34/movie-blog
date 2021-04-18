import {
  breakoutTitleYearAndCategory,
  extractRating,
} from "../actions/TransferUtils";
import { Movie } from "../models/Movie";
import testData from "../test-data";

const initialState: any = {};

export default function movieListReducer(state = initialState, action: any) {
  switch (action.type) {
    case "movies/load": {
      return {
        ...state,
        movies: testData.map((original: any) => {
          return {
            ...original,
            rating: parseFloat(extractRating(original).split("/")[0].trim()),
            titleBreakout: breakoutTitleYearAndCategory(original.title),
          };
        }),
      };
    }
    case "movies/filterByCategory": {
      return {
        ...state,
        currentFilter: action.filter,
        filteredMovies: state.movies.filter(
          (m: Movie) => action.filter === m.titleBreakout.category
        ),
      };
    }
    case "movies/resetFilter": {
      return {
        ...state,
        currentFilter: null,
        filteredMovies: null,
      };
    }
    case "movies/sort": {
      return {
        ...state,
        sortField: action.sortField,
        sortDir: action.sortDir,
        filteredMovies: [...(state.movies || state.filteredMovies)].sort(
          (a, b) => {
            if (action.sortDir === "ASC") {
              return a[action.sortField] - b[action.sortField];
            }
            return b[action.sortField] - a[action.sortField];
          }
        ),
      };
    }
    case "movies/resetSort": {
      return {
        ...state,
        sortField: null,
        sortDir: null,
      };
    }
    default:
      return state;
  }
}
