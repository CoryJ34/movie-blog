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
  [key: string]: string[];
}

const filterMovies = (movies: Movie[], filters: FilterMap) => {
  let filtersByType: FiltersByTag = {};

  const keys = Object.keys(filters);

  for (let i = 0; i < keys.length; i++) {
    const f = filters[keys[i]];

    if (!filtersByType[f.type.toString()]) {
      filtersByType[f.type.toString()] = [];
    }

    filtersByType[f.type.toString()].push(f.value);
  }

  return movies.filter((m: Movie) => {
    // each movie needs to match all filter types:
    // (filter type 1 value A || value B ..) && (filter type 2 value A || value B)
    // if filter type has no values => true

    const keys = Object.keys(filters);

    let res = true;

    Object.keys(filtersByType).forEach((k) => {
      if (k === FilterType.WATCHLIST.toString()) {
        if (filtersByType[k].indexOf(m.category) < 0) {
          res = false;
        }
      }

      if (k === FilterType.FORMAT.toString()) {
        if (filtersByType[k].indexOf(m.format) < 0) {
          res = false;
        }
      }

      if (k === FilterType.LABEL.toString()) {
        if (filtersByType[k].indexOf(m.label) < 0) {
          res = false;
        }
      }

      if (k === FilterType.TAG.toString()) {
        let hasTag = false;

        (m.tags || []).forEach((tag) => {
          if (filtersByType[k].indexOf(tag) >= 0) {
            hasTag = true;
          }
        });

        if (!hasTag) {
          res = false;
        }
      }

      if (k === FilterType.YEAR.toString()) {
        if (filtersByType[k].indexOf(m.year.toString()) < 0) {
          res = false;
        }
      }

      if (k === FilterType.DECADE.toString()) {
        if (
          filtersByType[k].indexOf(m.year.toString().substring(0, 3) + "0") < 0
        ) {
          res = false;
        }
      }

      if (k === FilterType.START_DATE.toString()) {
        // only one startDate, assume 0 index
        if (parseInt(filtersByType[k][0]) > new Date(m.date).getTime()) {
          res = false;
        }
      }

      if (k === FilterType.END_DATE.toString()) {
        // only one endDate, assume 0 index
        if (parseInt(filtersByType[k][0]) < new Date(m.date).getTime()) {
          res = false;
        }
      }

      if (k === FilterType.YEAR_START.toString()) {
        // only one yearStart, assume 0 index
        if (parseInt(filtersByType[k][0], 10) > m.year) {
          res = false;
        }
      }

      if (k === FilterType.YEAR_END.toString()) {
        // only one yearEnd, assume 0 index
        if (parseInt(filtersByType[k][0], 10) < m.year) {
          res = false;
        }
      }

      if (k === FilterType.FREE_TEXT.toString()) {
        const val = filtersByType[k][0]; //.toLowerCase();
        const parts = val.split(":");

        if (val.trim() !== "") {
          if (parts[0] === "title") {
            if (m.title.toLowerCase().indexOf(parts[1]) < 0) {
              res = false;
            }
          } else if (parts[0] === "desc") {
            const hasAny =
              m.content.filter((c) => c.toLowerCase().indexOf(parts[1]) >= 0)
                .length > 0;

            if (!hasAny) {
              res = false;
            }
          } else if (parts[0] === "director") {
            const hasAny =
              m.directors.filter(
                (c) =>
                  c.toLowerCase().indexOf((parts[1] || "").toLowerCase()) >= 0
              ).length > 0;

            if (!hasAny) {
              res = false;
            }
          } else if (parts[0] === "actor" || parts[0] === "cast") {
            const hasAny =
              m.cast.filter(
                (c) =>
                  c.toLowerCase().indexOf((parts[1] || "").toLowerCase()) >= 0
              ).length > 0;

            if (!hasAny) {
              res = false;
            }
          } else if (parts[0] === "genre") {
            const hasAny =
              m.genres.filter(
                (c) =>
                  c.toLowerCase().indexOf((parts[1] || "").toLowerCase()) >= 0
              ).length > 0;

            if (!hasAny) {
              res = false;
            }
          } else if (parts.length > 1) {
            // @ts-ignore
            const textToSearch = m[parts[0]];

            if (
              (textToSearch || "")
                .toLowerCase()
                .indexOf((parts[1] || "").toLowerCase()) < 0
            ) {
              res = false;
            }
          } else {
            let match = false;

            if (m.title.toLowerCase().indexOf(val) >= 0) {
              match = true;
            }

            const hasAny =
              m.content.filter((c) => c.toLowerCase().indexOf(val) >= 0)
                .length > 0;

            if (hasAny) {
              match = true;
            }

            if (!match) {
              res = false;
            }
          }
        }
      }

      if (k === FilterType.DIRECTOR.toString()) {
        if (!m.directors?.includes(filtersByType[k][0])) {
          res = false;
        }
      }

      if (k === FilterType.CAST.toString()) {
        if (!m.cast?.includes(filtersByType[k][0])) {
          res = false;
        }
      }

      if (k === FilterType.GENRE.toString()) {
        if (!m.genres?.includes(filtersByType[k][0])) {
          res = false;
        }
      }
    });

    return res;

    // if(filters[FilterType.WATCHLIST]) {
    //   if(filters[FilterType.WATCHLIST].
    // }

    // for (let i = 0; i < keys.length; i++) {
    //   const key = keys[i];
    //   const f = filters[key];

    //   let res = true;

    //   if (f.type === FilterType.TAG) {
    //     if ((m.tags || []).indexOf(f.value) < 0) {
    //       return false;
    //     }
    //   } else if (f.type === FilterType.LABEL) {
    //     if (m.label !== f.value) {
    //       return false;
    //     }
    //   } else if (f.type === FilterType.FORMAT) {
    //     if (m.format !== f.value) {
    //       return false;
    //     }
    //   } else if (f.type === FilterType.WATCHLIST) {
    //     if (m.category !== f.value) {
    //       return false;
    //     }
    //   } else if (f.type === FilterType.YEAR) {
    //     if (m.year.substr(1, 4) !== f.value) {
    //       return false;
    //     }
    //   } else if (f.type === FilterType.DECADE) {
    //     if (m.year.substr(1, 3) !== f.value.substr(0, 3)) {
    //       return false;
    //     }
    //   } else {
    //     return false;
    //   }
    // }

    // return true;
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

export const collectFilterInfo = (filters: {
  [key: string]: Filter;
}): CollectedFilterData => {
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
