import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { connect } from "react-redux";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Movie } from "../../models/Movie";
import ListSummary from "../list/summary/ListSummary";
import "./styles/Ratings.scss";

const Ratings = (props: {
  movies: Movie[];
  filteredMovies: Movie[];
  numWayUnder: number;
  numUnder: number;
  numBarelyUnder: number;
  numClose: number;
  numBarelyOver: number;
  numOver: number;
  numWayOver: number;
  totalDiff: string;
  totalDev: string;
  diffAvg: string;
}) => {
  return (
    <div className="ratings-page">
      <ListSummary movies={props.movies} />
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
        <div className="item">
          <div className="label">Total Diff</div>
          <div className="value">{props.totalDiff}</div>
        </div>
        <div className="item">
          <div className="label">Avg Diff</div>
          <div className="value">{props.diffAvg}</div>
        </div>
        <div className="item">
          <div className="label">Dev</div>
          <div className="value">{props.totalDev}</div>
        </div>
        <div
          className="rating-type-distribution"
          style={{ width: "100%", height: "150px", marginTop: "30px" }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { type: "Way Under", count: props.numWayUnder },
                { type: "Under", count: props.numUnder },
                { type: "Barely Under", count: props.numBarelyUnder },
                { type: "Close", count: props.numClose },
                { type: "Barely Over", count: props.numBarelyOver },
                { type: "Over", count: props.numOver },
                { type: "Way Over", count: props.numWayOver },
              ]}
            >
              <Tooltip />
              <YAxis />
              <XAxis dataKey="type" />
              <Bar dataKey="count" fill="#5566AA" />
            </BarChart>
          </ResponsiveContainer>
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
          {props.filteredMovies.map((m, i) => {
            return (
              <TableRow className="movie">
                <TableCell className="num">{i + 1}</TableCell>
                <TableCell className="title">{m.title}</TableCell>
                <TableCell className="my">
                  {parseFloat(m.rating).toFixed(2)}
                </TableCell>
                <TableCell className="lbox">
                  {(m.userRating * 2).toFixed(2)}
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
  const allMovies = state.movieStore?.filteredMovies || [];
  let sortedByRatingDiff = [...allMovies];

  sortedByRatingDiff.sort((a: Movie, b: Movie) => {
    return parseFloat(a.ratingDiff) - parseFloat(b.ratingDiff);
  });

  let numWayUnder = 0;
  let numUnder = 0;
  let numBarelyUnder = 0;
  let numClose = 0;
  let numBarelyOver = 0;
  let numOver = 0;
  let numWayOver = 0;

  let total = 0.0;
  let deviation = 0.0;

  sortedByRatingDiff.forEach((m: Movie) => {
    const rDiff = parseFloat(m.ratingDiff);
    if (rDiff < -1.5) {
      numWayUnder++;
    } else if (rDiff < -0.25) {
      numUnder++;
    } else if (rDiff < -0.1) {
      numBarelyUnder++;
    } else if (rDiff < 0.1) {
      numClose++;
    } else if (rDiff < 0.25) {
      numBarelyOver++;
    } else if (rDiff < 1.5) {
      numOver++;
    } else {
      numWayOver++;
    }

    total += rDiff;
    deviation += Math.pow(rDiff, 2);
  });

  return {
    movies: allMovies,
    filteredMovies: sortedByRatingDiff,
    numWayUnder,
    numUnder,
    numBarelyUnder,
    numClose,
    numBarelyOver,
    numOver,
    numWayOver,
    totalDiff: total.toFixed(2),
    totalDev: (deviation / sortedByRatingDiff.length).toFixed(2),
    diffAvg: (total / sortedByRatingDiff.length).toFixed(2),
  };
};

export default connect(mapStateToProps)(Ratings);
