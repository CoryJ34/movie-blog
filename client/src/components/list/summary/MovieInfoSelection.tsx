import { MenuItem, Select } from "@material-ui/core";
import { Filter, FilterType } from "../../../models/Filter";

interface Props {
  directorFilter?: Filter;
  allDirectors: string[];
  castFilter?: Filter;
  allCast: string[];
  genreFilter?: Filter;
  allGenres: string[];
  applyFilter: (filter: Filter) => void;
  removeFilter: (filter: Filter) => void;
}

const MovieInfoSelection = (props: Props) => {
  const {
    directorFilter,
    allDirectors,
    castFilter,
    allCast,
    genreFilter,
    allGenres,
    applyFilter,
    removeFilter,
  } = props;

  return (
    <>
      <span className="year-selector-container">
        <Select
          value={directorFilter ? directorFilter.value : ""}
          label="Director"
          onChange={(event: any) => {
            if (directorFilter) {
              removeFilter(directorFilter);
            }
            applyFilter({
              type: FilterType.DIRECTOR,
              value: event.target.value.toString(),
            });
          }}
        >
          {allDirectors.map((v) => (
            <MenuItem value={v}>{v}</MenuItem>
          ))}
        </Select>
      </span>
      <span className="year-selector-container">
        <Select
          value={castFilter ? castFilter.value : ""}
          label="Cast"
          onChange={(event: any) => {
            if (castFilter) {
              removeFilter(castFilter);
            }
            applyFilter({
              type: FilterType.CAST,
              value: event.target.value.toString(),
            });
          }}
        >
          {allCast.map((v) => (
            <MenuItem value={v}>{v}</MenuItem>
          ))}
        </Select>
      </span>
      <span className="year-selector-container">
        <Select
          value={genreFilter ? genreFilter.value : ""}
          label="Genre"
          onChange={(event: any) => {
            if (genreFilter) {
              removeFilter(genreFilter);
            }
            applyFilter({
              type: FilterType.GENRE,
              value: event.target.value.toString(),
            });
          }}
        >
          {allGenres.map((v) => (
            <MenuItem value={v}>{v}</MenuItem>
          ))}
        </Select>
      </span>
    </>
  );
};

export default MovieInfoSelection;
