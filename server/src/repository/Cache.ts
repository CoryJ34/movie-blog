const Cache = {
  movies: null,
};

export const clearMovieCache = () => {
  Cache.movies = null;
};

export default Cache;
