import { Movie } from "../models/Movie";

const ratingComparator = (a: Movie, b: Movie): number => {
  return parseFloat(a.rating) - parseFloat(b.rating);
};

const yearComparator = (a: Movie, b: Movie): number => {
  return a.year - b.year;
};

const watchedDateComparator = (a: Movie, b: Movie): number => {
  return parseInt(a.id, 10) - parseInt(b.id, 10);
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

  let sorted = [...(movies || [])];
  sorted.sort(comparator);

  if (sortDir === "DESC") {
    sorted = sorted.reverse();
  }

  return sorted;
};

export default sort;
