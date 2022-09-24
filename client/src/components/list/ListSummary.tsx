import { Dialog, MenuItem, Select } from "@material-ui/core";
import { useState } from "react";
import { connect } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  AvailableFilters,
  Filter,
  FilterMap,
  FilterType,
} from "../../models/Filter";
import { Movie } from "../../models/Movie";
import Charts from "./Charts";
import Sort from "./Sort";

import "./styles/ListSummary.scss";
import FilterSection from "./FilterSection";
import { gatherAvailableFilters } from "../../util/FilterUtils";
import { Category, Remark } from "../../models/Category";
import DelayedTextInput from "../common/DelayedTextInput";

interface Props {
  movies: Movie[];
  categories: Category[];
  presetCategory?: Category;
  filters: FilterMap;
  availableFilters: AvailableFilters;
  filteredMovies: Movie[];
  hideSort?: boolean;
  earliestMovieYear: number;
  latestMovieYear: number;
  allDirectors: string[];
  allCast: string[];
  allGenres: string[];
  applyFilter: (filter: Filter) => void;
  removeFilter: (filter: Filter) => void;
}

const YEAR_SELECTIONS: any = {
  "Year 1": {
    startDate: new Date("August 30, 2020"),
    endDate: new Date("August 26, 2021"),
  },
  "Year 2": {
    startDate: new Date("August 27, 2021"),
    endDate: new Date("August 25, 2022"),
  },
  "Year 3": {
    startDate: new Date("August 26, 2022"),
    endDate: new Date("August 28, 2023"),
  },
};

const FILTERABLES: { type: FilterType; label: string; cls?: string }[] = [
  {
    type: FilterType.WATCHLIST,
    label: "Watchlist",
    cls: "category",
  },
  {
    type: FilterType.TAG,
    label: "Tag",
  },
  {
    type: FilterType.DECADE,
    label: "Decade",
  },
  {
    type: FilterType.LABEL,
    label: "Label",
  },
  {
    type: FilterType.FORMAT,
    label: "Format",
  },
];

const ListSummary = (props: Props) => {
  const {
    movies,
    presetCategory,
    filters,
    availableFilters,
    categories,
    filteredMovies,
    hideSort,
    earliestMovieYear,
    latestMovieYear,
    allDirectors,
    allCast,
    allGenres,
    applyFilter,
    removeFilter,
  } = props;

  const [currentRemark, setCurrentRemark] = useState<Remark | undefined>(
    undefined
  );

  const [yearSelection, setYearSelection] = useState("All");

  let averageRating = 0.0;
  let allCategories: any = {};
  let allTags: string[] = [];
  let totalRuntimeMins: number = 0;

  if (!movies) {
    return <div>No movies yet..</div>;
  }

  movies.forEach((movie) => {
    averageRating += parseFloat(movie.rating); //parseFloat(extractRating(movie).split("/")[0].trim());
    allCategories[movie.categoryCls] = movie.category;
    if (movie.tags) {
      movie.tags.forEach((tag) => {
        if (!allTags.includes(tag)) {
          allTags.push(tag);
        }
      });
    }

    totalRuntimeMins += movie.runtimeMins;
  });

  averageRating = averageRating / movies.length;
  const minsPerMovie = Math.round(totalRuntimeMins / movies.length);

  const meta = presetCategory?.remarks;

  const availableFromFiltered = gatherAvailableFilters(
    filteredMovies,
    categories
  );

  let startDateFilterValue = new Date();
  let endDateFilterValue = new Date();
  let startDateFilter: Filter | null = null;
  let endDateFilter: Filter | null = null;
  let minYearFilterValue = 1800;
  let maxYearFilterValue = 3000;
  let directorFilter: any = null;
  let castFilter: any = null;
  let genreFilter: any = null;

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

  let availableYears = [];

  for (var i = earliestMovieYear; i <= latestMovieYear; i++) {
    availableYears.push(i);
  }

  return (
    <div className="list-summary">
      <div className="header">
        <span>Summary</span>
        {meta && (
          <span className="remarks">
            {meta && meta.opening && (
              <a
                onClick={() => setCurrentRemark(meta.opening)}
                className="remark-link"
              >
                Opening Comments
              </a>
            )}
            {meta && meta.closing && (
              <a
                onClick={() => setCurrentRemark(meta.closing)}
                className="remark-link"
              >
                Closing Comments
              </a>
            )}
          </span>
        )}
      </div>
      <div>{`Total movies: ${movies.length}`}</div>
      <div>{`Average rating: ${averageRating.toFixed(2)}`}</div>
      <div>{`Total runtime: ${Math.floor(totalRuntimeMins / 60)} hr ${
        totalRuntimeMins % 60
      } min`}</div>
      <div>{`Average runtime: ${Math.floor(minsPerMovie / 60)} hr ${
        minsPerMovie % 60
      } min`}</div>
      {!presetCategory && (
        <div className="filter-section">
          <div className="section-label">Watched Date</div>
          <div className="date-range-container">
            <DatePicker
              selected={startDateFilterValue}
              onChange={(d: Date) =>
                applyFilter({
                  type: FilterType.START_DATE,
                  value: d.getTime().toString(),
                })
              }
            />
            <a
              onClick={() => {
                if (startDateFilter) {
                  removeFilter(startDateFilter);
                }
              }}
            >
              Reset
            </a>
            <DatePicker
              selected={endDateFilterValue}
              onChange={(d: Date) =>
                applyFilter({
                  type: FilterType.END_DATE,
                  value: d.getTime().toString(),
                })
              }
            />
            <a
              onClick={() => {
                if (endDateFilter) {
                  removeFilter(endDateFilter);
                }
              }}
            >
              Reset
            </a>
            <span className="year-selector-container">
              <Select
                value={yearSelection}
                label="Year..."
                onChange={(event: any) => {
                  const selectedYear = event.target.value;
                  setYearSelection(selectedYear);

                  if (selectedYear === "All") {
                    if (startDateFilter) {
                      removeFilter(startDateFilter);
                    }
                    if (endDateFilter) {
                      removeFilter(endDateFilter);
                    }

                    return;
                  }

                  applyFilter({
                    type: FilterType.START_DATE,
                    value: YEAR_SELECTIONS[selectedYear].startDate
                      .getTime()
                      .toString(),
                  });

                  applyFilter({
                    type: FilterType.END_DATE,
                    value: YEAR_SELECTIONS[selectedYear].endDate
                      .getTime()
                      .toString(),
                  });
                }}
              >
                <MenuItem value={"All"}>All</MenuItem>
                {Object.keys(YEAR_SELECTIONS).map((ys: string) => (
                  <MenuItem value={ys}>{ys}</MenuItem>
                ))}
              </Select>
            </span>
          </div>
        </div>
      )}
      {!presetCategory && (
        <div className="filter-section">
          <div className="section-label">Release Year</div>
          <div className="year-range-container">
            <Select
              value={minYearFilterValue}
              label="Min Year"
              onChange={(event: any) => {
                applyFilter({
                  type: FilterType.YEAR_START,
                  value: event.target.value.toString(),
                });
              }}
            >
              {availableYears.map((v) => (
                <MenuItem value={v}>{v}</MenuItem>
              ))}
            </Select>
            <Select
              value={maxYearFilterValue}
              label="Max Year"
              onChange={(event: any) => {
                applyFilter({
                  type: FilterType.YEAR_END,
                  value: event.target.value.toString(),
                });
              }}
            >
              {availableYears.map((v) => (
                <MenuItem value={v}>{v}</MenuItem>
              ))}
            </Select>
          </div>
        </div>
      )}
      {!presetCategory && (
        <DelayedTextInput
          onChange={(value: string) => {
            applyFilter({
              type: FilterType.FREE_TEXT,
              value,
            });
          }}
        />
      )}
      <span className="year-selector-container">
        <Select
          value={directorFilter ? directorFilter.value : ""}
          label="Director"
          onChange={(event: any) => {
            if (directorFilter) {
              removeFilter(directorFilter);
            }
            applyFilter({
              type: FilterType.DIRECTOR,
              value: event.target.value.toString(),
            });
          }}
        >
          {allDirectors.map((v) => (
            <MenuItem value={v}>{v}</MenuItem>
          ))}
        </Select>
      </span>
      <span className="year-selector-container">
        <Select
          value={castFilter ? castFilter.value : ""}
          label="Cast"
          onChange={(event: any) => {
            if (castFilter) {
              removeFilter(castFilter);
            }
            applyFilter({
              type: FilterType.CAST,
              value: event.target.value.toString(),
            });
          }}
        >
          {allCast.map((v) => (
            <MenuItem value={v}>{v}</MenuItem>
          ))}
        </Select>
      </span>
      <span className="year-selector-container">
        <Select
          value={genreFilter ? genreFilter.value : ""}
          label="Genre"
          onChange={(event: any) => {
            if (genreFilter) {
              removeFilter(genreFilter);
            }
            applyFilter({
              type: FilterType.GENRE,
              value: event.target.value.toString(),
            });
          }}
        >
          {allGenres.map((v) => (
            <MenuItem value={v}>{v}</MenuItem>
          ))}
        </Select>
      </span>
      {!presetCategory && (
        <div className="filters">
          {FILTERABLES.map((f) => (
            <FilterSection
              label={f.label}
              filterType={f.type}
              filters={filters}
              availableFilters={availableFilters}
              availableFromFiltered={availableFromFiltered}
              cls={f.cls}
              applyFilter={applyFilter}
              removeFilter={removeFilter}
            />
          ))}
        </div>
      )}
      {!hideSort && <Sort />}
      <Charts />
      <Dialog
        open={!!currentRemark}
        onClose={() => setCurrentRemark(undefined)}
      >
        <div className="list-remark">
          {(currentRemark?.content || []).map((c: string) => (
            <div dangerouslySetInnerHTML={{ __html: c }} />
          ))}
        </div>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    filters: state.movieStore?.filters,
    availableFilters: state.movieStore?.availableFilters,
    filteredMovies: state.movieStore?.filteredMovies,
    earliestMovieYear: state.movieStore?.earliestMovieYear,
    latestMovieYear: state.movieStore?.latestMovieYear,
    categories: state.movieStore?.categories,
    allDirectors: state.movieStore?.allDirectors,
    allCast: state.movieStore?.allCast,
    allGenres: state.movieStore?.allGenres,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    applyFilter: (filter: Filter) =>
      dispatch({ type: "movies/applyFilter", filter }),
    removeFilter: (filter: Filter) =>
      dispatch({ type: "movies/removeFilter", filter }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListSummary);
