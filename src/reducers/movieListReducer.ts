import {
  breakoutTitleYearAndCategory,
  extractRating,
} from "../util/TransferUtils";
import { Movie } from "../models/Movie";
import testData from "../data/test-data";
import categoryMeta from "../data/category-meta";
import milestoneData from "../data/milestones";
import { Filter } from "../models/Filter";
import ReferenceMap from "../models/ReferenceMap";
import { buildChartData } from "../util/ChartUtils";
import sort from "../util/SortUtils";
import filterMovies from "../util/FilterUtils";
import findMovieReferences from "../util/ReferenceUtils";
import makeWatchListRanges from "../util/WatchListRangeUtils";
import { Milestone } from "../models/Milestone";

interface StateType {
  movies: Movie[] | null;
  filteredMovies: Movie[] | null;
  filters: Filter[] | null;
  sortField: string | null;
  sortDir: string | null;
  chartData: any;
  references: ReferenceMap | null;
  watchListRanges: any[] | null;
  milestones: Milestone[] | null;
}

const initialState: StateType = {
  movies: null,
  filteredMovies: null,
  filters: null,
  sortField: null,
  sortDir: null,
  chartData: null,
  references: null,
  watchListRanges: null,
  milestones: null
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

      const filteredMovies: Movie[] = [...allMovies];

      return {
        ...state,
        movies: allMovies,
        filteredMovies,
        chartData: buildChartData(filteredMovies),
        categoryMeta,
        references: findMovieReferences(allMovies),
        watchListRanges: makeWatchListRanges(filteredMovies),
        milestones: milestoneData.reverse()
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

      const filtered = filterMovies(state.movies || [], existingFilters);

      return {
        ...state,
        filters: existingFilters,
        filteredMovies: sort(filtered, state.sortField, state.sortDir),
        chartData: buildChartData(filtered),
        watchListRanges: makeWatchListRanges(filtered),
      };
    }
    case "movies/removeFilter": {
      const { filter } = action;
      let existingFilters = state.filters || [];
      existingFilters = existingFilters.filter(
        (f) => !(f.type === filter.type && f.value === filter.value)
      );

      const filtered = filterMovies(state.movies || [], existingFilters);

      return {
        ...state,
        filters: existingFilters,
        filteredMovies: sort(filtered, state.sortField, state.sortDir),
        chartData: buildChartData(filtered),
        watchListRanges: makeWatchListRanges(filtered),
      };
    }
    case "movies/resetFilter": {
      return {
        ...state,
        currentFilter: null,
        filters: [],
        filteredMovies: [...(state.movies || [])],
        watchListRanges: makeWatchListRanges(state.movies || []),
      };
    }
    case "movies/sort": {
      return {
        ...state,
        sortField: action.sortField,
        sortDir: action.sortDir,
        filteredMovies: sort(
          state.filteredMovies,
          action.sortField,
          action.sortDir
        ),
      };
    }
    case "movies/resetSort": {
      return {
        ...state,
        sortField: null,
        sortDir: null,
        filteredMovies: filterMovies(state.movies || [], state.filters || []),
      };
    }
    default:
      return state;
  }
}
