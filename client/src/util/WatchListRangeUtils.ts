import dateFormat from "dateformat";
import { Movie } from "../models/Movie";

const offsetDate = (date: string, add: boolean) => {
  let newDate = add
    ? new Date(date).getTime() + 1000 * 60 * 60 * 4
    : new Date(date).getTime() - 1000 * 60 * 60 * 20;

  return dateFormat(newDate, "mmmm d, yyyy");
};

const makeWatchListRanges = (movies: Movie[]) => {
  const watchListRanges: any[] = [];
  const sortedByReverseID = [...movies];

  // reverse ID order (reverse watched date)
  sortedByReverseID.sort(
    (a: Movie, b: Movie) => parseInt(b.id) - parseInt(a.id)
  );

  let currWL = null;

  for (let i = sortedByReverseID.length - 1; i >= 0; i--) {
    const currMovie = sortedByReverseID[i];

    if (currMovie.titleBreakout.category !== currWL) {
      if (currWL) {
        watchListRanges[watchListRanges.length - 1].lastDate = offsetDate(
          sortedByReverseID[i + 1].date,
          true
        );
      }

      watchListRanges.push({
        title: currMovie.titleBreakout.category,
        firstDate: currMovie.date,
      });

      currWL = currMovie.titleBreakout.category;
    }

    if (i === 0) {
      watchListRanges[watchListRanges.length - 1].lastDate = offsetDate(
        currMovie.date,
        true
      );
    }
  }

  return watchListRanges;
};

export default makeWatchListRanges;
