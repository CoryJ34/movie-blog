import { Dialog } from "@material-ui/core";
import React, { ReactElement, useEffect, useState } from "react";
import { connect } from "react-redux";
import { BracketData, Matchup, Round } from "../models/BracketData";
import { Movie } from "../models/Movie";

import "./styles/Bracket.scss";

interface Props {
  movies: any;
  bracketData: BracketData;
  loadBracketData: (data: any) => void;
}

const MATCHUP_MARGIN = 20;
const TEAM_HEIGHT = 61;
const TEAM_WIDTH = 140;

const REMAINING_MAP: any = {
  0: "Championship",
  1: "Final Four",
  2: "Elite Eight",
  3: "Sweet Sixteen",
};

const calculateMarginTop = (
  matchupNum: number,
  roundNum: number,
  isLast: boolean
) => {
  if (roundNum === 0) {
    return "0";
  }

  let calculated =
    (matchupNum === 0 ? 1 : 2) *
    (Math.pow(2, isLast ? roundNum - 1 : roundNum) - 1) *
    (TEAM_HEIGHT + (roundNum === 1 ? MATCHUP_MARGIN / 2 : MATCHUP_MARGIN / 6));

  if (isLast) {
    calculated -= 16; // account for championship padding
  }

  return `${calculated}px`;
};

const Bracket = (props: Props) => {
  const { movies, bracketData, loadBracketData } = props;
  const [blurbOpen, setBlurbOpen] = useState(false);
  const [selectedMatchup, setSelectedMatchup] = useState<Matchup | null>(null);

  useEffect(() => {
    fetch("/bracketdata")
      .then((res) => res.json())
      .then((data) => {
        props.loadBracketData(data);
      });
  }, []);

  if (!movies || !bracketData) {
    return <div>Loading...</div>;
  }

  const renderMatchup = (
    movies: any,
    matchup: Matchup,
    i: number,
    roundNum: number,
    isLast: boolean
  ) => {
    const style = {
      marginTop: calculateMarginTop(i, roundNum, isLast),
      marginBottom: `${MATCHUP_MARGIN}px`,
    };

    return (
      <div
        className={`bracket-matchup${isLast ? " championship" : ""}`}
        key={i}
        style={style}
        onClick={() => {
          setSelectedMatchup(matchup);
          setBlurbOpen(true);
        }}
      >
        <div
          style={{ height: TEAM_HEIGHT - 16 }}
          className={`team${matchup.a === matchup.winner ? " winner" : ""}`}
        >
          <img src={movies[matchup.a].img} />
        </div>
        <div
          style={{ height: TEAM_HEIGHT - 16 }}
          className={`team${matchup.b === matchup.winner ? " winner" : ""}`}
        >
          <img src={movies[matchup.b].img} />
        </div>
      </div>
    );
  };

  const renderRound = (
    movies: any,
    round: Round,
    roundsRemaining: number,
    roundNum: number
  ) => {
    return (
      <div className="bracket-round" key={round.round}>
        <div className="round-title">
          {REMAINING_MAP[roundsRemaining] || `Round ${round.round}`}
        </div>
        <div className="round-matchups">
          {round.matchups.map((matchup, i: number) =>
            renderMatchup(movies, matchup, i, roundNum, roundsRemaining === 0)
          )}
        </div>
      </div>
    );
  };

  const renderRoundRecur = (
    movies: any,
    rounds: Round[],
    index: number
  ): ReactElement | null => {
    if (index >= rounds.length) {
      return null;
    }

    if (index === rounds.length - 1) {
      return renderRound(
        movies,
        rounds[index],
        rounds.length - (index + 1),
        index
      );
    }

    const numMatchups = rounds[index].matchups.length;

    // cut in half and recurse
    const firstHalf: Round = {
      matchups: rounds[index].matchups.slice(0, numMatchups / 2),
      round: rounds[index].round,
    };

    const secondHalf: Round = {
      matchups: rounds[index].matchups.slice(numMatchups / 2, numMatchups),
      round: rounds[index].round,
    };

    return (
      <>
        {renderRound(movies, firstHalf, rounds.length - (index + 1), index)}
        {renderRoundRecur(movies, rounds, index + 1)}
        {renderRound(movies, secondHalf, rounds.length - (index + 1), index)}
      </>
    );
  };

  const blurb = selectedMatchup?.blurb || "<div/>";

  return (
    <div className="bracket-container">
      {renderRoundRecur(movies, bracketData.rounds, 0)}
      <Dialog
        open={blurbOpen}
        maxWidth="sm"
        fullWidth={true}
        onClose={() => setBlurbOpen(false)}
      >
        <div className="img-container">
          <img src={movies[selectedMatchup?.winner || "0"]?.img} />
        </div>
        <div
          className="bracket-blurb"
          dangerouslySetInnerHTML={{ __html: blurb }}
        />
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  const movies: any = {};

  if (state.movieStore?.movies) {
    state.movieStore?.movies.forEach((movie: Movie) => {
      movies[movie.id] = movie;
    });
  }

  return {
    movies,
    bracketData: state.bracketStore?.bracketData,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    loadBracketData: (data: any) =>
      dispatch({ type: "bracket/load", payload: data }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Bracket);
