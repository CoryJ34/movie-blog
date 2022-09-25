import { Movie } from "../models/Movie";
import { AvailableFilters, FilterMap } from "../models/Filter";
import ReferenceMap from "../models/ReferenceMap";
import { buildChartData } from "../util/ChartUtils";
import sort from "../util/SortUtils";
import filterMovies, {
  addFilter,
  gatherAvailableFilters,
  makeDefaultDateFilters,
  removeFilter,
} from "../util/FilterUtils";
import findMovieReferences from "../util/ReferenceUtils";
import makeWatchListRanges from "../util/WatchListRangeUtils";
import { Milestone } from "../models/Milestone";
import { USE_SERVER_SIDE_FILTERING } from "../configuration/Configuration";
import { collectMovieData, convertToViewModel } from "../util/DataUtils";

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
      const {
        milestoneData,
        content,
        remoteMovieData,
        remoteFilteredMovieData,
        categories,
      } = action.payload;

      const allMovies = convertToViewModel(remoteMovieData);
      const filteredMovies = USE_SERVER_SIDE_FILTERING
        ? convertToViewModel(remoteFilteredMovieData)
        : [...allMovies];

      const {
        earliestMovieYear,
        latestMovieYear,
        castSet,
        directorSet,
        genreSet,
        topCast,
        topDirectors,
        topGenres,
      } = collectMovieData(filteredMovies);

      // build state
      return {
        ...state,
        bottomNav: content.bottomNav,
        movies: allMovies,
        filteredMovies,
        availableFilters: gatherAvailableFilters(allMovies, categories),
        chartData: buildChartData(filteredMovies),
        references: findMovieReferences(allMovies),
        watchListRanges: makeWatchListRanges(filteredMovies),
        milestones: milestoneData.reverse(),
        filters: state.filters
          ? state.filters
          : makeDefaultDateFilters(allMovies),
        earliestMovieYear,
        latestMovieYear,
        categories,
        sortField: state.sortField || "WatchedDate",
        sortDir: state.sortDir || "ASC",
        allDirectors: Array.from(directorSet).sort(),
        allCast: Array.from(castSet).sort(),
        allGenres: Array.from(genreSet).sort(),
        topCast,
        topDirectors,
        topGenres,
      };
    }
    case "movies/applyFilter": {
      const { filter } = action;
      let existingFilters = addFilter(filter, state.filters || {});

      let ret: any = {
        ...state,
        filters: existingFilters,
        // allDirectors: [],
        // allCast: [],
        // allGenres: [],
      };

      if (!USE_SERVER_SIDE_FILTERING) {
        // apply sorting/filtering and collect movie data
        const filtered = filterMovies(state.movies || [], existingFilters);

        ret.filteredMovies = sort(filtered, state.sortField, state.sortDir);
        ret.chartData = buildChartData(filtered);
        ret.watchListRanges = makeWatchListRanges(filtered);
        // ret.allDirectors = Array.from(directorSet).sort();
        // ret.allCast = Array.from(castSet).sort();
        // ret.allGenres = Array.from(genreSet).sort();
      }

      const { topCast, topDirectors, topGenres } = collectMovieData(
        ret.filteredMovies
      );

      ret.topCast = topCast;
      ret.topDirectors = topDirectors;
      ret.topGenres = topGenres;

      return ret;
    }
    case "movies/removeFilter": {
      const { filter } = action;
      const newFilters = removeFilter(
        filter,
        state.filters || {},
        state.movies || []
      );

      let ret: any = {
        ...state,
        filters: newFilters,
      };

      if (!USE_SERVER_SIDE_FILTERING) {
        const filtered = filterMovies(state.movies || [], newFilters);

        ret.filteredMovies = sort(filtered, state.sortField, state.sortDir);
        ret.chartData = buildChartData(filtered);
        ret.watchListRanges = makeWatchListRanges(filtered);
      }

      const { topCast, topDirectors, topGenres } = collectMovieData(
        ret.filteredMovies
      );

      ret.topCast = topCast;
      ret.topDirectors = topDirectors;
      ret.topGenres = topGenres;

      return ret;
    }
    case "movies/resetFilter": {
      const unfiltered = [...(state.movies || [])];

      const { topCast, topDirectors, topGenres } = collectMovieData(unfiltered);

      return {
        ...state,
        filters: makeDefaultDateFilters(unfiltered),
        filteredMovies: unfiltered,
        chartData: buildChartData(unfiltered),
        watchListRanges: makeWatchListRanges(state.movies || []),
        topCast,
        topDirectors,
        topGenres,
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
