import {
  breakoutTitleYearAndCategory,
  extractRating,
} from "../util/TransferUtils";
import { Movie } from "../models/Movie";
// import lboxData from "../data/lbox-data";
// import categoryMeta from "../data/category-meta";
// import milestoneData from "../data/milestones";
import {
  AvailableFilters,
  Filter,
  FilterMap,
  FilterType,
} from "../models/Filter";
import ReferenceMap from "../models/ReferenceMap";
import { buildChartData } from "../util/ChartUtils";
import sort from "../util/SortUtils";
import filterMovies, {
  gatherAvailableFilters,
  makeDefaultDateFilters,
  stringifyFilter,
} from "../util/FilterUtils";
import findMovieReferences from "../util/ReferenceUtils";
import makeWatchListRanges from "../util/WatchListRangeUtils";
import { Milestone } from "../models/Milestone";

interface StateType {
  movies: Movie[] | null;
  filteredMovies: Movie[] | null;
  filters: FilterMap | null;
  availableFilters: AvailableFilters;
  sortField: string | null;
  sortDir: string | null;
  chartData: any;
  references: ReferenceMap | null;
  watchListRanges: any[] | null;
  milestones: Milestone[] | null;
  earliestMovieYear: number;
  latestMovieYear: number;
}

const initialState: StateType = {
  movies: null,
  filteredMovies: null,
  availableFilters: {},
  filters: null,
  sortField: null,
  sortDir: null,
  chartData: null,
  references: null,
  watchListRanges: null,
  milestones: null,
  earliestMovieYear: 1800,
  latestMovieYear: 3000,
};

export default function movieListReducer(state = initialState, action: any) {
  switch (action.type) {
    case "movies/load": {
      const { lboxData, movieData, categoryData, milestoneData, content } =
        action.payload;
      let lboxMap = {};

      lboxData.forEach((lb: any) => {
        // @ts-ignore
        lboxMap[lb.id] = lb;
      });

      const allMovies = movieData.map((original: any) => {
        const rating = parseFloat(extractRating(original).split("/")[0].trim());

        // @ts-ignore
        const lbox = lboxMap[original.id];

        return {
          ...original,
          rating,
          titleBreakout: breakoutTitleYearAndCategory(original.title),
          lbox,
          runtimeMins: parseInt(lbox.runtime.split(" ")[0]),
          // @ts-ignore
          ratingDiff: (rating - parseFloat(lbox.rating) * 2).toFixed(2),
        };
      });

      const filteredMovies: Movie[] = [...allMovies];

      let earliestMovieYear = 3000;
      let latestMovieYear = 1800;

      allMovies.forEach((m: Movie) => {
        if (m.titleBreakout.rawYear < earliestMovieYear) {
          earliestMovieYear = m.titleBreakout.rawYear;
        }
        if (m.titleBreakout.rawYear > latestMovieYear) {
          latestMovieYear = m.titleBreakout.rawYear;
        }
      });

      return {
        ...state,
        bottomNav: content.bottomNav,
        movies: allMovies,
        filteredMovies,
        availableFilters: gatherAvailableFilters(allMovies),
        chartData: buildChartData(filteredMovies),
        categoryMeta: categoryData,
        references: findMovieReferences(allMovies),
        watchListRanges: makeWatchListRanges(filteredMovies),
        milestones: milestoneData.reverse(),
        filters: makeDefaultDateFilters(allMovies),
        earliestMovieYear,
        latestMovieYear,
      };
    }
    case "movies/applyFilter": {
      const { filter } = action;
      let existingFilters: FilterMap = {};
      const filtersFromState = state.filters || {};

      Object.keys(filtersFromState).forEach((fk) => {
        // special case to ensure only one start/end date
        // remove start dates or end dates if a new one is coming in
        // otherwise just add the filters normally to existingFilters
        if (filter.type === FilterType.START_DATE) {
          if (filtersFromState[fk].type !== FilterType.START_DATE) {
            existingFilters[fk] = filtersFromState[fk];
          }
        } else if (filter.type === FilterType.END_DATE) {
          if (filtersFromState[fk].type !== FilterType.END_DATE) {
            existingFilters[fk] = filtersFromState[fk];
          }
        } else if (filter.type === FilterType.YEAR_START) {
          if (filtersFromState[fk].type !== FilterType.YEAR_START) {
            existingFilters[fk] = filtersFromState[fk];
          }
        } else if (filter.type === FilterType.YEAR_END) {
          if (filtersFromState[fk].type !== FilterType.YEAR_END) {
            existingFilters[fk] = filtersFromState[fk];
          }
        } else {
          existingFilters[fk] = filtersFromState[fk];
        }
      });

      existingFilters[stringifyFilter(filter)] = filter;

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
      let existingFilters = state.filters || {};

      // @ts-ignore
      delete existingFilters[stringifyFilter(filter)];

      if (filter.type === FilterType.START_DATE) {
        const defaultFilters = makeDefaultDateFilters(state.movies || []);
        const firstKey = Object.keys(defaultFilters)[0];
        existingFilters[firstKey] = defaultFilters[firstKey];
      } else if (filter.type === FilterType.END_DATE) {
        const defaultFilters = makeDefaultDateFilters(state.movies || []);
        const secondKey = Object.keys(defaultFilters)[1];
        existingFilters[secondKey] = defaultFilters[secondKey];
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
    case "movies/resetFilter": {
      const unfiltered = [...(state.movies || [])];

      return {
        ...state,
        filters: makeDefaultDateFilters(unfiltered),
        filteredMovies: unfiltered,
        chartData: buildChartData(unfiltered),
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
        filteredMovies: filterMovies(state.movies || [], state.filters || {}),
      };
    }
    default:
      return state;
  }
}
