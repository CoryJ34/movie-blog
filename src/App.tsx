import React, { useEffect } from "react";
import { connect } from "react-redux";
import "./App.css";
import Home from "./components/home/Home";
import { Movie } from "./models/Movie";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import DetailDialog from "./components/DetailDialog";
import Bracket from "./components/Bracket";
import Halloween2020 from "./components/Halloween2020";
import SubCategorized from "./components/subcategorized/SubCategorized";
import { CATEGORIES } from "./common/constants";
import MovieList from "./components/list/MovieList";
import { CategoryMeta } from "./models/CategoryMeta";
import PageLayout from "./components/PageLayout";
import CategorizedList from "./components/list/CategorizedList";
import { Filter } from "./models/Filter";
import References from "./components/references/References";
import Milestones from "./components/milestones/Milestones";

interface Props {
  movies: Movie[];
  categoryMeta: CategoryMeta;
  filteredMovies: Movie[];
  selectedMovie: Movie;
  detailOpen: boolean;
  filters: Filter[];
  loadMovies: () => void;
  removeFilter: (filter: Filter) => void;
  resetFilter: () => void;
  openDetail: (movie: Movie) => void;
  closeDetail: () => void;
}

interface CategoryMap {
  [key: string]: any;
}

function App(props: Props) {
  useEffect(() => {
    // Load movies on App load
    props.loadMovies();
  }, []);

  const {
    movies,
    categoryMeta,
    filteredMovies,
    selectedMovie,
    detailOpen,
    resetFilter,
    openDetail,
    closeDetail,
  } = props;

  if (!movies) {
    // TODO: Add cool loading widget, but right now, data is local so movies load too fast to see
    return <div>Loading...</div>;
  }

  let moviesByCategory: CategoryMap = {};

  // TODO: Should each list component have an onMount that triggers a filter action?
  movies.reverse().forEach((m) => {
    const category = m.titleBreakout.category;

    if (!moviesByCategory[category]) {
      moviesByCategory[category] = [];
    }

    moviesByCategory[category].push(m);
  });

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/movies">
            <MovieList
              categoryMeta={categoryMeta}
              filteredMovies={filteredMovies}
              openDetail={openDetail}
            />
          </Route>
          <Route path="/gamera">
            <PageLayout
              movies={moviesByCategory[CATEGORIES.GAMERA]}
              presetCategory={CATEGORIES.GAMERA}
            >
              <CategorizedList
                categoryMeta={categoryMeta}
                filteredMovies={filteredMovies}
                openDetail={openDetail}
                presetCategory={CATEGORIES.GAMERA}
              />
            </PageLayout>
          </Route>
          <Route path="/randomizer">
            <PageLayout
              movies={moviesByCategory[CATEGORIES.RANDOMIZER]}
              presetCategory={CATEGORIES.RANDOMIZER}
            >
              <CategorizedList
                categoryMeta={categoryMeta}
                filteredMovies={filteredMovies}
                openDetail={openDetail}
                presetCategory={CATEGORIES.RANDOMIZER}
              />
            </PageLayout>
          </Route>
          <Route path="/bracket">
            <PageLayout
              movies={moviesByCategory[CATEGORIES.MARCH_MADNESS]}
              presetCategory={CATEGORIES.MARCH_MADNESS}
              hideSort={true}
            >
              <Bracket />
            </PageLayout>
          </Route>
          <Route path="/halloween2020">
            <PageLayout
              movies={moviesByCategory[CATEGORIES.HALLOWEEN_2020]}
              presetCategory={CATEGORIES.HALLOWEEN_2020}
              hideSort={true}
            >
              <Halloween2020 movies={movies} openDetail={openDetail} />
            </PageLayout>
          </Route>
          <Route path="/novdec2020">
            <PageLayout
              movies={moviesByCategory[CATEGORIES.NOV_DEC_2020]}
              presetCategory={CATEGORIES.NOV_DEC_2020}
              hideSort={true}
            >
              <SubCategorized
                category={CATEGORIES.NOV_DEC_2020}
                movies={movies}
                openDetail={openDetail}
              />
            </PageLayout>
          </Route>
          <Route path="/genres">
            <PageLayout
              movies={moviesByCategory[CATEGORIES.GENRES]}
              presetCategory={CATEGORIES.GENRES}
              hideSort={true}
            >
              <SubCategorized
                category={CATEGORIES.GENRES}
                movies={movies}
                openDetail={openDetail}
              />
            </PageLayout>
          </Route>
          <Route path="/finishtheserieshorror">
            <PageLayout
              movies={moviesByCategory[CATEGORIES.FINISH_THE_SERIES_HORROR]}
              presetCategory={CATEGORIES.FINISH_THE_SERIES_HORROR}
            >
              <CategorizedList
                categoryMeta={categoryMeta}
                filteredMovies={filteredMovies}
                openDetail={openDetail}
                presetCategory={CATEGORIES.FINISH_THE_SERIES_HORROR}
              />
            </PageLayout>
          </Route>
          <Route path="/finishtheseriesnonhorror">
            <PageLayout
              movies={moviesByCategory[CATEGORIES.FINISH_THE_SERIES_NON_HORROR]}
              presetCategory={CATEGORIES.FINISH_THE_SERIES_NON_HORROR}
            >
              <CategorizedList
                categoryMeta={categoryMeta}
                filteredMovies={filteredMovies}
                openDetail={openDetail}
                presetCategory={CATEGORIES.FINISH_THE_SERIES_NON_HORROR}
              />
            </PageLayout>
          </Route>
          <Route path="/decadesofhorror">
            <PageLayout
              movies={moviesByCategory[CATEGORIES.DECADES_OF_HORROR]}
              presetCategory={CATEGORIES.DECADES_OF_HORROR}
            >
              <CategorizedList
                categoryMeta={categoryMeta}
                filteredMovies={filteredMovies}
                openDetail={openDetail}
                presetCategory={CATEGORIES.DECADES_OF_HORROR}
              />
            </PageLayout>
          </Route>
          <Route path="/references">
            <References />
          </Route>
          <Route path="/milestones">
            <Milestones />
          </Route>
          <Route>
            <Home
              movies={movies}
              openDetail={openDetail}
              resetFilters={resetFilter}
            />
          </Route>
        </Switch>
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
    categoryMeta: state.movieStore?.categoryMeta,
    filteredMovies: state.movieStore?.filteredMovies,
    selectedMovie: state.detailStore?.selectedMovie,
    detailOpen: state.detailStore?.detailOpen,
    filters: state.movieStore?.filters,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    loadMovies: () => dispatch({ type: "movies/load" }),
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
