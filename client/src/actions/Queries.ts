export const ListMoviesQuery = `query ListMovies {
    listMovies {
      count
      matches {
        id,
        title
        year,
        genres,
        summary,
        backdrop,
        cast,
        poster,
        userRating,
        runtime,
        tagline,
        directors,
        myRating,
        label,
        img,
        watchedDate,
        content,
        categoryCls,
        subCategory,
        order,
        tags,
        format,
        category
      }
    }
  }`;

export const RefreshCacheQuery = `query RefreshCache {
    refreshCache
  }`;
