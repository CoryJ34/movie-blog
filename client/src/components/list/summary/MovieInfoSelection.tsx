import { MenuItem, Select } from "@material-ui/core";
import { Category } from "../../../models/Category";
import { Filter, FilterType } from "../../../models/Filter";

interface Props {
  directorFilter?: Filter;
  allDirectors: string[];
  castFilter?: Filter;
  allCast: string[];
  genreFilter?: Filter;
  allGenres: string[];
  presetCategory?: Category;
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
    presetCategory,
    applyFilter,
    removeFilter,
  } = props;

  if (presetCategory) {
    return null;
  }

  const renderItemSelect = (
    selectedFilter: Filter | undefined,
    allValues: string[],
    label: string,
    filterType: FilterType
  ) => {
    return (
      <span className="year-selector-container">
        <Select
          value={selectedFilter ? selectedFilter.value : ""}
          label={label}
          onChange={(event: any) => {
            if (selectedFilter) {
              removeFilter(selectedFilter);
            }
            applyFilter({
              type: filterType,
              value: event.target.value.toString(),
            });
          }}
        >
          {allValues.map((v) => (
            <MenuItem value={v}>{v}</MenuItem>
          ))}
        </Select>
      </span>
    );
  };

  return (
    <>
      {renderItemSelect(
        directorFilter,
        allDirectors,
        "Director",
        FilterType.DIRECTOR
      )}
      {renderItemSelect(castFilter, allCast, "Cast", FilterType.CAST)}
      {renderItemSelect(genreFilter, allGenres, "Genre", FilterType.GENRE)}
    </>
  );
};

export default MovieInfoSelection;
