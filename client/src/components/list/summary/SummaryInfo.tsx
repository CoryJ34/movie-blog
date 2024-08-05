import { Movie } from "../../../models/Movie";

interface Props {
  movies: Movie[];
  averageRating: number;
  totalRuntimeMins: number;
  minsPerMovie: number;
  wordCountMap: { [key: string]: number };
  earliestDate?: Date;
  latestDate?: Date;
}

const SummaryInfo = (props: Props) => {
  const {
    movies,
    averageRating,
    totalRuntimeMins,
    minsPerMovie,
    wordCountMap,
    earliestDate,
    latestDate,
  } = props;

  let totalWords = 0.0;
  Object.values(wordCountMap).forEach((currCount) => {
    totalWords += currCount;
  });

  const avgWordsPerPost = totalWords / Object.keys(wordCountMap).length;
  let days = 0;
  let timePerDay = "0";
  let moviesPerDay = "0";

  if (earliestDate && latestDate) {
    const diffMs = latestDate.getTime() - earliestDate.getTime();
    days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
    timePerDay = (totalRuntimeMins / days).toFixed(2);
    moviesPerDay = (movies.length / days).toFixed(2);
  }

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
      <div>{`Total words: ${totalWords}`}</div>
      <div>{`Average words per post: ${avgWordsPerPost.toFixed(2)}`}</div>
      <div>{`Number of days: ${days}`}</div>
      <div>{`Time per day: ${timePerDay}`}</div>
      <div>{`Movies per day: ${moviesPerDay}`}</div>
    </>
  );
};

export default SummaryInfo;
