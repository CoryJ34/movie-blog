export interface Movie {
  id: string;
  title: string;
  img: string;
  date: string;
  content: string[];
  rating: string;
  year: number;
  category: string;
  categoryCls: string;
  subCategory?: string;
  order?: string;
  tags: string[];
  label: string;
  format: string;
  ratingDiff: string;
  runtimeMins: number;
  // lbox: {
  //   cast: string[];
  //   directors: string[];
  //   genres: string[];
  //   rating: string;
  //   tagline: string;
  //   summary: string;
  //   runtime: string;
  //   poster: string;
  //   backdrop: string;
  // };
  userRating: number;
  cast: string[];
  directors: string[];
  genres: string[];
  tagline: string;
  summary: string;
  runtime: string;
  poster: string;
  backdrop: string;
}
