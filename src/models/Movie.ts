import TitleBreakout from "./TitleBreakout";

export interface Movie {
  id: string,
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
  lbox: {
    cast: string[],
    directors: string[],
    genres: string[],
    rating: string
  }
}
