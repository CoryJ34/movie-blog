export const ListMoviesQuery = `query ListMovies($filters: [MovieFilter]) {
    listMovies(filters: $filters) {
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
      all {
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

export const ListCategoriesQuery = `query ListCategories {
    listCategories {
        categories {
            name,
            cls,
            order,
            hexColor,
            type,
            route,
            subCategories {
                size,
                name,
                hexColor,
                fontHexColor
            },
            remarks {
                opening {
                    title,
                    date,
                    content
                },
                closing {
                    title,
                    date,
                    content
                }
            },
            rounds {
              round,
              matchups {
                a,
                b,
                winner,
                blurb
              }
            }
        }
    }
}`;
