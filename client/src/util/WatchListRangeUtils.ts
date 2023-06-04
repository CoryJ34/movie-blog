import dateFormat from "dateformat";
import { Movie } from "../models/Movie";

const offsetDate = (date: string, add: boolean) => {
  let newDate = add
    ? new Date(date).getTime() + 1000 * 60 * 60 * 4
    : new Date(date).getTime() - 1000 * 60 * 60 * 20;

  return dateFormat(newDate, "mmmm d, yyyy");
};

/**
 * Break out date ranges for watchlists.  Say there are watchlists: Halloween 2020, Winter 2021, Sequels
 * in that order.  Given a list of movies in those watchlists, this organizes the watchlists by [start, end] dates
 * ie:
 * Halloween 2020 - [August 30, 2020 - October 27, 2020]
 * Winter 2021 - [January 10, 2021 - February 15, 2021]
 * Sequels - [March 19, 2021 - May 5, 2021]
 *
 * @param movies
 * @returns
 */
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

    if (currMovie.category !== currWL) {
      if (currWL) {
        watchListRanges[watchListRanges.length - 1].lastDate = offsetDate(
          sortedByReverseID[i + 1].date,
          true
        );

        watchListRanges[watchListRanges.length - 1].lastID =
          sortedByReverseID.length - 1 - i;
      }

      watchListRanges.push({
        title: currMovie.category,
        firstDate: currMovie.date,
        firstID: sortedByReverseID.length - 1 - i,
      });

      currWL = currMovie.category;
    }

    if (i === 0) {
      watchListRanges[watchListRanges.length - 1].lastDate = offsetDate(
        currMovie.date,
        true
      );

      watchListRanges[watchListRanges.length - 1].lastID =
        sortedByReverseID.length - 1 - i;
    }
  }

  return watchListRanges;
};

export default makeWatchListRanges;
