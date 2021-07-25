import {
  breakoutTitleYearAndCategory,
  extractRating,
} from "../actions/TransferUtils";
import { Movie } from "../models/Movie";
import testData from "../data/test-data";
import categoryMeta from "../data/category-meta";
import { Filter, FilterType } from "../models/Filter";
import ReferenceMap from "../models/ReferenceMap";
import { buildChartData } from "../actions/ChartUtils";
import dateFormat from "dateformat";

interface StateType {
  movies: Movie[] | null;
  filteredMovies: Movie[] | null;
  filters: Filter[] | null;
  sortField: string | null;
  sortDir: string | null;
  chartData: any;
  references: ReferenceMap | null;
  watchListRanges: any[] | null;
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

const watchedDateComparator = (a: Movie, b: Movie): number => {
  return parseInt(b.id, 10) - parseInt(a.id, 10);
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

const sort = (
  movies: Movie[] | null,
  sortField: string | null,
  sortDir: string | null
) => {
  if (!sortField) {
    return movies;
  }

  let comparator = (a: Movie, b: Movie) => {
    return parseInt(a.id, 10) - parseInt(b.id, 10);
  };

  if (sortField === "Year") {
    comparator = yearComparator;
  } else if (sortField === "Rating") {
    comparator = ratingComparator;
  } else if (sortField === "WatchedDate") {
    comparator = watchedDateComparator;
  }

  let sorted = [...(movies || [])].sort(comparator);

  if (sortDir === "DESC") {
    sorted = sorted.reverse();
  }

  return sorted;
};

const findMovieReferences = (movies: Movie[]) => {
  const referenceMap: any = {};

  movies.forEach((m) => {
    m.content.forEach((c) => {
      const parts = c.split("<strong>");

      parts.forEach((p) => {
        const reference = p.split("</strong>")[0].trim();

        if (reference.match(/^.* \([0-9]{4}\)$/)) {
          if (referenceMap[reference]) {
            if (
              referenceMap[reference].filter((r: Movie) => r.title === m.title)
                .length === 0
            ) {
              referenceMap[reference].push(m);
            }
          } else {
            referenceMap[reference] = [m];
          }
        }
      });
    });
  });

  return referenceMap;
};

const offsetDate = (date: string, add: boolean) => {
  let newDate = add
    ? new Date(date).getTime() + 1000 * 60 * 60 * 4
    : new Date(date).getTime() - 1000 * 60 * 60 * 20;

  return dateFormat(newDate, "mmmm d, yyyy");
};

const makeWatchListRanges = (movies: Movie[]) => {
  const watchListRanges: any[] = [];
  const sortedByReverseID = [...movies];

  // reverse ID order (reverse watched date)
  sortedByReverseID.sort(
    (a: Movie, b: Movie) => parseInt(b.id) - parseInt(a.id)
  );

  let currWL = null;

  for (let i = sortedByReverseID.length - 1; i >= 0; i--) {
    const currMovie = sortedByReverseID[i];

    if (currMovie.titleBreakout.category !== currWL) {
      if (currWL) {
        watchListRanges[watchListRanges.length - 1].lastDate = offsetDate(
          sortedByReverseID[i + 1].date,
          true
        );
      }

      watchListRanges.push({
        title: currMovie.titleBreakout.category,
        firstDate: currMovie.date,
      });

      currWL = currMovie.titleBreakout.category;
    }

    if (i === 0) {
      watchListRanges[watchListRanges.length - 1].lastDate = offsetDate(
        currMovie.date,
        true
      );
    }
  }

  return watchListRanges;
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

      const references = findMovieReferences(allMovies);

      const filteredMovies: Movie[] = [...allMovies];

      return {
        ...state,
        movies: allMovies,
        filteredMovies,
        chartData: buildChartData(filteredMovies),
        categoryMeta,
        references,
        watchListRanges: makeWatchListRanges(filteredMovies),
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
