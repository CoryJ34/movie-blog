import React, { useEffect } from "react";
import ListSummary from "../list/ListSummary";
import MovieInfo from "../list/MovieInfo";
import { Movie } from "../../models/Movie";

interface Props {
  movies: Movie[];
  filteredMovies: Movie[];
  currentFilter: string;
  disableFiltering?: boolean;
  filterByCategory: (filter: string) => void;
  resetFilter: () => void;
  sort: (sortField: string, sortDir: string) => void;
  openDetail: (movie: Movie) => void;
}

function MovieList(props: Props) {
  const {
    movies,
    filteredMovies,
    disableFiltering,
    currentFilter,
    filterByCategory,
    resetFilter,
    sort,
    openDetail
  } = props;

  if (!movies) {
    return <div>Loading...</div>;
  }
  return (
    <div className="movie-list">
      <ListSummary
        movies={filteredMovies || movies}
        sort={sort}
        disableFiltering={disableFiltering}
        filter={currentFilter}
        filterByCategory={filterByCategory}
        resetFilter={resetFilter}
      />
      <div className="movie-list">
        {(filteredMovies || movies).map((m) => (
          <MovieInfo
            movie={m}
            disableFiltering={disableFiltering}
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
