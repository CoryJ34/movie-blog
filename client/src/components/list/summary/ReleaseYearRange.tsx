import { MenuItem, Select } from "@material-ui/core";
import { Filter, FilterType } from "../../../models/Filter";

interface Props {
  applyFilter: (filter: Filter) => void;
  minYearFilterValue: number;
  maxYearFilterValue: number;
  earliestMovieYear: number;
  latestMovieYear: number;
}

const ReleaseYearRange = (props: Props) => {
  const {
    minYearFilterValue,
    maxYearFilterValue,
    earliestMovieYear,
    latestMovieYear,
    applyFilter,
  } = props;

  // collect all years possible between the earliest and latest
  let availableYears = [];
  for (var i = earliestMovieYear; i <= latestMovieYear; i++) {
    availableYears.push(i);
  }

  return (
    <div className="filter-section">
      <div className="section-label">Release Year</div>
      <div className="year-range-container">
        <Select
          value={minYearFilterValue}
          label="Min Year"
          onChange={(event: any) => {
            applyFilter({
              type: FilterType.YEAR_START,
              value: event.target.value.toString(),
            });
          }}
        >
          {availableYears.map((v) => (
            <MenuItem value={v}>{v}</MenuItem>
          ))}
        </Select>
        <Select
          value={maxYearFilterValue}
          label="Max Year"
          onChange={(event: any) => {
            applyFilter({
              type: FilterType.YEAR_END,
              value: event.target.value.toString(),
            });
          }}
        >
          {availableYears.map((v) => (
            <MenuItem value={v}>{v}</MenuItem>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default ReleaseYearRange;
