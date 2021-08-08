import react from "react";
import { extractRating, RATING_REGEX } from "../../util/TransferUtils";
import { Movie } from "../../models/Movie";

import "./styles/MovieInfo.scss";

const makeContentElement = (content: string, index: number) => {
  if (content.trim().match(RATING_REGEX)) {
    return null;
  }

  let cls = "content-block";
  if (content.indexOf("<") === 0) {
    cls += " complex";
  }

  return (
    <div
      className={cls}
      key={index}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

interface Props {
  movie: Movie;
  presetCategory?: string;
  openDetail: (selectedMovie: Movie) => void;
}

const MovieInfo = (props: Props) => {
  const { movie, presetCategory, openDetail } = props;
  const categoryInfo = movie.titleBreakout;

  const onCategoryClick = () => {
    // if (currentFilter) {
    //   resetFilter();
    // } else {
    //   filterByCategory(categoryInfo?.category);
    // }
  };

  const onImgClick = () => {
    openDetail(movie);
  };

  const order = categoryInfo?.order;
  let complexOrder = false;
  if (order && !order.trim().match(/^[0-9]+$/)) {
    complexOrder = true;
  }

  const ratingDisplay = extractRating(movie);
  const ratingCls = `rating_${parseFloat(ratingDisplay) * 10}`;

  return (
    <div className="movie-info">
      <div className="movie-header">
        <div className="col">
          <img className="thumb" src={movie.img} onClick={onImgClick} />
        </div>
        <div className="col">
          <div className={`my-rating ${ratingCls}`}>{ratingDisplay}</div>
          {!presetCategory && (
            <div
              className={`category ${categoryInfo?.categoryCls}`}
              onClick={onCategoryClick}
            >
              {categoryInfo?.category}
            </div>
          )}
          {categoryInfo?.subCategory && (
            <div className="sub-category">{categoryInfo.subCategory}</div>
          )}
          {categoryInfo?.order && complexOrder && (
            <div className="category-order">{categoryInfo.order}</div>
          )}
          {presetCategory ? (
            <div className="movie-title">
              {categoryInfo?.title}
              <span className="movie-year">{categoryInfo?.year}</span>
            </div>
          ) : (
            <div className="movie-title">
              {`#${movie.id} ${categoryInfo?.title}`}
              <span className="movie-year">{categoryInfo?.year}</span>
            </div>
          )}
          <div className="published-date">{movie.date}</div>
        </div>
      </div>
      <div className="movie-content">
        {movie.content.map((mc: string, index: number) =>
          makeContentElement(mc, index)
        )}
      </div>
    </div>
  );
};

export default MovieInfo;
