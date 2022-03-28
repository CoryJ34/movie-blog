import React, { useEffect } from "react";
import ListSummary from "../list/ListSummary";
import MovieInfo from "../list/MovieInfo";
import { Movie } from "../../models/Movie";
import { connect } from "react-redux";
import { Category } from "../../models/Category";

interface Props {
  categoryMap: any;
  filteredMovies: Movie[];
  presetCategory?: Category;
  openDetail: (movie: Movie) => void;
  resetFilters: () => void;
}

function MovieList(props: Props) {
  const {
    filteredMovies,
    presetCategory,
    categoryMap,
    openDetail,
    resetFilters,
  } = props;

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
            category={categoryMap[m.category]}
            presetCategory={presetCategory}
            openDetail={openDetail}
            key={m.title}
          />
        ))}
      </div>
    </div>
  );
}

const mapStateToProps = (state: any) => {
  let categoryMap: any = {};
  const categories: Category[] = state.movieStore?.categories || [];

  categories.forEach((c) => {
    categoryMap[c.name] = c;
  });

  return {
    categoryMap,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    resetFilters: () => dispatch({ type: "movies/resetFilter" }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MovieList);
