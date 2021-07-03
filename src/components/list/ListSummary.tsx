import { Dialog } from "@material-ui/core";
import React from "react";
import react, { useState } from "react";
import { connect } from "react-redux";
import { extractRating } from "../../actions/TransferUtils";
import categoryMeta from "../../data/category-meta";
import {
  CategoryMeta,
  RemarkObject,
  SingleCategoryMeta,
} from "../../models/CategoryMeta";
import { Filter, FilterType } from "../../models/Filter";
import { Movie } from "../../models/Movie";
import Sort from "./Sort";

import "./styles/ListSummary.scss";

interface Props {
  movies: Movie[];
  categoryMeta: CategoryMeta;
  presetCategory?: string;
  filter?: string;
  filters: Filter[],
  applyFilter: (filter: Filter) => void;
  removeFilter: (filter: Filter) => void;
  filterByCategory?: (filter: string) => void;
  filterByTag?: (tag: string) => void;
  resetFilter?: () => void;
  sort?: (sortField: string, sortDir: string) => void;
}

const ListSummary = (props: Props) => {
  const {
    movies,
    presetCategory,
    filter,
    filters,
    applyFilter,
    removeFilter,
    filterByCategory,
    filterByTag,
    resetFilter,
    sort,
  } = props;

  const [currentRemark, setCurrentRemark] = useState<RemarkObject | undefined>(
    undefined
  );

  let averageRating = 0.0;
  let allCategories: any = {};
  let allTags: string[] = [];

  // TODO: Find more statistics to display
  // let ratingsByCategory = {};

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

  // TODO: Fix sorting
  // const onSortByRatings = () => sort("rating", "ASC");

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
              const exists = (filters ||[]).find(f => f.type === FilterType.WATCHLIST && f.value === val);

              if (exists) {
                removeFilter({type: FilterType.WATCHLIST, value: val});
              } else {
                applyFilter({type: FilterType.WATCHLIST, value: val});
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
        <div>
          {allTags.map((tag) => {
            const onClick = () => {
              const exists = (filters || []).find(f => f.type === FilterType.TAG && f.value === tag);

              if (exists) {
                removeFilter({type: FilterType.TAG, value: tag});
              } else {
                applyFilter({type: FilterType.TAG, value: tag});
              }
            };
            return (
              <div className={`tag ${tag}`} onClick={onClick}>
                {tag}
              </div>
            );
          })}
        </div>
      )}
      <Sort />
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
    filters: state.movieStore?.filters
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
