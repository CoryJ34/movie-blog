import { FilterType } from "../../models/Filter";
import FilterHandler from "../../models/FilterHandler";
import CastFilter from "./CastFilter";
import DecadeFilter from "./DecadeFilter";
import DirectorFilter from "./DirectorFilter";
import EndDateFilter from "./EndDateFilter";
import EndYearFilter from "./EndYearFilter";
import FormatFilter from "./FormatFilter";
import FreeTextFilter from "./FreeTextFilter";
import GenreFilter from "./GenreFilter";
import LabelFilter from "./LabelFilter";
import StartDateFilter from "./StartDateFilter";
import StartYearFilter from "./StartYearFilter";
import TagFilter from "./TagFilter";
import WatchlistFilter from "./WatchlistFilter";
import YearFilter from "./YearFilter";

const FilterHandlerFactory = (typeAsString: string): FilterHandler | null => {
  if (typeAsString === FilterType.YEAR.toString()) {
    return YearFilter;
  } else if (typeAsString === FilterType.DECADE.toString()) {
    return DecadeFilter;
  } else if (typeAsString === FilterType.FORMAT.toString()) {
    return FormatFilter;
  } else if (typeAsString === FilterType.LABEL.toString()) {
    return LabelFilter;
  } else if (typeAsString === FilterType.TAG.toString()) {
    return TagFilter;
  } else if (typeAsString === FilterType.WATCHLIST.toString()) {
    return WatchlistFilter;
  } else if (typeAsString === FilterType.START_DATE.toString()) {
    return StartDateFilter;
  } else if (typeAsString === FilterType.END_DATE.toString()) {
    return EndDateFilter;
  } else if (typeAsString === FilterType.YEAR_START.toString()) {
    return StartYearFilter;
  } else if (typeAsString === FilterType.YEAR_END.toString()) {
    return EndYearFilter;
  } else if (typeAsString === FilterType.FREE_TEXT.toString()) {
    return FreeTextFilter;
  } else if (typeAsString === FilterType.CAST.toString()) {
    return CastFilter;
  } else if (typeAsString === FilterType.DIRECTOR.toString()) {
    return DirectorFilter;
  } else if (typeAsString === FilterType.GENRE.toString()) {
    return GenreFilter;
  }

  return null;
};

export default FilterHandlerFactory;
