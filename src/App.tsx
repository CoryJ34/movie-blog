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

interface Props {
  movies: Movie[];
  filteredMovies: Movie[];
  currentFilter: string;
  selectedMovie: Movie;
  detailOpen: boolean;
  loadMovies: () => void;
  filterByCategory: (filter: string) => void;
  resetFilter: () => void;
  sort: (sortField: string, sortDir: string) => void;
  openDetail: (movie: Movie) => void;
  closeDetail: () => void;
}

function App(props: Props) {
  useEffect(() => {
    // Load movies on App load
    props.loadMovies();
  }, []);

  const {
    movies,
    filteredMovies,
    currentFilter,
    selectedMovie,
    detailOpen,
    filterByCategory,
    resetFilter,
    sort,
    openDetail,
    closeDetail,
  } = props;

  if (!movies) {
    // TODO: Add cool loading widget, but right now, data is local so movies load too fast to see
    return <div>Loading...</div>;
  }

  const gameraMovies = movies.filter(m => m.titleBreakout.category === CATEGORIES.GAMERA).reverse();
  const randomizerMovies = movies.filter(m => m.titleBreakout.category === CATEGORIES.RANDOMIZER).reverse();

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/movies">
            <MovieList
              movies={movies}
              filteredMovies={filteredMovies}
              currentFilter={currentFilter}
              filterByCategory={filterByCategory}
              resetFilter={resetFilter}
              sort={sort}
              openDetail={openDetail}
            />
          </Route>
          <Route path="/gamera">
            <MovieList
              movies={gameraMovies}
              filteredMovies={gameraMovies}
              currentFilter={currentFilter}
              filterByCategory={filterByCategory}
              resetFilter={resetFilter}
              sort={sort}
              openDetail={openDetail}
              disableFiltering={true}
            />
          </Route>
          <Route path="/randomizer">
            <MovieList
              movies={randomizerMovies}
              filteredMovies={randomizerMovies}
              currentFilter={currentFilter}
              filterByCategory={filterByCategory}
              resetFilter={resetFilter}
              sort={sort}
              openDetail={openDetail}
              disableFiltering={true}
            />
          </Route>
          <Route path="/bracket">
            <Bracket />
          </Route>
          <Route path="/halloween2020">
            <Halloween2020 movies={movies} openDetail={openDetail} />
          </Route>
          <Route path="/novdec2020">
            <SubCategorized
              category={CATEGORIES.NOV_DEC_2020}
              movies={movies}
              openDetail={openDetail}
            />
          </Route>
          <Route path="/genres">
            <SubCategorized
              category={CATEGORIES.GENRES}
              movies={movies}
              openDetail={openDetail}
            />
          </Route>
          <Route>
            <Home movies={movies} openDetail={openDetail} />
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
    filteredMovies: state.movieStore?.filteredMovies,
    currentFilter: state.movieStore?.currentFilter,
    selectedMovie: state.detailStore?.selectedMovie,
    detailOpen: state.detailStore?.detailOpen,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    loadMovies: () => dispatch({ type: "movies/load" }),
    filterByCategory: (filter: string) =>
      dispatch({ type: "movies/filterByCategory", filter }),
    resetFilter: () => dispatch({ type: "movies/resetFilter" }),
    sort: (sortField: string, sortDir: string) =>
      dispatch({ type: "movies/sort", sortField, sortDir }),
    openDetail: (movie: Movie) =>
      dispatch({ type: "detail/open", selectedMovie: movie }),
    closeDetail: () => dispatch({ type: "detail/close" }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
