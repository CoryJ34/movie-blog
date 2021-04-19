import react, { ReactElement } from "React";
import { CategoryMeta } from "../models/CategoryMeta";
import { Movie } from "../models/Movie";
import ListSummary from "./list/ListSummary";

interface Props {
  movies: Movie[];
  categoryMeta: CategoryMeta;
  presetCategory: string;
  children: any;
}

const PageLayout = (props: Props) => {
  const { movies, categoryMeta, presetCategory } = props;
  return (
    <div className="page">
      <ListSummary
        movies={movies}
        categoryMeta={categoryMeta}
        presetCategory={presetCategory}
      />
      {props.children}
    </div>
  );
};

export default PageLayout;
