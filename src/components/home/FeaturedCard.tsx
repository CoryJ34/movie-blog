import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Movie } from "../../models/Movie";

interface Props {
  loc: string;
  category: string;
  movies: Movie[];
}

const FeaturedCard = (props: Props) => {
  const { loc, category, movies } = props;

  const filteredAndSorted = [...movies]
    .filter((m) => m.titleBreakout.category === category)
    .sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));

    const firstDate = filteredAndSorted[0].date;
    const lastDate = filteredAndSorted[filteredAndSorted.length-1].date;

  return (
    <Link to={loc} className={`featured-card ${filteredAndSorted[0].titleBreakout.categoryCls}`}>
      <div className="featured-preview">{category}</div>
      <div className="date">{firstDate}</div>
      <div className="date">{lastDate}</div>
    </Link>
  );
};

export default FeaturedCard;
