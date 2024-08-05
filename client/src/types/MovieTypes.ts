import { Filter } from "../models/Filter";

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
  wordCountMap: { [key: string]: number };
}

export interface MovieSummaryInfo {
  averageRating: number;
  allCategories: { [key: string]: string };
  allTags: string[];
  totalRuntimeMins: number;
  minsPerMovie: number;
  earliestDate?: Date;
  latestDate?: Date;
}

export interface CollectedFilterData {
  startDateFilterValue: Date;
  endDateFilterValue: Date;
  startDateFilter: Filter | null;
  endDateFilter: Filter | null;
  minYearFilterValue: number;
  maxYearFilterValue: number;
  directorFilter: Filter | null;
  castFilter: Filter | null;
  genreFilter: Filter | null;
}
