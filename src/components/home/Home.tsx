import { Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "../../common/constants";
import { Movie } from "../../models/Movie";
import FeaturedCard from "./FeaturedCard";

import "./styles/Home.scss";

interface Props {
  movies: Movie[];
  openDetail: (movie: Movie) => void;
}

const Home = (props: Props) => {
  const { movies, openDetail } = props;
  const [previews, setPreviews] = useState<Movie[]>([]);

  useEffect(() => {
    let num = 5;
    let newPreviews = [];
    let moviesClone = [...props.movies];

    while (num > 0) {
      const rand = Math.floor(Math.random() * moviesClone.length);
      newPreviews.push(moviesClone[rand]);
      moviesClone.splice(rand, 1);
      num--;
    }

    setPreviews(newPreviews);
  }, []);

  return (
    <div className="home">
      <div className="home-background" />
      <div className="home-content">
        <div className="section-header">Featured</div>
        <div className="featured">
          <Grid container justify="center" spacing={2}>
            <FeaturedCard
              loc="/halloween2020"
              category={CATEGORIES.HALLOWEEN_2020}
              movies={movies}
            />
            <FeaturedCard
              loc="/novdec2020"
              category={CATEGORIES.NOV_DEC_2020}
              movies={movies}
            />
            <FeaturedCard
              loc="/gamera"
              category={CATEGORIES.GAMERA}
              movies={movies}
            />
            <FeaturedCard
              loc="/randomizer"
              category={CATEGORIES.RANDOMIZER}
              movies={movies}
            />
            <FeaturedCard
              loc="/bracket"
              category={CATEGORIES.MARCH_MADNESS}
              movies={movies}
            />
            <FeaturedCard
              loc="/genres"
              category={CATEGORIES.GENRES}
              movies={movies}
            />
            <FeaturedCard
              loc="/finishtheserieshorror"
              category={CATEGORIES.FINISH_THE_SERIES_HORROR}
              movies={movies}
            />
          </Grid>
        </div>
        <div className="section-header">Check out a random movie</div>
        <div className="previews">
          <Grid container justify="center" spacing={2}>
          {previews.map((preview) => {
            const onClick = () => openDetail(preview);
            return (
              <div className="preview" onClick={onClick}>
                <img src={preview.img} />
              </div>
            );
          })}
          </Grid>
        </div>
        <a>
          <Link to="/movies">See All Movies</Link>
        </a>
      </div>
    </div>
  );
};

export default Home;
