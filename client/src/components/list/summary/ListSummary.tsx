import { Grid } from "@material-ui/core";
import { connect } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import { AvailableFilters, Filter, FilterMap } from "../../../models/Filter";
import { Movie } from "../../../models/Movie";
import Charts from "../Charts";
import Sort from "../Sort";

import "./styles/ListSummary.scss";
import {
  collectFilterInfo,
  gatherAvailableFilters,
} from "../../../util/FilterUtils";
import { Category, Remark } from "../../../models/Category";
import { MovieDataItem } from "../../../types/MovieTypes";
import ListRemarks from "./ListRemarks";
import SummaryInfo from "./SummaryInfo";
import TopMovieItems from "./TopMovieItems";
import WatchedDateRange from "./WatchedDateRange";
import ReleaseYearRange from "./ReleaseYearRange";
import FreeTextSearch from "./FreeTextSearch";
import MovieInfoSelection from "./MovieInfoSelection";
import { collectSummaryInfo } from "../../../util/DataUtils";
import Filters from "./Filters";

interface Props {
  movies: Movie[];
  categories: Category[];
  presetCategory?: Category;
  filters: FilterMap;
  availableFilters: AvailableFilters;
  filteredMovies: Movie[];
  hideSort?: boolean;
  earliestMovieYear: number;
  latestMovieYear: number;
  allDirectors: string[];
  allCast: string[];
  allGenres: string[];
  topCast: MovieDataItem[];
  topDirectors: MovieDataItem[];
  topGenres: MovieDataItem[];
  applyFilter: (filter: Filter) => void;
  removeFilter: (filter: Filter) => void;
}

const ListSummary = (props: Props) => {
  const {
    movies,
    presetCategory,
    filters,
    availableFilters,
    categories,
    filteredMovies,
    hideSort,
    earliestMovieYear,
    latestMovieYear,
    allDirectors,
    allCast,
    allGenres,
    topCast,
    topDirectors,
    topGenres,
    applyFilter,
    removeFilter,
  } = props;

  if (!movies) {
    return <div>No movies yet..</div>;
  }

  const summaryInfo = collectSummaryInfo(movies);
  const filterInfo = collectFilterInfo(filters);
  const availableFromFiltered = gatherAvailableFilters(
    filteredMovies,
    categories
  );

  return (
    <div className="list-summary">
      <div className="header">
        <span>Summary</span>
        <ListRemarks meta={presetCategory?.remarks} />
      </div>
      <Grid container spacing={6}>
        <Grid item>
          <SummaryInfo
            movies={movies}
            averageRating={summaryInfo.averageRating}
            totalRuntimeMins={summaryInfo.totalRuntimeMins}
            minsPerMovie={summaryInfo.minsPerMovie}
          />
        </Grid>
        <Grid item>
          <TopMovieItems label="Top Cast" data={topCast} />
        </Grid>
        <Grid item>
          <TopMovieItems label="Top Directors" data={topDirectors} />
        </Grid>
        <Grid item>
          <TopMovieItems label="Top Genres" data={topGenres} />
        </Grid>
      </Grid>
      {!presetCategory && (
        <WatchedDateRange
          startDateFilterValue={filterInfo.startDateFilterValue}
          startDateFilter={filterInfo.startDateFilter || undefined}
          endDateFilterValue={filterInfo.endDateFilterValue}
          endDateFilter={filterInfo.endDateFilter || undefined}
          applyFilter={applyFilter}
          removeFilter={removeFilter}
        />
      )}
      {!presetCategory && (
        <ReleaseYearRange
          applyFilter={applyFilter}
          minYearFilterValue={filterInfo.minYearFilterValue}
          maxYearFilterValue={filterInfo.maxYearFilterValue}
          earliestMovieYear={earliestMovieYear}
          latestMovieYear={latestMovieYear}
        />
      )}
      {!presetCategory && <FreeTextSearch applyFilter={applyFilter} />}
      <MovieInfoSelection
        allCast={allCast}
        castFilter={filterInfo.castFilter || undefined}
        allDirectors={allDirectors}
        directorFilter={filterInfo.directorFilter || undefined}
        allGenres={allGenres}
        genreFilter={filterInfo.genreFilter || undefined}
        applyFilter={applyFilter}
        removeFilter={removeFilter}
      />
      {!presetCategory && (
        <Filters
          filters={filters}
          availableFilters={availableFilters}
          availableFromFiltered={availableFromFiltered}
          applyFilter={applyFilter}
          removeFilter={removeFilter}
        />
      )}
      {!hideSort && <Sort />}
      <Charts />
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    filters: state.movieStore?.filters,
    availableFilters: state.movieStore?.availableFilters,
    filteredMovies: state.movieStore?.filteredMovies,
    earliestMovieYear: state.movieStore?.earliestMovieYear,
    latestMovieYear: state.movieStore?.latestMovieYear,
    categories: state.movieStore?.categories,
    allDirectors: state.movieStore?.allDirectors,
    allCast: state.movieStore?.allCast,
    allGenres: state.movieStore?.allGenres,
    topCast: state.movieStore?.topCast,
    topDirectors: state.movieStore?.topDirectors,
    topGenres: state.movieStore?.topGenres,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    applyFilter: (filter: Filter) =>
      dispatch({ type: "movies/applyFilter", filter }),
    removeFilter: (filter: Filter) =>
      dispatch({ type: "movies/removeFilter", filter }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListSummary);
