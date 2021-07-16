import React, { useEffect } from "react";
import ListSummary from "../list/ListSummary";
import MovieInfo from "../list/MovieInfo";
import { Movie } from "../../models/Movie";
import { CategoryMeta } from "../../models/CategoryMeta";

interface Props {
  categoryMeta: CategoryMeta;
  filteredMovies: Movie[];
  presetCategory?: string;
  openDetail: (movie: Movie) => void;
}

function MovieList(props: Props) {
  const { categoryMeta, filteredMovies, presetCategory, openDetail } = props;

  if (!filteredMovies) {
    return <div>Loading...</div>;
  }
  return (
    <div className="movie-list">
      {!presetCategory && (
        <ListSummary
          movies={filteredMovies}
          categoryMeta={categoryMeta}
          presetCategory={presetCategory}
        />
      )}
      <div className="movie-list">
        {filteredMovies.map((m) => (
          <MovieInfo
            movie={m}
            presetCategory={presetCategory}
            openDetail={openDetail}
            key={m.title}
          />
        ))}
      </div>
    </div>
  );
}

export default MovieList;
