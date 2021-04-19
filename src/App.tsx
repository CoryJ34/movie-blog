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

interface Props {
  movies: Movie[];
  categoryMeta: CategoryMeta;
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

interface CategoryMap {
  [key: string]: any
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

  let moviesByCategory: CategoryMap = {};

  movies.reverse().forEach(m => {
    const category = m.titleBreakout.category;

    if(!moviesByCategory[category]) {
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
              movies={movies}
              categoryMeta={categoryMeta}
              filteredMovies={filteredMovies}
              currentFilter={currentFilter}
              filterByCategory={filterByCategory}
              resetFilter={resetFilter}
              sort={sort}
              openDetail={openDetail}
            />
          </Route>
          <Route path="/gamera">
            <PageLayout
              movies={moviesByCategory[CATEGORIES.GAMERA]}
              categoryMeta={categoryMeta}
              presetCategory={CATEGORIES.GAMERA}
            >
              <MovieList
                movies={moviesByCategory[CATEGORIES.GAMERA]}
                categoryMeta={categoryMeta}
                filteredMovies={moviesByCategory[CATEGORIES.GAMERA]}
                currentFilter={currentFilter}
                filterByCategory={filterByCategory}
                resetFilter={resetFilter}
                sort={sort}
                openDetail={openDetail}
                presetCategory={CATEGORIES.GAMERA}
              />
            </PageLayout>
          </Route>
          <Route path="/randomizer">
            <PageLayout
              movies={moviesByCategory[CATEGORIES.RANDOMIZER]}
              categoryMeta={categoryMeta}
              presetCategory={CATEGORIES.RANDOMIZER}
            >
              <MovieList
                movies={moviesByCategory[CATEGORIES.RANDOMIZER]}
                categoryMeta={categoryMeta}
                filteredMovies={moviesByCategory[CATEGORIES.RANDOMIZER]}
                currentFilter={currentFilter}
                filterByCategory={filterByCategory}
                resetFilter={resetFilter}
                sort={sort}
                openDetail={openDetail}
                presetCategory={CATEGORIES.RANDOMIZER}
              />
            </PageLayout>
          </Route>
          <Route path="/bracket">
            <PageLayout
              movies={moviesByCategory[CATEGORIES.MARCH_MADNESS]}
              categoryMeta={categoryMeta}
              presetCategory={CATEGORIES.MARCH_MADNESS}
            >
              <Bracket />
            </PageLayout>
          </Route>
          <Route path="/halloween2020">
            <PageLayout
              movies={moviesByCategory[CATEGORIES.HALLOWEEN_2020]}
              categoryMeta={categoryMeta}
              presetCategory={CATEGORIES.HALLOWEEN_2020}
            >
              <Halloween2020 movies={movies} openDetail={openDetail} />
            </PageLayout>
          </Route>
          <Route path="/novdec2020">
            <PageLayout
              movies={moviesByCategory[CATEGORIES.NOV_DEC_2020]}
              categoryMeta={categoryMeta}
              presetCategory={CATEGORIES.NOV_DEC_2020}
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
              categoryMeta={categoryMeta}
              presetCategory={CATEGORIES.GENRES}
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
              categoryMeta={categoryMeta}
              presetCategory={CATEGORIES.FINISH_THE_SERIES_HORROR}
            >
              <MovieList
                movies={moviesByCategory[CATEGORIES.FINISH_THE_SERIES_HORROR]}
                categoryMeta={categoryMeta}
                filteredMovies={moviesByCategory[CATEGORIES.FINISH_THE_SERIES_HORROR]}
                currentFilter={currentFilter}
                filterByCategory={filterByCategory}
                resetFilter={resetFilter}
                sort={sort}
                openDetail={openDetail}
                presetCategory={CATEGORIES.FINISH_THE_SERIES_HORROR}
              />
            </PageLayout>
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
    categoryMeta: state.movieStore?.categoryMeta,
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
