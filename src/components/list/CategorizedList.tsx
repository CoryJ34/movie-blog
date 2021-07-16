import React, { useEffect } from "react";
import { Movie } from "../../models/Movie";
import { CategoryMeta } from "../../models/CategoryMeta";
import { Filter, FilterType } from "../../models/Filter";
import ListSummary from "./ListSummary";
import MovieInfo from "./MovieInfo";

interface Props {
  categoryMeta: CategoryMeta;
  filteredMovies: Movie[];
  presetCategory: string;
  applyFilter: (filter: Filter) => void;
  openDetail: (movie: Movie) => void;
}

function CategorizedList(props: Props) {
  const {
    categoryMeta,
    filteredMovies,
    presetCategory,
    applyFilter,
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

export default CategorizedList;
