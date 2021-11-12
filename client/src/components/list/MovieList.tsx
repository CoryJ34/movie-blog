import React, { useEffect } from "react";
import ListSummary from "../list/ListSummary";
import MovieInfo from "../list/MovieInfo";
import { Movie } from "../../models/Movie";
import { CategoryMeta } from "../../models/CategoryMeta";
import { connect } from "react-redux";

interface Props {
  categoryMeta: CategoryMeta;
  filteredMovies: Movie[];
  presetCategory?: string;
  openDetail: (movie: Movie) => void;
  resetFilters: () => void;
}

function MovieList(props: Props) {
  const { filteredMovies, presetCategory, openDetail, resetFilters } = props;

  useEffect(() => {
    resetFilters();
  }, []);

  if (!filteredMovies) {
    return <div>Loading...</div>;
  }
  return (
    <div className="movie-list">
      {!presetCategory && (
        <ListSummary movies={filteredMovies} presetCategory={presetCategory} />
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

const mapDispatchToProps = (dispatch: any) => {
  return {
    resetFilters: () => dispatch({ type: "movies/resetFilter" }),
  };
};

export default connect(undefined, mapDispatchToProps)(MovieList);
