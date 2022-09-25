import { MovieDataItem } from "../../../types/MovieTypes";

interface Props {
  label: string;
  data: MovieDataItem[];
}

const TopMovieItems = (props: Props) => {
  const { label, data } = props;
  return (
    <>
      <div className="movie-data-item-header">{label}</div>
      {(data || []).map((c) => (
        <div className="movie-data-item">{`${c.name} (${c.count})`}</div>
      ))}
    </>
  );
};

export default TopMovieItems;
