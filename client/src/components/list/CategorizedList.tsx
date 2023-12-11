import React, { useEffect } from "react";
import { Movie } from "../../models/Movie";
import ListSummary from "./summary/ListSummary";
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
        {filteredMovies.map((m, i) => (
          <MovieInfo
            movie={m}
            category={presetCategory}
            presetCategory={presetCategory}
            openDetail={openDetail}
            order={i + 1}
            key={`${m.title}-${i}`}
          />
        ))}
      </div>
    </div>
  );
}

export default CategorizedList;
