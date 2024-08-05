interface Movie {
  id: number;
  cast: string[];
  directors: string[];
  genres: string[];
  summary: string;
  tagline?: string;
  rating?: string;
  runtime: string;
  poster?: string;
  backdrop?: string;
  title: string;
  year?: string;
}

export default Movie;
