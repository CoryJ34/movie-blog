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
import { Filter, FilterType } from "../../models/Filter";
import { Movie } from "../../models/Movie";
import Charts from "./Charts";
import Sort from "./Sort";

import "./styles/ListSummary.scss";
import { FORMATS, LABELS } from "../../common/constants";
import FilterSection from "./FilterSection";

interface Props {
  movies: Movie[];
  categoryMeta: CategoryMeta;
  presetCategory?: string;
  filters: Filter[];
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
        {decades.map((d) => {
          const onClick = () => {
            const exists = (filters || []).find(
              (f) => f.type === FilterType.DECADE && f.value === d.toString()
            );

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
          {Object.keys(allCategories).map((k) => {
            const onClick = () => {
              const val = allCategories[k];
              const exists = (filters || []).find(
                (f) => f.type === FilterType.WATCHLIST && f.value === val
              );

              if (exists) {
                removeFilter({ type: FilterType.WATCHLIST, value: val });
              } else {
                applyFilter({ type: FilterType.WATCHLIST, value: val });
              }
            };
            return (
              <div className={`category ${k}`} onClick={onClick}>
                {allCategories[k]}
              </div>
            );
          })}
        </div>
      )}
      {!presetCategory && (
        <FilterSection
          label="Tag"
          //@ts-ignore
          values={allTags.map((tag) => {
            return { value: tag, name: tag };
          })}
          filterType={FilterType.TAG}
          filters={filters}
          applyFilter={applyFilter}
          removeFilter={removeFilter}
        />
      )}
      {!presetCategory && (
        <FilterSection
          label="Decade"
          //@ts-ignore
          values={decades.map((d) => {
            return { value: d.toString(), name: d.toString() };
          })}
          filterType={FilterType.DECADE}
          filters={filters}
          applyFilter={applyFilter}
          removeFilter={removeFilter}
        />
      )}
      {!presetCategory && (
        <FilterSection
          label="Label"
          //@ts-ignore
          values={makeLabelValues()}
          filterType={FilterType.LABEL}
          filters={filters}
          applyFilter={applyFilter}
          removeFilter={removeFilter}
        />
      )}
      {!presetCategory && (
        <FilterSection
          label="Format"
          //@ts-ignore
          values={makeFormatValues()}
          filterType={FilterType.FORMAT}
          filters={filters}
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
