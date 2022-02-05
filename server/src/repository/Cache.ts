const Cache = {
  movies: null,
  categories: null,
};

export const clearMovieCache = () => {
  // need separate clear functions per field?
  Cache.movies = null;
  Cache.categories = null;
};

export default Cache;
