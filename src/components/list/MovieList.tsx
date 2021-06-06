import React, { useEffect } from "react";
import ListSummary from "../list/ListSummary";
import MovieInfo from "../list/MovieInfo";
import { Movie } from "../../models/Movie";
import { CategoryMeta } from "../../models/CategoryMeta";

interface Props {
  categoryMeta: CategoryMeta;
  filteredMovies: Movie[];
  currentFilter: string;
  presetCategory?: string;
  filterByCategory: (filter: string) => void;
  filterByTag: (tag: string) => void;
  resetFilter: () => void;
  sort: (sortField: string, sortDir: string) => void;
  openDetail: (movie: Movie) => void;
}

function MovieList(props: Props) {
  const {
    categoryMeta,
    filteredMovies,
    presetCategory,
    currentFilter,
    filterByCategory,
    filterByTag,
    resetFilter,
    sort,
    openDetail,
  } = props;

  if (!filteredMovies) {
    return <div>Loading...</div>;
  }
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

export default MovieList;
