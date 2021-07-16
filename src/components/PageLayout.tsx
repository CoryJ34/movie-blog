import react, { ReactElement } from "react";
import { connect } from "react-redux";
import { CategoryMeta } from "../models/CategoryMeta";
import { Movie } from "../models/Movie";
import ListSummary from "./list/ListSummary";

interface Props {
  movies: Movie[];
  categoryMeta: CategoryMeta;
  hideSort?: boolean;
  presetCategory: string;
  children: any;
}

const PageLayout = (props: Props) => {
  const { movies, categoryMeta, presetCategory, hideSort } = props;
  return (
    <div className="page">
      <ListSummary
        movies={movies}
        categoryMeta={categoryMeta}
        presetCategory={presetCategory}
        hideSort={hideSort}
      />
      {props.children}
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    categoryMeta: state.movieStore?.categoryMeta
  };
};

export default connect(mapStateToProps)(PageLayout);
