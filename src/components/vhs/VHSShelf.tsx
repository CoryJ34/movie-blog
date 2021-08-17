import { connect } from "react-redux";
import { Movie } from "../../models/Movie";
import VHS from "./VHS";
import "./styles/VHSShelf.scss";
import { useState } from "react";

const VHSShelf = (props: { movies: Movie[] }) => {
  const [hasFocused, setHasFocused] = useState(false);

  const { movies } = props;

  if (!movies) {
    return <div>Loading...</div>;
  }

  let previews: Movie[] = [];

  movies.forEach((m, i) => {
    // if (i >= 30) {
    //   return;
    // }

    previews.push(m);
  });

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
        <div className="bottom"></div>
      </div>
      <div className={`vhs-shelf ${hasFocused ? "has-focused" : ""}`}>
        {previews.map((p) => (
          <VHS
            movie={p}
            onFocused={(value: boolean) => {
              setHasFocused(value);
            }}
          />
        ))}
        {/* <VHS movie={movies[0]} /> */}
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
