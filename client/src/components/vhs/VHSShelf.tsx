import { connect } from "react-redux";
import { Movie } from "../../models/Movie";
import VHS from "./VHS";
import "./styles/VHSShelf.scss";
import { useEffect, useState } from "react";
import { Grid, IconButton } from "@material-ui/core";
import { shuffleArray } from "../../util/ListUtils";
import { Refresh } from "@material-ui/icons";

const VHSShelf = (props: { movies: Movie[] }) => {
  const [hasFocused, setHasFocused] = useState(false);
  const [randomizedMovies, setRandomizedMovies] = useState<Movie[]>([]);

  const { movies } = props;

  const shuffle = () => {
    if (!movies) {
      return;
    }

    let randomized = [...movies];
    shuffleArray(randomized);
    setRandomizedMovies(randomized);
  };

  useEffect(() => {
    shuffle();
  }, [movies]);

  const makeShelves = () => {
    return (
      <div className="shelf-pane">
        <div className="back"></div>
        <div className="plank-face"></div>
        <div className="plank"></div>
        <div className="back"></div>
        <div className="plank-face"></div>
        <div className="plank"></div>
        <div className="back"></div>
        <div className="plank-face"></div>
        <div className="plank"></div>
      </div>
    );
  };

  return (
    <div className={`vhs-shelf-container ${hasFocused ? "has-focused" : ""}`}>
      {/* <div className="background-image" /> */}
      <div className="html-shelf">
        <div className="banner-wrapper">
          <div className="banner">{"Einy's Movie Rentals"}</div>
          <div className="banner-texture" />
        </div>
        <div className="top"></div>
        <div className="middle">
          <div className="left">
            <div className="edge">{makeShelves()}</div>
            <div className="side">
              <div className="vert-top"></div>
              <div className="vert"></div>
            </div>
          </div>
          <div className="center">{makeShelves()}</div>
          <div className="right">
            <div className="side">
              <div className="vert-top"></div>
              <div className="vert"></div>
            </div>
            <div className="edge">{makeShelves()}</div>
          </div>
        </div>
        <div className="bottom">
          <IconButton size="small" onClick={() => shuffle()}>
            <Refresh />
          </IconButton>
        </div>
      </div>
      <div className={`vhs-shelf ${hasFocused ? "has-focused" : ""}`}>
        <Grid container justify="center" spacing={2}>
          {randomizedMovies.map((p: Movie) => (
            <VHS
              movie={p}
              onFocused={(value: boolean) => {
                setHasFocused(value);
              }}
            />
          ))}
          {/* <VHS movie={movies[0]} /> */}
        </Grid>
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    movies: state.movieStore?.movies,
  };
};

export default connect(mapStateToProps)(VHSShelf);
