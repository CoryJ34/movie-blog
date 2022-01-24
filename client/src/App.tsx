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
import { Filter, FilterMap } from "./models/Filter";
import References from "./components/references/References";
import Milestones from "./components/milestones/Milestones";
import Footer from "./components/common/Footer/Footer";
import Ratings from "./components/ratings/Ratings";
import VHSShelf from "./components/vhs/VHSShelf";
import Halloween2021 from "./components/Halloween2021";
import DaysOfListmas from "./components/DaysOfListmas";
import Migrater from "./components/Migrater";
import Blood from "./components/Blood";

interface Props {
  movies: Movie[];
  categoryMeta: CategoryMeta;
  filteredMovies: Movie[];
  selectedMovie: Movie;
  detailOpen: boolean;
  loadMovies: (movies: Movie[]) => void;
  removeFilter: (filter: Filter) => void;
  resetFilter: () => void;
  openDetail: (movie: Movie) => void;
  closeDetail: () => void;
}

const query = `query ListMovies {
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

interface CategoryMap {
  [key: string]: any;
}

function App(props: Props) {
  useEffect(() => {
    const doLoad = async () => {
      const allDataResp = await fetch("/getalldata");

      let allData = await allDataResp.json();

      const movieList = await fetch("/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const listMoviesResp = await movieList.json();

      console.log(listMoviesResp.data.listMovies.matches);

      props.loadMovies({
        ...allData,
        remoteMovieData: listMoviesResp.data.listMovies.matches,
      });
    };

    doLoad();
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

  movies.reverse().forEach((m) => {
    const category = m.category;

    if (!moviesByCategory[category]) {
      moviesByCategory[category] = [];
    }

    moviesByCategory[category].push(m);
  });

  const categorizedPage = (category: string) => {
    return (
      <PageLayout movies={moviesByCategory[category]} presetCategory={category}>
        <CategorizedList
          categoryMeta={categoryMeta}
          filteredMovies={filteredMovies}
          openDetail={openDetail}
          presetCategory={category}
        />
      </PageLayout>
    );
  };

  const subCategorizedPage = (category: string) => {
    return (
      <PageLayout
        movies={moviesByCategory[category]}
        presetCategory={category}
        hideSort={true}
      >
        <SubCategorized
          category={category}
          movies={movies}
          openDetail={openDetail}
        />
      </PageLayout>
    );
  };

  return (
    <div className="App">
      <Router>
        <div className="page-content">
          <Switch>
            <Route path="/migrate">
              <Migrater />
            </Route>
            <Route path="/movies">
              <MovieList
                categoryMeta={categoryMeta}
                filteredMovies={filteredMovies}
                openDetail={openDetail}
              />
            </Route>
            <Route path="/gamera">{categorizedPage(CATEGORIES.GAMERA)}</Route>
            <Route path="/randomizer">
              {categorizedPage(CATEGORIES.RANDOMIZER)}
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
            <Route path="/halloween2021">
              <PageLayout
                movies={moviesByCategory[CATEGORIES.HALLOWEEN_2021]}
                presetCategory={CATEGORIES.HALLOWEEN_2021}
                hideSort={true}
              >
                <Halloween2021 movies={movies} openDetail={openDetail} />
              </PageLayout>
            </Route>
            <Route path="/novdec2020">
              {subCategorizedPage(CATEGORIES.NOV_DEC_2020)}
            </Route>
            <Route path="/genres">
              {subCategorizedPage(CATEGORIES.GENRES)}
            </Route>
            <Route path="/finishtheserieshorror">
              {categorizedPage(CATEGORIES.FINISH_THE_SERIES_HORROR)}
            </Route>
            <Route path="/finishtheseriesnonhorror">
              {categorizedPage(CATEGORIES.FINISH_THE_SERIES_NON_HORROR)}
            </Route>
            <Route path="/decadesofhorror">
              {categorizedPage(CATEGORIES.DECADES_OF_HORROR)}
            </Route>
            <Route path="/genresampler">
              {categorizedPage(CATEGORIES.GENRE_SAMPLER)}
            </Route>
            <Route path="/daysoflistmas">
              <PageLayout
                movies={moviesByCategory[CATEGORIES.DAYS_OF_LISTMAS]}
                presetCategory={CATEGORIES.DAYS_OF_LISTMAS}
                hideSort={true}
              >
                <DaysOfListmas movies={movies} openDetail={openDetail} />
              </PageLayout>
            </Route>
            <Route path="/blood">
              <PageLayout
                movies={moviesByCategory[CATEGORIES.BLOOD]}
                presetCategory={CATEGORIES.BLOOD}
                hideSort={true}
              >
                <Blood movies={movies} openDetail={openDetail} />
              </PageLayout>
            </Route>
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
    categoryMeta: state.movieStore?.categoryMeta,
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
