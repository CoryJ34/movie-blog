import { Grid } from "@material-ui/core";
import { Refresh } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "../../common/constants";
import { Category } from "../../models/Category";
import { Movie } from "../../models/Movie";
import VHS from "../vhs/VHS";
import FeaturedCard from "./FeaturedCard";

import "./styles/Home.scss";

interface Props {
  movies: Movie[];
  categories: Category[];
  openDetail: (movie: Movie) => void;
  resetFilters: () => void;
}

const Home = (props: Props) => {
  const { movies, categories, openDetail, resetFilters } = props;
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
        <div className="section-header">Featured</div>
        <div className="featured">
          <Grid container justify="center" spacing={2}>
            {categories.map((c: Category) => {
              return (
                <FeaturedCard
                  key={c.name}
                  loc={c.route}
                  category={c.name}
                  hexColor={c.hexColor}
                  movies={movies}
                />
              );
            })}
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
