import react from "react";
import {
  extractRating,
} from "../../actions/TransferUtils";
import { Movie } from "../../models/Movie";

import "./styles/ListSummary.scss";

interface Props {
  movies: Movie[];
  disableFiltering?: boolean;
  filter?: string;
  filterByCategory: (filter: string) => void;
  resetFilter: () => void;
  sort: (sortField: string, sortDir: string) => void;
}

const ListSummary = (props: Props) => {
  const {
    movies,
    disableFiltering,
    filter,
    filterByCategory,
    resetFilter,
    sort,
  } = props;
  let averageRating = 0.0;
  let allCategories: any = {};

  // TODO: Find more statistics to display
  // let ratingsByCategory = {};

  movies.forEach((movie) => {
    averageRating += parseFloat(extractRating(movie).split("/")[0].trim());
    allCategories[movie.titleBreakout.categoryCls] =
      movie.titleBreakout.category;
  });

  averageRating = averageRating / movies.length;

  // TODO: Fix sorting
  const onSortByRatings = () => sort("rating", "ASC");

  return (
    <div className="list-summary">
      <div className="header">Summary</div>
      <div>{`Total movies: ${movies.length}`}</div>
      <div>{`Average rating: ${averageRating.toFixed(2)}`}</div>
      {!disableFiltering &&
        Object.keys(allCategories).map((k) => {
          const onClick = () => {
            if (filter) {
              resetFilter();
            } else {
              filterByCategory(allCategories[k]);
            }
          };
          return (
            <div className={`category ${k}`} onClick={onClick}>
              {allCategories[k]}
            </div>
          );
        })}
      {!disableFiltering && (
        <div onClick={onSortByRatings}>Sort by Ratings</div>
      )}
    </div>
  );
};

export default ListSummary;
