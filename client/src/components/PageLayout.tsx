import react, { ReactElement, useEffect } from "react";
import { connect } from "react-redux";
import { Category } from "../models/Category";
import { Filter, FilterType } from "../models/Filter";
import { Movie } from "../models/Movie";
import ListSummary from "./list/summary/ListSummary";

interface Props {
  movies: Movie[];
  hideSort?: boolean;
  presetCategory: Category;
  applyFilter: (filter: Filter) => void;
  children: any;
}

const PageLayout = (props: Props) => {
  const { movies, presetCategory, applyFilter, hideSort } = props;

  useEffect(() => {
    if (presetCategory) {
      applyFilter({
        type: FilterType.WATCHLIST,
        value: presetCategory.name,
      });
    }
  }, []);

  return (
    <div className="page">
      <ListSummary
        movies={movies}
        presetCategory={presetCategory}
        hideSort={hideSort}
      />
      {props.children}
    </div>
  );
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    applyFilter: (filter: Filter) =>
      dispatch({ type: "movies/applyFilter", filter }),
  };
};

export default connect(undefined, mapDispatchToProps)(PageLayout);
