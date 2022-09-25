import { Movie } from "../../../models/Movie";

interface Props {
  movies: Movie[];
  averageRating: number;
  totalRuntimeMins: number;
  minsPerMovie: number;
}

const SummaryInfo = (props: Props) => {
  const { movies, averageRating, totalRuntimeMins, minsPerMovie } = props;

  return (
    <>
      <div>{`Total movies: ${movies.length}`}</div>
      <div>{`Average rating: ${averageRating.toFixed(2)}`}</div>
      <div>{`Total runtime: ${Math.floor(totalRuntimeMins / 60)} hr ${
        totalRuntimeMins % 60
      } min`}</div>
      <div>{`Average runtime: ${Math.floor(minsPerMovie / 60)} hr ${
        minsPerMovie % 60
      } min`}</div>
    </>
  );
};

export default SummaryInfo;
