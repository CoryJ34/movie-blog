import { SimpleMap } from "../common/constants";
import { Category } from "../models/Category";
import {
  AvailableFilters,
  Filter,
  FilterMap,
  FilterMeta,
  FilterType,
} from "../models/Filter";
import { Movie } from "../models/Movie";
import { CollectedFilterData } from "../types/MovieTypes";
import sort from "./SortUtils";
import FilterHandlerFactory from "./filters/FilterHandlerFactory";

/**
 * Generate simple encoding of a filter value to use as a key/identifier
 *
 * @param f
 * @returns
 */
export const stringifyFilter = (f: Filter): string => {
  return f.type + "_-_" + f.value;
};

const metaComparator = (a: FilterMeta, b: FilterMeta) => {
  return a.value > b.value ? 1 : a.value === b.value ? 0 : -1;
};

const pushOrIncrement = (
  existing: FilterMeta[],
  value: string,
  color?: string,
  map?: SimpleMap
): FilterMeta[] => {
  let found = false;
  for (let i = 0; i < existing.length; i++) {
    if (existing[i].value === value) {
      found = true;
      existing[i].count++;
      break;
    }
  }

  if (!found) {
    existing.push({ value, cls: map ? map[value] : value, color, count: 1 });
  }

  return existing;
};

/**
 * Provides default start/end date filters by checking movies for earliest/latest release/watched dates
 *
 * @param movies
 * @returns
 */
export const makeDefaultDateFilters = (movies: Movie[]): FilterMap => {
  const sortedCopy = sort(movies, "id", null) || [];

  let minYear = 3000;
  let maxYear = 1800;

  sortedCopy.forEach((m) => {
    if (m.year < minYear) {
      minYear = m.year;
    }
    if (m.year > maxYear) {
      maxYear = m.year;
    }
  });

  const yearStart: Filter = {
    type: FilterType.YEAR_START,
    value: minYear.toString(),
  };

  const yearEnd: Filter = {
    type: FilterType.YEAR_END,
    value: maxYear.toString(),
  };

  const startDateFilter: Filter = {
    type: FilterType.START_DATE,
    value: new Date(sortedCopy[0].date).getTime().toString(),
  };

  const endDateFilter: Filter = {
    type: FilterType.END_DATE,
    value: new Date(sortedCopy[sortedCopy.length - 1].date)
      .getTime()
      .toString(),
  };

  return {
    [stringifyFilter(startDateFilter)]: startDateFilter,
    [stringifyFilter(endDateFilter)]: endDateFilter,
    [stringifyFilter(yearStart)]: yearStart,
    [stringifyFilter(yearEnd)]: yearEnd,
  };
};

/**
 * Given a list of movies and categories, generate the list of filters that can be applied
 *
 * @param movies
 * @param categories
 * @returns
 */
export const gatherAvailableFilters = (
  movies: Movie[],
  categories: Category[]
): AvailableFilters => {
  let availableFilters: AvailableFilters = {};

  let categoryClsLookup: SimpleMap = {};
  let categoryColorLookup: SimpleMap = {};

  categories.forEach((c) => {
    categoryClsLookup[c.name] = c.cls;
    categoryColorLookup[c.name] = c.hexColor;
  });

  movies.forEach((movie: Movie) => {
    (movie.tags || []).forEach((tag) => {
      availableFilters[FilterType.TAG.toString()] = pushOrIncrement(
        availableFilters[FilterType.TAG.toString()] || [],
        tag
      );
    });

    availableFilters[FilterType.WATCHLIST.toString()] = pushOrIncrement(
      availableFilters[FilterType.WATCHLIST.toString()] || [],
      movie.category,
      categoryColorLookup[movie.category],
      categoryClsLookup
    );
    availableFilters[FilterType.YEAR.toString()] = pushOrIncrement(
      availableFilters[FilterType.YEAR.toString()] || [],
      movie.year.toString()
    );
    availableFilters[FilterType.DECADE.toString()] = pushOrIncrement(
      availableFilters[FilterType.DECADE.toString()] || [],
      movie.year.toString().substring(0, 3) + "0"
    );

    availableFilters[FilterType.LABEL.toString()] = pushOrIncrement(
      availableFilters[FilterType.LABEL.toString()] || [],
      movie.label
    );
    availableFilters[FilterType.FORMAT.toString()] = pushOrIncrement(
      availableFilters[FilterType.FORMAT.toString()] || [],
      movie.format
    );
  });

  if (availableFilters[FilterType.YEAR]) {
    availableFilters[FilterType.YEAR].sort(metaComparator);
  }
  if (availableFilters[FilterType.DECADE]) {
    availableFilters[FilterType.DECADE].sort(metaComparator);
  }
  if (availableFilters[FilterType.FORMAT]) {
    availableFilters[FilterType.FORMAT].sort(metaComparator);
  }
  if (availableFilters[FilterType.LABEL]) {
    availableFilters[FilterType.LABEL].sort(metaComparator);
  }
  if (availableFilters[FilterType.TAG]) {
    availableFilters[FilterType.TAG].sort(metaComparator);
  }

  return availableFilters;
};

interface FiltersByTag {
  [key: string]: {
    values: string[];
    negation?: boolean;
  };
}

const filterMovies = (movies: Movie[], filters: FilterMap) => {
  let filtersByType: FiltersByTag = {};

  const keys = Object.keys(filters);

  for (let i = 0; i < keys.length; i++) {
    const f = filters[keys[i]];

    if (!filtersByType[f.type.toString()]) {
      filtersByType[f.type.toString()] = {
        values: [],
        negation: f.negation,
      };
    }

    filtersByType[f.type.toString()].values.push(f.value);
  }

  return movies.filter((m: Movie) => {
    // each movie needs to match all filter types:
    // (filter type 1 value A || value B ..) && (filter type 2 value A || value B)
    // if filter type has no values => true
    let res = true;

    Object.keys(filtersByType).forEach((k) => {
      const handler = FilterHandlerFactory(k);
      let isNegation = !!filtersByType[k].negation;

      if (isNegation) {
        if (handler && handler.matches(m, filtersByType[k].values)) {
          res = false;
        }
      } else {
        if (handler && !handler.matches(m, filtersByType[k].values)) {
          res = false;
        }
      }
    });

    return res;
  });
};

/**
 * Add a specified filter to the filters from state
 *
 * Note: Has to handle replacing some single-value only filters (like start/end date/year)
 * Other filters can have multiple values, but not those
 *
 * @param filter  Filter to add
 * @param filters Existing filters from state
 * @returns       New filterMap with filter added
 */
export const addFilter = (filter: Filter, filters: FilterMap): FilterMap => {
  let existingFilters: FilterMap = {};
  const filtersFromState = filters || {};

  // collect filters from state into a new filter map
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
    } else if (filter.type === FilterType.FREE_TEXT) {
      if (filtersFromState[fk].type !== FilterType.FREE_TEXT) {
        existingFilters[fk] = filtersFromState[fk];
      }
    } else {
      existingFilters[fk] = filtersFromState[fk];
    }
  });

  // add the newly applied filter to the filter map
  existingFilters[stringifyFilter(filter)] = filter;

  return existingFilters;
};

/**
 * Given a filter and the existing filterMap and movie list, remove the specified filter
 *
 * Note: Has to account for resetting some filters to the default value instead of just
 * blank after removal (like start/end dates)
 *
 * @param filter  Filter to remove
 * @param filters Existing filter map from state
 * @param movies  Current list of movies from state
 * @returns       New filter map with the filter removed
 */
export const removeFilter = (
  filter: Filter,
  filters: FilterMap,
  movies: Movie[]
): FilterMap => {
  let newFilters: FilterMap = {};

  Object.keys(filters || {}).forEach((f) => {
    // add all but filter to be removed
    if (stringifyFilter(filter) !== f) {
      newFilters[f] = filters[f];
    }
  });

  // reset start/end date filters to default if those are the ones being removed
  if (filter.type === FilterType.START_DATE) {
    const defaultFilters = makeDefaultDateFilters(movies || []);
    const firstKey = Object.keys(defaultFilters)[0];
    newFilters[firstKey] = defaultFilters[firstKey];
  } else if (filter.type === FilterType.END_DATE) {
    const defaultFilters = makeDefaultDateFilters(movies || []);
    const secondKey = Object.keys(defaultFilters)[1];
    newFilters[secondKey] = defaultFilters[secondKey];
  }

  return newFilters;
};

export const collectFilterInfo = (filters: FilterMap): CollectedFilterData => {
  let startDateFilterValue = new Date();
  let endDateFilterValue = new Date();
  let startDateFilter: Filter | null = null;
  let endDateFilter: Filter | null = null;
  let minYearFilterValue = 1800;
  let maxYearFilterValue = 3000;
  let directorFilter: Filter | null = null;
  let castFilter: Filter | null = null;
  let genreFilter: Filter | null = null;

  // collect filter values
  Object.keys(filters).forEach((fk) => {
    if (filters[fk].type === FilterType.START_DATE) {
      startDateFilterValue = new Date(parseInt(filters[fk].value, 10));
      startDateFilter = filters[fk];
    } else if (filters[fk].type === FilterType.END_DATE) {
      endDateFilterValue = new Date(parseInt(filters[fk].value, 10));
      endDateFilter = filters[fk];
    } else if (filters[fk].type === FilterType.YEAR_START) {
      minYearFilterValue = parseInt(filters[fk].value, 10);
    } else if (filters[fk].type === FilterType.YEAR_END) {
      maxYearFilterValue = parseInt(filters[fk].value, 10);
    } else if (filters[fk].type === FilterType.DIRECTOR) {
      directorFilter = filters[fk];
    } else if (filters[fk].type === FilterType.CAST) {
      castFilter = filters[fk];
    } else if (filters[fk].type === FilterType.GENRE) {
      genreFilter = filters[fk];
    }
  });

  return {
    startDateFilterValue,
    endDateFilterValue,
    startDateFilter,
    endDateFilter,
    minYearFilterValue,
    maxYearFilterValue,
    directorFilter,
    castFilter,
    genreFilter,
  };
};

export default filterMovies;
