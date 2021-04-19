import React, { useEffect } from "react";
import ListSummary from "../list/ListSummary";
import MovieInfo from "../list/MovieInfo";
import { Movie } from "../../models/Movie";
import { CategoryMeta } from "../../models/CategoryMeta";

interface Props {
  movies: Movie[];
  categoryMeta: CategoryMeta;
  filteredMovies: Movie[];
  currentFilter: string;
  presetCategory?: string;
  filterByCategory: (filter: string) => void;
  resetFilter: () => void;
  sort: (sortField: string, sortDir: string) => void;
  openDetail: (movie: Movie) => void;
}

function MovieList(props: Props) {
  const {
    movies,
    categoryMeta,
    filteredMovies,
    presetCategory,
    currentFilter,
    filterByCategory,
    resetFilter,
    sort,
    openDetail,
  } = props;

  if (!movies) {
    return <div>Loading...</div>;
  }
  return (
    <div className="movie-list">
      {!presetCategory && (
        <ListSummary
          movies={filteredMovies || movies}
          categoryMeta={categoryMeta}
          sort={sort}
          presetCategory={presetCategory}
          filter={currentFilter}
          filterByCategory={filterByCategory}
          resetFilter={resetFilter}
        />
      )}
      <div className="movie-list">
        {(filteredMovies || movies).map((m) => (
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
