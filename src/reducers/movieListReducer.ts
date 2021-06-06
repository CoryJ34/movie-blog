import {
  breakoutTitleYearAndCategory,
  extractRating,
} from "../actions/TransferUtils";
import { Movie } from "../models/Movie";
import testData from "../data/test-data";
import categoryMeta from '../data/category-meta';

const initialState: any = {};

const ratingComparator = (a: Movie, b: Movie): number => {
  return parseFloat(b.rating) - parseFloat(a.rating);
}

const yearComparator = (a: Movie, b: Movie): number => {
  return parseInt(b.titleBreakout.year.substring(1,5)) - parseInt(a.titleBreakout.year.substring(1,5));
}

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
        categoryMeta
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
    case "movies/filterByTag": {
      return {
        ...state,
        currentFilter: action.filter,
        filteredMovies: state.movies.filter(
          (m: Movie) => (m.tags || []).includes(action.filter)
        ),
      };
    }
    case "movies/resetFilter": {
      return {
        ...state,
        currentFilter: null,
        filteredMovies: [...state.movies],
      };
    }
    case "movies/sort": {
      let comparator = (a: Movie, b: Movie) => {
        return parseInt(a.id, 10) - parseInt(b.id, 10);
      }

      if(action.sortField === 'Year') {
        comparator = yearComparator;
      }
      else if(action.sortField === 'Rating') {
        comparator = ratingComparator;
      }

      let sorted = [...state.filteredMovies].sort(comparator);

      if(action.sortDir === 'DESC') {
        sorted = sorted.reverse();
      }

      return {
        ...state,
        sortField: action.sortField,
        sortDir: action.sortDir,
        filteredMovies: sorted,
        movies: sorted
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
