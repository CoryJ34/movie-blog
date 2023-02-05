import { Movie } from "../../../models/Movie";

interface Props {
  movies: Movie[];
  averageRating: number;
  totalRuntimeMins: number;
  minsPerMovie: number;
  wordCountMap: { [key: string]: number };
}

const SummaryInfo = (props: Props) => {
  const {
    movies,
    averageRating,
    totalRuntimeMins,
    minsPerMovie,
    wordCountMap,
  } = props;

  let totalWords = 0.0;
  Object.values(wordCountMap).forEach((currCount) => {
    totalWords += currCount;
  });

  const avgWordsPerPost = totalWords / Object.keys(wordCountMap).length;

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
    </>
  );
};

export default SummaryInfo;
