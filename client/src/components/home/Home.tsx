import { Grid } from "@material-ui/core";
import { Refresh } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "../../common/constants";
import { Movie } from "../../models/Movie";
import VHS from "../vhs/VHS";
import FeaturedCard from "./FeaturedCard";

import "./styles/Home.scss";

interface Props {
  movies: Movie[];
  openDetail: (movie: Movie) => void;
  resetFilters: () => void;
}

const Home = (props: Props) => {
  const { movies, openDetail, resetFilters } = props;
  const [previews, setPreviews] = useState<Movie[]>([]);

  const onRefreshPreviews = () => {
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
  };

  useEffect(() => {
    resetFilters();

    onRefreshPreviews();
  }, []);

  return (
    <div className="home">
      <div className="home-background" />
      <div className="home-content">
        <div
          onClick={() => {
            fetch("/migrate");
          }}
        >
          MIGRATE
        </div>
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
            <FeaturedCard
              loc="/decadesofhorror"
              category={CATEGORIES.DECADES_OF_HORROR}
              movies={movies}
            />
            <FeaturedCard
              loc="/finishtheseriesnonhorror"
              category={CATEGORIES.FINISH_THE_SERIES_NON_HORROR}
              movies={movies}
            />
            <FeaturedCard
              loc="/genresampler"
              category={CATEGORIES.GENRE_SAMPLER}
              movies={movies}
            />
            <FeaturedCard
              loc="/halloween2021"
              category={CATEGORIES.HALLOWEEN_2021}
              movies={movies}
            />
            <FeaturedCard
              loc="/daysoflistmas"
              category={CATEGORIES.DAYS_OF_LISTMAS}
              movies={movies}
            />
          </Grid>
        </div>
        <div className="section-header">
          <div className="name">Check out a random movie</div>
          <div className="refresh-previews" onClick={onRefreshPreviews}>
            <Refresh fontSize="small" />
          </div>
        </div>
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
        {/* <div className="tapes">
          <Grid container justify="center" spacing={2}>
            {previews.map((preview) => (
              <VHS movie={preview} />
            ))}
          </Grid>
        </div> */}
      </div>
    </div>
  );
};

export default Home;
