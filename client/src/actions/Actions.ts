import { Category } from "../models/Category";
import { FilterMap, FilterType } from "../models/Filter";
import { Movie } from "../models/Movie";
import {
  ListCategoriesQuery,
  ListMoviesQuery,
  RefreshCacheQuery,
} from "./Queries";
import { gqlRequest } from "./Requests";

export const loadMoviesFromServer = async (
  loadMovies: (movies: Movie[]) => void,
  refreshCache: boolean,
  filters?: FilterMap
) => {
  if (refreshCache) {
    await fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query: RefreshCacheQuery }),
    });
  }

  const allDataResp = await fetch("/getalldata");

  let allData = await allDataResp.json();

  const categoriesRes = await gqlRequest(ListCategoriesQuery);

  //   console.log(await categoriesRes.json());

  //   console.log(filters);

  let filtersAsList: any = [];

  Object.keys(filters || {}).forEach((key) => {
    // @ts-ignore
    const f = filters[key];

    let filterName = "";

    switch (f.type) {
      case FilterType.DECADE:
        filterName = "DECADE";
        break;
      case FilterType.END_DATE:
        filterName = "END_DATE";
        break;
      case FilterType.FORMAT:
        filterName = "FORMAT";
        break;
      case FilterType.LABEL:
        filterName = "LABEL";
        break;
      case FilterType.START_DATE:
        filterName = "START_DATE";
        break;
      case FilterType.TAG:
        filterName = "TAG";
        break;
      case FilterType.WATCHLIST:
        filterName = "WATCHLIST";
        break;
      case FilterType.YEAR:
        filterName = "YEAR";
        break;
      case FilterType.YEAR_END:
        filterName = "YEAR_END";
        break;
      case FilterType.YEAR_START:
        filterName = "YEAR_START";
        break;
    }

    console.log(filterName);

    filtersAsList.push({
      field: filterName,
      values: [f.value],
    });
  });

  const movieList = await gqlRequest(ListMoviesQuery, {
    filters: filtersAsList,
  });

  const listMoviesResp = await movieList.json();
  const categoriesJson = await categoriesRes.json();
  let categories = categoriesJson.data.listCategories.categories;
  let remoteMovies = listMoviesResp.data.listMovies.all;

  remoteMovies.sort((a: any, b: any) => {
    return a.id - b.id;
  });

  let remoteMovieMatches = listMoviesResp.data.listMovies.matches;

  remoteMovieMatches.sort((a: any, b: any) => {
    return a.id - b.id;
  });

  categories.sort((a: Category, b: Category) => {
    return a.order - b.order;
  });

  loadMovies({
    ...allData,
    remoteMovieData: remoteMovies,
    remoteFilteredMovieData: remoteMovieMatches,
    categories,
  });
};
