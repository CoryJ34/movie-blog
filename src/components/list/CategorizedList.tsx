import React, { useEffect } from "react";
import { Movie } from "../../models/Movie";
import { CategoryMeta } from "../../models/CategoryMeta";
import { Filter, FilterType } from "../../models/Filter";
import ListSummary from "./ListSummary";
import MovieInfo from "./MovieInfo";

interface Props {
  categoryMeta: CategoryMeta;
  filteredMovies: Movie[];
  currentFilter: string;
  presetCategory: string;
  applyFilter: (filter: Filter) => void;
  filterByCategory: (filter: string) => void;
  filterByTag: (tag: string) => void;
  resetFilter: () => void;
  sort: (sortField: string, sortDir: string) => void;
  openDetail: (movie: Movie) => void;
}

function CategorizedList(props: Props) {
  const {
    categoryMeta,
    filteredMovies,
    presetCategory,
    currentFilter,
    applyFilter,
    filterByCategory,
    filterByTag,
    resetFilter,
    sort,
    openDetail,
  } = props;

  useEffect(() => {
    applyFilter({
      type: FilterType.WATCHLIST,
      value: presetCategory,
    });
  }, []);

  return (
    <div className="movie-list">
      {!presetCategory && (
        <ListSummary
          movies={filteredMovies}
          categoryMeta={categoryMeta}
          sort={sort}
          presetCategory={presetCategory}
          filter={currentFilter}
          filterByCategory={filterByCategory}
          filterByTag={filterByTag}
          resetFilter={resetFilter}
        />
      )}
      <div className="movie-list">
        {filteredMovies.map((m) => (
          <MovieInfo
            movie={m}
            presetCategory={presetCategory}
            currentFilter={currentFilter}
            filterByCategory={filterByCategory}
            resetFilter={resetFilter}
            openDetail={openDetail}
            key={m.title}
          />
        ))}
      </div>
    </div>
  );
}

export default CategorizedList;
