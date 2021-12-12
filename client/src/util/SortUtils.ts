import { Movie } from "../models/Movie";

const ratingComparator = (a: Movie, b: Movie): number => {
  return parseFloat(b.rating) - parseFloat(a.rating);
};

const yearComparator = (a: Movie, b: Movie): number => {
  return b.year - a.year;
};

const watchedDateComparator = (a: Movie, b: Movie): number => {
  return parseInt(b.id, 10) - parseInt(a.id, 10);
};

const sort = (
  movies: Movie[] | null,
  sortField: string | null,
  sortDir: string | null
) => {
  if (!sortField) {
    return movies;
  }

  let comparator = (a: Movie, b: Movie) => {
    return parseInt(a.id, 10) - parseInt(b.id, 10);
  };

  if (sortField === "Year") {
    comparator = yearComparator;
  } else if (sortField === "Rating") {
    comparator = ratingComparator;
  } else if (sortField === "WatchedDate") {
    comparator = watchedDateComparator;
  }

  let sorted = [...(movies || [])].sort(comparator);

  if (sortDir === "DESC") {
    sorted = sorted.reverse();
  }

  return sorted;
};

export default sort;
