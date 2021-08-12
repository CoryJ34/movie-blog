import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { connect } from "react-redux";
import { Movie } from "../../models/Movie";
import "./styles/Ratings.scss";

const Ratings = (props: {
  movies: Movie[];
  numWayUnder: number;
  numUnder: number;
  numBarelyUnder: number;
  numClose: number;
  numBarelyOver: number;
  numOver: number;
  numWayOver: number;
}) => {
  return (
    <div className="ratings-page">
      <div className="meta">
        <div className="item">
          <div className="label">Way Under</div>
          <div className="value">{props.numWayUnder}</div>
        </div>
        <div className="item">
          <div className="label">Under</div>
          <div className="value">{props.numUnder}</div>
        </div>
        <div className="item">
          <div className="label">Barely Under</div>
          <div className="value">{props.numBarelyUnder}</div>
        </div>
        <div className="item">
          <div className="label">Close</div>
          <div className="value">{props.numClose}</div>
        </div>
        <div className="item">
          <div className="label">Barely Over</div>
          <div className="value">{props.numBarelyOver}</div>
        </div>
        <div className="item">
          <div className="label">Over</div>
          <div className="value">{props.numOver}</div>
        </div>
        <div className="item">
          <div className="label">Way Over</div>
          <div className="value">{props.numWayOver}</div>
        </div>
      </div>
      <Table className="ratings-container">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Movie</TableCell>
            <TableCell>My Rating</TableCell>
            <TableCell>LBOX Rating</TableCell>
            <TableCell>Diff</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.movies.map((m, i) => {
            return (
              <TableRow className="movie">
                <TableCell className="num">{i + 1}</TableCell>
                <TableCell className="title">{m.title}</TableCell>
                <TableCell className="my">
                  {parseFloat(m.rating).toFixed(2)}
                </TableCell>
                <TableCell className="lbox">
                  {(parseFloat(m.lbox.rating) * 2).toFixed(2)}
                </TableCell>
                <TableCell className="diff">{m.ratingDiff}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  let sortedByRatingDiff = [...(state.movieStore?.movies || [])];

  sortedByRatingDiff.sort((a: Movie, b: Movie) => {
    return a.ratingDiff - b.ratingDiff;
  });

  let numWayUnder = 0;
  let numUnder = 0;
  let numBarelyUnder = 0;
  let numClose = 0;
  let numBarelyOver = 0;
  let numOver = 0;
  let numWayOver = 0;

  sortedByRatingDiff.forEach((m: Movie) => {
    if (m.ratingDiff < -1.5) {
      numWayUnder++;
    } else if (m.ratingDiff < -0.5) {
      numUnder++;
    } else if (m.ratingDiff < -0.1) {
      numBarelyUnder++;
    } else if (m.ratingDiff < 0.1) {
      numClose++;
    } else if (m.ratingDiff < 0.5) {
      numBarelyOver++;
    } else if (m.ratingDiff < 1.5) {
      numOver++;
    } else {
      numWayOver++;
    }
  });

  return {
    movies: sortedByRatingDiff,
    numWayUnder,
    numUnder,
    numBarelyUnder,
    numClose,
    numBarelyOver,
    numOver,
    numWayOver,
  };
};

export default connect(mapStateToProps)(Ratings);
