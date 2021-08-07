import {
  AvailableFilters,
  Filter,
  FilterMap,
  FilterType,
} from "../models/Filter";
import { Movie } from "../models/Movie";

export const stringifyFilter = (f: Filter): string => {
  return f.type + "_-_" + f.value;
};

export const gatherAvailableFilters = (movies: Movie[]): AvailableFilters => {
  let availableFilters: AvailableFilters = {};

  movies.forEach((movie: Movie) => {
    // @ts-ignore
    let watchLists: string[] =
      availableFilters[FilterType.WATCHLIST.toString()] || [];
    if (watchLists.indexOf(movie.titleBreakout.category) < 0) {
      watchLists.push(movie.titleBreakout.category);

      // @ts-ignore
      availableFilters[FilterType.WATCHLIST.toString()] = watchLists;
    }

    // @ts-ignore
    let tags: string[] = availableFilters[FilterType.TAG.toString()] || [];

    (movie.tags || []).forEach((tag) => {
      if (tags.indexOf(tag) < 0) {
        tags.push(tag);

        // @ts-ignore
        availableFilters[FilterType.TAG.toString()] = tags;
      }
    });

    let years: string[] = availableFilters[FilterType.YEAR.toString()] || [];
    const year = movie.titleBreakout.year.substring(1, 5);
    if (years.indexOf(year) < 0) {
      years.push(year);

      // @ts-ignore
      availableFilters[FilterType.YEAR.toString()] = years;
    }

    let decades: string[] =
      availableFilters[FilterType.DECADE.toString()] || [];
    const decade = movie.titleBreakout.year.substring(1, 4) + "0";
    if (decades.indexOf(decade) < 0) {
      decades.push(decade);

      // @ts-ignore
      availableFilters[FilterType.DECADE.toString()] = decades;
    }

    let labels: string[] = availableFilters[FilterType.LABEL.toString()] || [];
    const label = movie.label;
    if (labels.indexOf(label) < 0) {
      labels.push(label);

      // @ts-ignore
      availableFilters[FilterType.LABEL.toString()] = labels;
    }

    let formats: string[] =
      availableFilters[FilterType.FORMAT.toString()] || [];
    const format = movie.format;
    if (formats.indexOf(format) < 0) {
      formats.push(format);

      // @ts-ignore
      availableFilters[FilterType.FORMAT.toString()] = formats;
    }
  });

  if (availableFilters[FilterType.YEAR]) {
    availableFilters[FilterType.YEAR].sort();
  }
  if (availableFilters[FilterType.DECADE]) {
    availableFilters[FilterType.DECADE].sort();
  }
  if (availableFilters[FilterType.FORMAT]) {
    availableFilters[FilterType.FORMAT].sort();
  }
  if (availableFilters[FilterType.LABEL]) {
    availableFilters[FilterType.LABEL].sort();
  }
  if (availableFilters[FilterType.TAG]) {
    availableFilters[FilterType.TAG].sort();
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
