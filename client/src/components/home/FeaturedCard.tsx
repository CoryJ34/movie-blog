import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Movie } from "../../models/Movie";

interface Props {
  loc: string;
  category: string;
  hexColor: string;
  movies: Movie[];
}

const FeaturedCard = (props: Props) => {
  const { loc, hexColor, category, movies } = props;

  const [randomImg, setRandomImg] = useState("");

  useEffect(() => {
    const filtered = movies.filter((m) => category === m.category);
    const randomIndex = Math.floor(Math.random() * filtered.length);

    setRandomImg(filtered[randomIndex]?.img);
  }, []);

  const filteredAndSorted = [...movies]
    .filter((m) => m.category === category)
    .sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));

  const firstDate = filteredAndSorted[0]?.date;
  const lastDate = filteredAndSorted[filteredAndSorted.length - 1]?.date;

  return (
    <Link
      to={loc}
      className={`featured-card ${filteredAndSorted[0]?.categoryCls}`}
      style={{
        borderLeft: `solid 5px ${hexColor}`,
        borderRadius: "0",
      }}
    >
      {randomImg && (
        <div className="featured-card-backsplash">
          <img src={randomImg} />
        </div>
      )}
      <div className="featured-card-content">
        <div className="featured-preview">{category}</div>
        <div className="featured-number">{filteredAndSorted.length} movies</div>
        <div className="dates-container">
          <div className="date">{firstDate}</div>
          <div className="date">{lastDate}</div>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedCard;
