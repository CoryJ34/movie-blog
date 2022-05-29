import React, { useEffect, useState } from "react";
import ListSummary from "../list/ListSummary";
import MovieInfo from "../list/MovieInfo";
import { Movie } from "../../models/Movie";
import { connect } from "react-redux";
import { Category } from "../../models/Category";
import ReactPaginate from "react-paginate";
import "./styles/MovieList.scss";
import { FilterMap } from "../../models/Filter";

const PAGE_SIZE = 25;

interface Props {
  categoryMap: any;
  filteredMovies: Movie[];
  filters: FilterMap;
  presetCategory?: Category;
  openDetail: (movie: Movie) => void;
  resetFilters: () => void;
}

function MovieList(props: Props) {
  const {
    filteredMovies,
    filters,
    presetCategory,
    categoryMap,
    openDetail,
    resetFilters,
  } = props;

  useEffect(() => {
    resetFilters();
  }, []);

  const [offset, setOffset] = useState(0);
  const [loadingPager, setLoadingPager] = useState(false);

  useEffect(() => {
    setLoadingPager(true);

    setTimeout(() => setLoadingPager(false), 100);

    setOffset(0);
  }, [filters]);

  if (!filteredMovies) {
    return <div>Loading...</div>;
  }

  return (
    <div className="movie-list">
      {!presetCategory && (
        <ListSummary movies={filteredMovies} presetCategory={presetCategory} />
      )}
      <div className="movie-list">
        {filteredMovies.slice(offset, offset + PAGE_SIZE).map((m) => (
          <MovieInfo
            movie={m}
            category={categoryMap[m.category]}
            presetCategory={presetCategory}
            openDetail={openDetail}
            key={m.title}
          />
        ))}
      </div>
      {loadingPager ? (
        <div />
      ) : (
        <ReactPaginate
          pageCount={filteredMovies.length / PAGE_SIZE}
          onPageChange={(event) => setOffset(event.selected * PAGE_SIZE)}
          className="list-pager"
        />
      )}
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
