import { transform } from "@babel/core";
import { useState } from "react";
import { Movie } from "../../models/Movie";
import { shuffleArray } from "../../util/ListUtils";
import "./styles/VHS.scss";

interface Props {
  movie: Movie;
  onFocused?: (value: boolean) => void;
}

const MAX_COLOR = 125;

const randomizeColors = false;

const makeRandomColor = (min?: number, max?: number) => {
  if (min && max) {
    return Math.round(Math.random() * (max - min) + min);
  } else if (min) {
    return Math.round(Math.random() * (255 - min) + min);
  } else if (max) {
    return Math.round(Math.random() * max);
  }

  return 0;
};

const makeRandomRGB = (min?: number, max?: number, appliedTo?: number) => {
  let arr = [];

  if (appliedTo) {
    for (var i = 1; i <= 3; i++) {
      if (i > appliedTo) {
        arr.push(makeRandomColor(0, 255));
      } else {
        arr.push(makeRandomColor(min, max));
      }
    }
  } else {
    arr = [
      makeRandomColor(min, max),
      makeRandomColor(min, max),
      makeRandomColor(min, max),
    ];
  }

  shuffleArray(arr);

  return `rgb(${arr[0]},${arr[1]},${arr[2]})`;
};

const VHS = (props: Props) => {
  const { movie, onFocused } = props;

  const [showFront, setShowFront] = useState(true);
  const [inPreview, setInPreview] = useState(true);

  const subText = (text: string) => <span className="sub-text">{text}</span>;
  const superText = (text: string) => (
    <span className="super-text">{text}</span>
  );

  const onClick = () => {
    if (inPreview) {
      setInPreview(false);

      if (onFocused) {
        onFocused(true);
      }
    } else {
      setShowFront(!showFront);
    }
  };

  return (
    <div className={`vhs-tape-wrapper ${inPreview ? "preview" : "focused"}`}>
      <div
        className={`vhs-tape ${inPreview ? "preview" : "focused"}`}
        onClick={onClick}
        style={
          randomizeColors
            ? { backgroundColor: makeRandomRGB(undefined, 40) }
            : {}
        }
      >
        <div
          className="box-top"
          style={{
            backgroundImage: `url(${movie.lbox.poster})`,
          }}
        >
          {/* {inPreview && (
            <span style={{ color: `rgb(${r},${g},${b})` }}>
              {movie.titleBreakout.title}
            </span>
          )} */}
        </div>
        <div className="contents">
          {showFront && (
            <div className="vhs-front">
              <img src={movie.lbox.poster} />
            </div>
          )}
          {!showFront && (
            <div className="vhs-back">
              <div className="top-section">
                <div className="img-container">
                  {movie.lbox.backdrop ? (
                    <img className="lbox" src={movie.lbox.backdrop} />
                  ) : (
                    <img className="mine" src={movie.img} />
                  )}
                </div>
              </div>
              <div className="bottom-section">
                {movie.lbox.tagline && (
                  <div
                    className="tagline"
                    style={
                      randomizeColors
                        ? { color: makeRandomRGB(180, undefined, 2) }
                        : {}
                    }
                  >{`${movie.lbox.tagline}`}</div>
                )}
                {movie.lbox.summary && (
                  <div
                    className="summary"
                    style={
                      randomizeColors
                        ? { color: makeRandomRGB(180, undefined, 3) }
                        : {}
                    }
                  >
                    {movie.lbox.summary}
                  </div>
                )}
                <div className="crew">
                  {subText("Starring")}
                  {movie.lbox.cast.map((c, i) => {
                    if (i >= 4) {
                      return;
                    }

                    return superText(c);
                  })}

                  {subText("Genres")}
                  {movie.lbox.genres.map((c, i) => {
                    if (i >= 7) {
                      return;
                    }

                    return superText(c);
                  })}

                  {subText("Directed by")}
                  {movie.lbox.directors.map((c, i) => {
                    if (i >= 7) {
                      return;
                    }

                    return superText(c);
                  })}
                  {subText("Runtime")}
                  {superText(movie.titleBreakout.year.substring(1, 5))}
                  {subText("Year")}
                  {superText(movie.lbox.runtime)}
                  {subText("Ratings")}
                  {superText(`${movie.lbox.rating}/5`)}
                </div>
              </div>
            </div>
          )}
          <div className="overlay" />
          <div className="overlay-2" />
        </div>
        {!inPreview && (
          <div
            className="close"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setShowFront(true);
              setInPreview(true);

              if (onFocused) {
                onFocused(false);
              }
            }}
          >
            x
          </div>
        )}
      </div>
      <div className="placeholder" />
    </div>
  );
};

export default VHS;
