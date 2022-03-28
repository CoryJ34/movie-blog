import React, { useEffect } from "react";
import { Movie } from "../../models/Movie";
import ListSummary from "./ListSummary";
import MovieInfo from "./MovieInfo";
import { Category } from "../../models/Category";

interface Props {
  filteredMovies: Movie[];
  presetCategory: Category;
  openDetail: (movie: Movie) => void;
}

function CategorizedList(props: Props) {
  const { filteredMovies, presetCategory, openDetail } = props;

  return (
    <div className="movie-list">
      {!presetCategory && (
        <ListSummary movies={filteredMovies} presetCategory={presetCategory} />
      )}
      <div className="movie-list">
        {filteredMovies.map((m) => (
          <MovieInfo
            movie={m}
            category={presetCategory}
            presetCategory={presetCategory}
            openDetail={openDetail}
            key={m.title}
          />
        ))}
      </div>
    </div>
  );
}

export default CategorizedList;
