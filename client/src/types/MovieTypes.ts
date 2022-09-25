export interface MovieDataItem {
  name: string;
  count: number;
}

export interface CollectedMovieData {
  castSet: Set<string>;
  directorSet: Set<string>;
  genreSet: Set<string>;
  earliestMovieYear: number;
  latestMovieYear: number;
  topDirectors: MovieDataItem[];
  topCast: MovieDataItem[];
  topGenres: MovieDataItem[];
}
