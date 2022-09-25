import { Movie } from "../models/Movie";
import { CollectedMovieData, MovieDataItem } from "../types/MovieTypes";

/**
 * Takes raw movieData received from the server and converts it into a list of Movie objects
 *
 * @param movieData Data from the server call
 * @returns         A list of Movie objects
 */
export const convertToViewModel = (movieData: any): Movie[] => {
  return movieData
    .filter((m: any) => m.myRating)
    .map((m: any) => {
      return {
        ...m,
        date: m.watchedDate,
        rating: m.myRating,
        runtimeMins: m.runtime,
        ratingDiff: (m.myRating - m.userRating * 2).toFixed(2),
      };
    });
};

/**
 * Given a list of movies, collect some data about them (earliest/latest years, cast/directors/genres)
 *
 * @param movies    List of movies
 * @returns         CollectedMovieData object with the collected info
 */
export const collectMovieData = (movies: Movie[]): CollectedMovieData => {
  // track min/max years.  start with "earliest" as 3000 since we know for sure we'll have something before that to be the new min
  // "latest" as 1800 because we know for sure we'll have something after that to be the new max
  let earliestMovieYear = 3000;
  let latestMovieYear = 1800;

  let castSet = new Set<string>();
  let directorSet = new Set<string>();
  let genreSet = new Set<string>();

  let castMap = new Map<string, number>();
  let directorMap = new Map<string, number>();
  let genreMap = new Map<string, number>();

  movies.forEach((m: Movie) => {
    if (m.year < earliestMovieYear) {
      earliestMovieYear = m.year;
    }
    if (m.year > latestMovieYear) {
      latestMovieYear = m.year;
    }

    m.directors?.forEach((d) => {
      directorSet.add(d);
      directorMap.set(d, (directorMap.get(d) || 0) + 1);
    });
    m.cast?.forEach((d) => {
      castSet.add(d);
      castMap.set(d, (castMap.get(d) || 0) + 1);
    });
    m.genres?.forEach((d) => {
      genreSet.add(d);
      genreMap.set(d, (genreMap.get(d) || 0) + 1);
    });
  });

  const comparator = (a: [string, number], b: [string, number]): number => {
    return b[1] - a[1];
  };

  const makeTopList = (map: Map<string, number>): MovieDataItem[] => {
    return Array.from(map.entries())
      .sort(comparator)
      .map((i) => ({ name: i[0], count: i[1] }))
      .filter((i) => i.name !== "Show All…")
      .slice(0, 10);
  };

  return {
    castSet,
    directorSet,
    genreSet,
    earliestMovieYear,
    latestMovieYear,
    topCast: makeTopList(castMap),
    topDirectors: makeTopList(directorMap),
    topGenres: makeTopList(genreMap),
  };
};
