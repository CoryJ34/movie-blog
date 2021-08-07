import { Dialog } from "@material-ui/core";
import React from "react";
import react, { useState } from "react";
import { connect } from "react-redux";
import { extractRating } from "../../util/TransferUtils";
import categoryMeta from "../../data/category-meta";
import {
  CategoryMeta,
  RemarkObject,
  SingleCategoryMeta,
} from "../../models/CategoryMeta";
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
import { CATEGORY_CLS_MAP, FORMATS, LABELS } from "../../common/constants";
import FilterSection from "./FilterSection";
import {
  gatherAvailableFilters,
  stringifyFilter,
} from "../../util/FilterUtils";

interface Props {
  movies: Movie[];
  categoryMeta: CategoryMeta;
  presetCategory?: string;
  filters: FilterMap;
  availableFilters: AvailableFilters;
  filteredMovies: Movie[];
  decades: number[];
  hideSort?: boolean;
  applyFilter: (filter: Filter) => void;
  removeFilter: (filter: Filter) => void;
}

const makeFormatValues = () => {
  return Object.keys(FORMATS).map((key) => {
    // @ts-ignore
    const value: string = FORMATS[key];
    return {
      value,
      name: value,
    };
  });
};

const makeLabelValues = () => {
  return Object.keys(LABELS).map((key) => {
    // @ts-ignore
    const value: string = LABELS[key];
    return {
      value,
      name: value,
    };
  });
};

const ListSummary = (props: Props) => {
  const {
    movies,
    presetCategory,
    filters,
    availableFilters,
    filteredMovies,
    decades,
    hideSort,
    applyFilter,
    removeFilter,
  } = props;

  const [currentRemark, setCurrentRemark] =
    useState<RemarkObject | undefined>(undefined);

  let averageRating = 0.0;
  let allCategories: any = {};
  let allTags: string[] = [];

  movies.forEach((movie) => {
    averageRating += parseFloat(extractRating(movie).split("/")[0].trim());
    allCategories[movie.titleBreakout.categoryCls] =
      movie.titleBreakout.category;
    if (movie.tags) {
      movie.tags.forEach((tag) => {
        if (!allTags.includes(tag)) {
          allTags.push(tag);
        }
      });
    }
  });

  averageRating = averageRating / movies.length;

  const meta: SingleCategoryMeta = presetCategory
    ? // @ts-ignore
      categoryMeta[presetCategory || "none"]
    : null;

  const renderDecades = () => {
    return (
      <div className="decades">
        {availableFilters[FilterType.DECADE].map((d) => {
          const onClick = () => {
            const exists =
              !!filters[
                stringifyFilter({
                  type: FilterType.DECADE,
                  value: d.toString(),
                })
              ];

            if (exists) {
              removeFilter({ type: FilterType.DECADE, value: d.toString() });
            } else {
              applyFilter({ type: FilterType.DECADE, value: d.toString() });
            }
          };

          return (
            <div onClick={onClick} key={d} className="decade">
              {d}
            </div>
          );
        })}
      </div>
    );
  };

  const availableFromFiltered = gatherAvailableFilters(filteredMovies);
  const availableWatchlists =
    availableFromFiltered[FilterType.WATCHLIST.toString()];

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
      {!presetCategory && (
        <div>
          {availableFilters[FilterType.WATCHLIST].map((k) => {
            const onClick = () => {
              const val = k;

              const exists =
                !!filters[
                  stringifyFilter({ type: FilterType.WATCHLIST, value: val })
                ];

              if (exists) {
                removeFilter({ type: FilterType.WATCHLIST, value: val });
              } else {
                applyFilter({ type: FilterType.WATCHLIST, value: val });
              }
            };
            return (
              <div
                className={`category ${CATEGORY_CLS_MAP[k]} ${
                  !!(filters || {})[
                    stringifyFilter({ type: FilterType.WATCHLIST, value: k })
                  ]
                    ? "selected"
                    : ""
                } ${
                  !availableWatchlists || availableWatchlists.indexOf(k) < 0
                    ? "na"
                    : ""
                }`}
                onClick={onClick}
              >
                {k}
              </div>
            );
          })}
        </div>
      )}
      {!presetCategory && (
        <FilterSection
          label="Tag"
          filterType={FilterType.TAG}
          filters={filters}
          availableFilters={availableFilters}
          availableFromFiltered={availableFromFiltered}
          applyFilter={applyFilter}
          removeFilter={removeFilter}
        />
      )}
      {!presetCategory && (
        <FilterSection
          label="Decade"
          filterType={FilterType.DECADE}
          filters={filters}
          availableFilters={availableFilters}
          availableFromFiltered={availableFromFiltered}
          applyFilter={applyFilter}
          removeFilter={removeFilter}
        />
      )}
      {!presetCategory && (
        <FilterSection
          label="Label"
          filterType={FilterType.LABEL}
          filters={filters}
          availableFilters={availableFilters}
          availableFromFiltered={availableFromFiltered}
          applyFilter={applyFilter}
          removeFilter={removeFilter}
        />
      )}
      {!presetCategory && (
        <FilterSection
          label="Format"
          filterType={FilterType.FORMAT}
          filters={filters}
          availableFilters={availableFilters}
          availableFromFiltered={availableFromFiltered}
          applyFilter={applyFilter}
          removeFilter={removeFilter}
        />
      )}
      {/* {renderDecades()} */}
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
  let decades: number[] = [];

  (state.movieStore?.filteredMovies || []).forEach((m: Movie) => {
    const decade = parseInt(m.titleBreakout.year.substr(1, 3) + "0", 10);

    if (decades.indexOf(decade) < 0) {
      decades.push(decade);
    }
  });

  decades.sort();

  return {
    decades,
    filters: state.movieStore?.filters,
    availableFilters: state.movieStore?.availableFilters,
    filteredMovies: state.movieStore?.filteredMovies,
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
