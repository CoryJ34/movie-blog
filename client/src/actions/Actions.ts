import { Movie } from "../models/Movie";
import { ListMoviesQuery, RefreshCacheQuery } from "./Queries";

export const loadMoviesFromServer = async (
  loadMovies: (movies: Movie[]) => void,
  refreshCache: boolean
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

  const movieList = await fetch("/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query: ListMoviesQuery }),
  });

  const listMoviesResp = await movieList.json();

  console.log(listMoviesResp.data.listMovies.matches);

  loadMovies({
    ...allData,
    remoteMovieData: listMoviesResp.data.listMovies.matches,
  });
};
