import { Dialog } from "@material-ui/core";
import react, { useState } from "react";
import { extractRating } from "../../actions/TransferUtils";
import categoryMeta from "../../data/category-meta";
import {
  CategoryMeta,
  RemarkObject,
  SingleCategoryMeta,
} from "../../models/CategoryMeta";
import { Movie } from "../../models/Movie";

import "./styles/ListSummary.scss";

interface Props {
  movies: Movie[];
  categoryMeta: CategoryMeta;
  presetCategory?: string;
  filter?: string;
  filterByCategory?: (filter: string) => void;
  resetFilter?: () => void;
  sort?: (sortField: string, sortDir: string) => void;
}

const ListSummary = (props: Props) => {
  const {
    movies,
    presetCategory,
    filter,
    filterByCategory,
    resetFilter,
    sort,
  } = props;

  const [currentRemark, setCurrentRemark] = useState<RemarkObject | undefined>(
    undefined
  );

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

  const meta: SingleCategoryMeta = presetCategory
    // @ts-ignore
    ? categoryMeta[presetCategory || "none"]
    : null;

  // TODO: Fix sorting
  // const onSortByRatings = () => sort("rating", "ASC");

  return (
    <div className="list-summary">
      <div className="header">
        <span>Summary</span>
        {meta && <span className="remarks">
          {meta && meta.opening && (
            <a
              onClick={() => setCurrentRemark(meta.opening)}
              className="remark-link"
            >
              Opening Comments
            </a>
          )}
          {meta && meta.closing && (
            <a
              onClick={() => setCurrentRemark(meta.closing)}
              className="remark-link"
            >
              Closing Comments
            </a>
          )}
        </span>}
      </div>
      <div>{`Total movies: ${movies.length}`}</div>
      <div>{`Average rating: ${averageRating.toFixed(2)}`}</div>
      {!presetCategory &&
        Object.keys(allCategories).map((k) => {
          const onClick = () => {
            if (filter) {
              resetFilter && resetFilter();
            } else {
              filterByCategory && filterByCategory(allCategories[k]);
            }
          };
          return (
            <div className={`category ${k}`} onClick={onClick}>
              {allCategories[k]}
            </div>
          );
        })}
      {/* {!presetCategory && (
        <div onClick={onSortByRatings}>Sort by Ratings</div>
      )} */}
      <Dialog
        open={!!currentRemark}
        onClose={() => setCurrentRemark(undefined)}
      >
        <div className="list-remark">
          {(currentRemark?.content || []).map((c: string) => (
            <div dangerouslySetInnerHTML={{ __html: c }} />
          ))}
        </div>
      </Dialog>
    </div>
  );
};

export default ListSummary;
