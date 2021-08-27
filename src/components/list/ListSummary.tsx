import { Dialog } from "@material-ui/core";
import { useState } from "react";
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
import FilterSection from "./FilterSection";
import { gatherAvailableFilters } from "../../util/FilterUtils";

interface Props {
  movies: Movie[];
  categoryMeta: CategoryMeta;
  presetCategory?: string;
  filters: FilterMap;
  availableFilters: AvailableFilters;
  filteredMovies: Movie[];
  hideSort?: boolean;
  applyFilter: (filter: Filter) => void;
  removeFilter: (filter: Filter) => void;
}

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
    filteredMovies,
    hideSort,
    applyFilter,
    removeFilter,
  } = props;

  const [currentRemark, setCurrentRemark] = useState<RemarkObject | undefined>(
    undefined
  );

  let averageRating = 0.0;
  let allCategories: any = {};
  let allTags: string[] = [];
  let totalRuntimeMins: number = 0;

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

    totalRuntimeMins += movie.runtimeMins;
  });

  averageRating = averageRating / movies.length;
  const minsPerMovie = Math.round(totalRuntimeMins / movies.length);

  const meta: SingleCategoryMeta = presetCategory
    ? // @ts-ignore
      categoryMeta[presetCategory || "none"]
    : null;

  const availableFromFiltered = gatherAvailableFilters(filteredMovies);

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
