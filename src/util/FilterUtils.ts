import { CATEGORY_CLS_MAP, SimpleMap } from "../common/constants";
import {
  AvailableFilters,
  Filter,
  FilterMap,
  FilterMeta,
  FilterType,
} from "../models/Filter";
import { Movie } from "../models/Movie";
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
    existing.push({ value, cls: map ? map[value] : value, count: 1 });
  }

  return existing;
};

export const makeDefaultDateFilters = (movies: Movie[]): FilterMap => {
  const sortedCopy = sort(movies, "id", null) || [];

  let minYear = 3000;
  let maxYear = 1800;

  sortedCopy.forEach((m) => {
    if (m.titleBreakout.rawYear < minYear) {
      minYear = m.titleBreakout.rawYear;
    }
    if (m.titleBreakout.rawYear > maxYear) {
      maxYear = m.titleBreakout.rawYear;
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

export const gatherAvailableFilters = (movies: Movie[]): AvailableFilters => {
  let availableFilters: AvailableFilters = {};

  movies.forEach((movie: Movie) => {
    (movie.tags || []).forEach((tag) => {
      availableFilters[FilterType.TAG.toString()] = pushOrIncrement(
        availableFilters[FilterType.TAG.toString()] || [],
        tag
      );
    });

    availableFilters[FilterType.WATCHLIST.toString()] = pushOrIncrement(
      availableFilters[FilterType.WATCHLIST.toString()] || [],
      movie.titleBreakout.category,
      CATEGORY_CLS_MAP
    );
    availableFilters[FilterType.YEAR.toString()] = pushOrIncrement(
      availableFilters[FilterType.YEAR.toString()] || [],
      movie.titleBreakout.year.substring(1, 5)
    );
    availableFilters[FilterType.DECADE.toString()] = pushOrIncrement(
      availableFilters[FilterType.DECADE.toString()] || [],
      movie.titleBreakout.year.substring(1, 4) + "0"
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
        if (filtersByType[k].indexOf(m.titleBreakout.category) < 0) {
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
        if (
          filtersByType[k].indexOf(m.titleBreakout.year.substring(1, 5)) < 0
        ) {
          res = false;
        }
      }

      if (k === FilterType.DECADE.toString()) {
        if (
          filtersByType[k].indexOf(m.titleBreakout.year.substring(1, 4) + "0") <
          0
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
        if (parseInt(filtersByType[k][0], 10) > m.titleBreakout.rawYear) {
          res = false;
        }
      }

      if (k === FilterType.YEAR_END.toString()) {
        // only one yearEnd, assume 0 index
        if (parseInt(filtersByType[k][0], 10) < m.titleBreakout.rawYear) {
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
    //     if (m.titleBreakout.category !== f.value) {
    //       return false;
    //     }
    //   } else if (f.type === FilterType.YEAR) {
    //     if (m.titleBreakout.year.substr(1, 4) !== f.value) {
    //       return false;
    //     }
    //   } else if (f.type === FilterType.DECADE) {
    //     if (m.titleBreakout.year.substr(1, 3) !== f.value.substr(0, 3)) {
    //       return false;
    //     }
    //   } else {
    //     return false;
    //   }
    // }

    // return true;
  });
};

export default filterMovies;
