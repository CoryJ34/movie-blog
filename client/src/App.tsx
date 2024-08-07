import React, { useEffect } from "react";
import { connect } from "react-redux";
import "./App.css";
import Home from "./components/home/Home";
import { Movie } from "./models/Movie";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import DetailDialog from "./components/DetailDialog";
import Bracket from "./components/Bracket";
import SubCategorized from "./components/subcategorized/SubCategorized";
import MovieList from "./components/list/MovieList";
import PageLayout from "./components/PageLayout";
import CategorizedList from "./components/list/CategorizedList";
import { Filter, FilterMap } from "./models/Filter";
import References from "./components/references/References";
import Milestones from "./components/milestones/Milestones";
import Footer from "./components/common/Footer/Footer";
import Ratings from "./components/ratings/Ratings";
import VHSShelf from "./components/vhs/VHSShelf";
import Migrater from "./components/Migrater";
import { loadMoviesFromServer } from "./actions/Actions";
import { USE_SERVER_SIDE_FILTERING } from "./configuration/Configuration";
import { Category } from "./models/Category";
import { Box, CircularProgress } from "@material-ui/core";
import PostEditor from "./components/editor/PostEditor";
import WatchListEditor from "./components/editor/WatchListEditor";

interface Props {
  movies: Movie[];
  filters: FilterMap;
  filteredMovies: Movie[];
  selectedMovie: Movie;
  categories: Category[];
  detailOpen: boolean;
  loadMovies: (movies: Movie[]) => void;
  removeFilter: (filter: Filter) => void;
  resetFilter: () => void;
  openDetail: (movie: Movie) => void;
  closeDetail: () => void;
}
interface CategoryMap {
  [key: string]: any;
}

function App(props: Props) {
  const {
    movies,
    filters,
    categories,
    filteredMovies,
    selectedMovie,
    detailOpen,
    resetFilter,
    openDetail,
    closeDetail,
  } = props;

  useEffect(() => {
    loadMoviesFromServer(props.loadMovies, false);
  }, []);

  useEffect(() => {
    if (USE_SERVER_SIDE_FILTERING) {
      loadMoviesFromServer(props.loadMovies, false, filters);
    }
  }, [filters]);

  if (!movies) {
    return (
      <Box
        display="flex"
        width={"100%"}
        height={"100vh"}
        alignItems="center"
        justifyContent="center"
        sx={{
          color: "#AA5522",
        }}
      >
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  let moviesByCategory: CategoryMap = {};

  movies.forEach((m) => {
    const category = m.category;

    if (!moviesByCategory[category]) {
      moviesByCategory[category] = [];
    }

    moviesByCategory[category].push(m);
  });

  return (
    <div className="App">
      <Router>
        <div className="page-content">
          <Switch>
            {process.env.NODE_ENV === "development" && (
              <Route path="/migrate">
                <Migrater />
              </Route>
            )}
            <Route path="/post/edit">
              <PostEditor />
            </Route>
            <Route path="/watchlist/edit">
              <WatchListEditor />
            </Route>
            <Route path="/movies">
              <MovieList
                filteredMovies={filteredMovies}
                filters={filters}
                openDetail={openDetail}
              />
            </Route>
            {categories.map((c: Category) => {
              // build routes for each category type (SubCategory, Bracket or Simple)
              if (c.type === "SubCategory") {
                let weekMap: any = {};
                let customWeekCounts: any = {};

                for (var i = 0; i < (c.subCategories || []).length; i++) {
                  const weekNum = i + 1;
                  const sc = (c.subCategories || [])[i];

                  weekMap[`Week ${weekNum}`] = sc.name;
                  customWeekCounts[sc.name] = sc.size;
                }

                return (
                  <Route path={c.route}>
                    <PageLayout
                      movies={moviesByCategory[c.name]}
                      presetCategory={c}
                      hideSort={true}
                    >
                      <SubCategorized
                        category={c}
                        movies={movies}
                        openDetail={openDetail}
                        subCategoryMap={weekMap}
                        customWeekCounts={customWeekCounts}
                      />
                    </PageLayout>
                  </Route>
                );
              } else if (c.type === "Bracket") {
                return (
                  <Route path={c.route}>
                    <PageLayout
                      movies={moviesByCategory[c.name]}
                      presetCategory={c}
                      hideSort={true}
                    >
                      <Bracket bracketData={c.rounds || []} />
                    </PageLayout>
                  </Route>
                );
              }

              return (
                <Route path={c.route}>
                  <PageLayout
                    movies={moviesByCategory[c.name]}
                    presetCategory={c}
                  >
                    <CategorizedList
                      filteredMovies={filteredMovies}
                      openDetail={openDetail}
                      presetCategory={c}
                    />
                  </PageLayout>
                </Route>
              );
            })}
            <Route path="/references">
              <References />
            </Route>
            <Route path="/milestones">
              <Milestones />
            </Route>
            <Route path="/ratings">
              <Ratings />
            </Route>
            <Route path="/shelf">
              <VHSShelf />
            </Route>
            <Route>
              <Home
                movies={movies}
                categories={categories}
                openDetail={openDetail}
                resetFilters={resetFilter}
              />
            </Route>
          </Switch>
        </div>
        <Footer />
      </Router>
      <DetailDialog
        detailOpen={detailOpen}
        closeDetail={closeDetail}
        selectedMovie={selectedMovie}
      />
    </div>
  );
}

const mapStateToProps = (state: any) => {
  return {
    movies: state.movieStore?.movies,
    filters: state.movieStore?.filters,
    categories: state.movieStore?.categories,
    filteredMovies: state.movieStore?.filteredMovies,
    selectedMovie: state.detailStore?.selectedMovie,
    detailOpen: state.detailStore?.detailOpen,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    loadMovies: (allData: any) =>
      dispatch({
        type: "movies/load",
        payload: allData,
      }),
    sort: (sortField: string, sortDir: string) =>
      dispatch({ type: "movies/sort", sortField, sortDir }),
    openDetail: (movie: Movie) =>
      dispatch({ type: "detail/open", selectedMovie: movie }),
    closeDetail: () => dispatch({ type: "detail/close" }),
    removeFilter: (filter: Filter) =>
      dispatch({ type: "movies/removeFilter", filter }),
    resetFilter: () => dispatch({ type: "movies/resetFilter" }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
