import { Filter, FilterMap, FilterType } from "../models/Filter";
import { sampleCategories } from "../testing/sampleCategories";
import { modeledList } from "../testing/sampleMovies";
import filterMovies, {
  addFilter,
  collectFilterInfo,
  gatherAvailableFilters,
  makeDefaultDateFilters,
  removeFilter,
  stringifyFilter,
} from "./FilterUtils";

test("test makeDefaultDateFilters", () => {
  const dateFilters = makeDefaultDateFilters(modeledList);

  const startDateMS = new Date("Aug 30, 2020").getTime();
  expect(dateFilters[FilterType.START_DATE + "_-_" + startDateMS]).toEqual({
    type: FilterType.START_DATE,
    value: startDateMS.toString(),
  });

  const endDateMS = new Date("Sep 1, 2020").getTime();
  expect(dateFilters[FilterType.END_DATE + "_-_" + endDateMS]).toEqual({
    type: FilterType.END_DATE,
    value: endDateMS.toString(),
  });

  expect(dateFilters[FilterType.YEAR_START + "_-_1953"]).toEqual({
    type: FilterType.YEAR_START,
    value: "1953",
  });

  expect(dateFilters[FilterType.YEAR_END + "_-_1982"]).toEqual({
    type: FilterType.YEAR_END,
    value: "1982",
  });
});

test("test gatherAvailableFilters", () => {
  const availableFilters = gatherAvailableFilters(
    modeledList,
    sampleCategories
  );

  expect(availableFilters[FilterType.TAG][0].value).toBe("Sci-Fi Horror");
  expect(availableFilters[FilterType.TAG][0].count).toBe(3);
  expect(availableFilters[FilterType.TAG][1].value).toBe("Sci-Fi Horror B");
  expect(availableFilters[FilterType.TAG][1].count).toBe(1);

  expect(availableFilters[FilterType.YEAR].map((f) => f.value)).toEqual([
    "1953",
    "1955",
    "1981",
    "1982",
  ]);

  expect(availableFilters[FilterType.WATCHLIST].map((f) => f.value)).toEqual([
    "Halloween 2020",
    "Halloween 2020A",
  ]);

  expect(availableFilters[FilterType.LABEL].map((f) => f.value)).toEqual([
    "Criterion",
    "Other",
    "Scream Factory (Other)",
  ]);

  expect(availableFilters[FilterType.FORMAT].map((f) => f.value)).toEqual([
    "Blu Ray",
  ]);

  expect(availableFilters[FilterType.DECADE].map((f) => f.value)).toEqual([
    "1950",
    "1980",
  ]);

  // no click filter options for cast
  expect(availableFilters[FilterType.CAST]).toBeUndefined();
});

test("test addFilter with existing key", () => {
  const filter: Filter = {
    type: FilterType.DECADE,
    value: "1980",
  };

  const filterMap: FilterMap = {
    [FilterType.DECADE + "_-_1975"]: {
      type: FilterType.DECADE,
      value: "1975",
    },
    [FilterType.FORMAT + "_-_DVD"]: {
      type: FilterType.FORMAT,
      value: "DVD",
    },
  };

  const filterResults = addFilter(filter, filterMap);

  expect(Object.keys(filterResults).length).toBe(3);
  expect(filterResults[FilterType.DECADE + "_-_1975"].value).toBe("1975");
  expect(filterResults[FilterType.DECADE + "_-_1980"].value).toBe("1980");
  expect(filterResults[FilterType.FORMAT + "_-_DVD"].value).toBe("DVD");
});

test("test addFilter without existing key", () => {
  const filter: Filter = {
    type: FilterType.DECADE,
    value: "1980",
  };

  const filterMap: FilterMap = {
    [FilterType.FORMAT + "_-_DVD"]: {
      type: FilterType.FORMAT,
      value: "DVD",
    },
  };

  const filterResults = addFilter(filter, filterMap);

  expect(Object.keys(filterResults).length).toBe(2);
  expect(filterResults[FilterType.DECADE + "_-_1980"].value).toBe("1980");
  expect(filterResults[FilterType.FORMAT + "_-_DVD"].value).toBe("DVD");
});

test("test removeFilter", () => {
  const filter: Filter = {
    type: FilterType.FORMAT,
    value: "DVD",
  };

  const filterMap: FilterMap = {
    [FilterType.FORMAT + "_-_DVD"]: filter,
    [FilterType.FORMAT + "_-_VHS"]: {
      type: FilterType.FORMAT,
      value: "VHS",
    },
    [FilterType.DECADE + "_-_1975"]: {
      type: FilterType.DECADE,
      value: "1975",
    },
  };

  const filterResults = removeFilter(filter, filterMap, modeledList);

  expect(Object.keys(filterResults).length).toBe(2);
  expect(filterResults[FilterType.DECADE + "_-_1975"].value).toBe("1975");
  expect(filterResults[FilterType.FORMAT + "_-_VHS"].value).toBe("VHS");
});

test("test removeFilter with startDate", () => {
  const filter: Filter = {
    type: FilterType.START_DATE,
    value: "123",
  };

  const filterMap: FilterMap = {
    [FilterType.START_DATE + "_-_123"]: filter,
  };

  const filterResults = removeFilter(filter, filterMap, modeledList);

  expect(Object.keys(filterResults).length).toBe(1);

  const startDateMS = new Date("Aug 30, 2020").getTime();

  // removing startDate filter replaces it with the default startDate filter based on our list of movies
  expect(filterResults[FilterType.START_DATE + "_-_" + startDateMS].value).toBe(
    startDateMS.toString()
  );
});

test("test collectFilterInfo", () => {
  const filters: FilterMap = {};

  const makeFilter = (type: FilterType, value: string) => {
    return {
      type,
      value,
    };
  };

  const filterList = [
    makeFilter(FilterType.FORMAT, "DVD"),
    makeFilter(FilterType.DECADE, "1980"),
    makeFilter(FilterType.CAST, "Some Actor"),
    makeFilter(FilterType.CAST, "Some Actress"),
    makeFilter(
      FilterType.START_DATE,
      new Date("Aug 30, 2020").getTime().toString()
    ),
    makeFilter(
      FilterType.END_DATE,
      new Date("Aug 31, 2020").getTime().toString()
    ),
    makeFilter(FilterType.GENRE, "horror"),
    makeFilter(FilterType.TAG, "Sci-Fi Horror"),
    makeFilter(FilterType.LABEL, "Scream Factory"),
    makeFilter(FilterType.YEAR, "1982"),
    makeFilter(FilterType.YEAR_START, "1981"),
    makeFilter(FilterType.YEAR_END, "1983"),
  ];

  filterList.forEach((f) => {
    const key: string = stringifyFilter(f);
    filters[key] = f;
  });

  const filterInfo = collectFilterInfo(filters);

  expect(filterInfo).toMatchInlineSnapshot(`
    Object {
      "castFilter": Object {
        "type": 12,
        "value": "Some Actress",
      },
      "directorFilter": null,
      "endDateFilter": Object {
        "type": 7,
        "value": "1598857200000",
      },
      "endDateFilterValue": 2020-08-31T07:00:00.000Z,
      "genreFilter": Object {
        "type": 13,
        "value": "horror",
      },
      "maxYearFilterValue": 1983,
      "minYearFilterValue": 1981,
      "startDateFilter": Object {
        "type": 6,
        "value": "1598770800000",
      },
      "startDateFilterValue": 2020-08-30T07:00:00.000Z,
    }
  `);
});

test("test filterMovies", () => {
  const filters: FilterMap = {};
  const decadeFilter: Filter = {
    type: FilterType.DECADE,
    value: "1980",
  };

  filters[stringifyFilter(decadeFilter)] = decadeFilter;

  let filtered = filterMovies(modeledList, filters);

  // filtered to only two 80s movies, but original list is unmodified
  expect(modeledList.length).toBe(4);
  expect(filtered.length).toBe(2);

  const castFilter: Filter = {
    type: FilterType.CAST,
    value: "Fox Harris",
  };

  filters[stringifyFilter(castFilter)] = castFilter;

  filtered = filterMovies(filtered, filters);

  expect(filtered.length).toBe(1);
  expect(filtered[0].title).toBe("Forbidden World "); // TODO: why is there a trailing space..
});
