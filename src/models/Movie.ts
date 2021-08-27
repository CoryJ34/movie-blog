import TitleBreakout from "./TitleBreakout";

export interface Movie {
  id: string;
  title: string;
  img: string;
  date: string;
  content: string[];
  rating: string;
  titleBreakout: TitleBreakout;
  tags: string[];
  label: string;
  format: string;
  ratingDiff: number;
  runtimeMins: number;
  lbox: {
    cast: string[];
    directors: string[];
    genres: string[];
    rating: string;
    tagline: string;
    summary: string;
    runtime: string;
    poster: string;
    backdrop: string;
  };
}
