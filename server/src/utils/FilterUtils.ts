import { Movie } from "../../../client/src/models/Movie";

interface FiltersByTag {
  [key: string]: string[];
}

// TODO: unify with client side, move to common location
export interface FilterObject {
  field: string;
  values: [string];
}

export const filterMovies = (
  movies: Movie[],
  filters: FilterObject[]
): Movie[] => {
  let filtersByType: FiltersByTag = {};

  (filters || []).forEach((filter: FilterObject) => {
    if (!filtersByType[filter.field]) {
      filtersByType[filter.field] = [];
    }

    filtersByType[filter.field].push(filter.values[0]);
  });

  return movies.filter((m: Movie) => {
    // each movie needs to match all filter types:
    // (filter type 1 value A || value B ..) && (filter type 2 value A || value B)
    // if filter type has no values => true

    const keys = Object.keys(filters);

    let res = true;

    Object.keys(filtersByType).forEach((k) => {
      if (k === "WATCHLIST") {
        if (filtersByType[k].indexOf(m.category) < 0) {
          res = false;
        }
      }

      if (k === "FORMAT") {
        if (filtersByType[k].indexOf(m.format) < 0) {
          res = false;
        }
      }

      if (k === "LABEL") {
        if (filtersByType[k].indexOf(m.label) < 0) {
          res = false;
        }
      }

      if (k === "TAG") {
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

      if (k === "YEAR") {
        if (filtersByType[k].indexOf(m.year.toString()) < 0) {
          res = false;
        }
      }

      if (k === "DECADE") {
        if (
          filtersByType[k].indexOf(m.year.toString().substring(0, 3) + "0") < 0
        ) {
          res = false;
        }
      }

      if (k === "START_DATE") {
        // only one startDate, assume 0 index
        if (parseInt(filtersByType[k][0]) > new Date(m.date).getTime()) {
          res = false;
        }
      }

      if (k === "END_DATE") {
        // only one endDate, assume 0 index
        if (parseInt(filtersByType[k][0]) < new Date(m.date).getTime()) {
          res = false;
        }
      }

      if (k === "YEAR_START") {
        // only one yearStart, assume 0 index
        if (parseInt(filtersByType[k][0], 10) > m.year) {
          res = false;
        }
      }

      if (k === "YEAR_END") {
        // only one yearEnd, assume 0 index
        if (parseInt(filtersByType[k][0], 10) < m.year) {
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
