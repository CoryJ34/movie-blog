import { Filter, FilterType } from "../../../models/Filter";
import DatePicker from "react-datepicker";
import { MenuItem, Select } from "@material-ui/core";
import { useState } from "react";

interface Props {
  startDateFilterValue: Date;
  startDateFilter?: Filter;
  endDateFilterValue: Date;
  endDateFilter?: Filter;
  applyFilter: (filter: Filter) => void;
  removeFilter: (filter: Filter) => void;
}

const YEAR_SELECTIONS: any = {
  "Year 1": {
    startDate: new Date("August 30, 2020"),
    endDate: new Date("August 26, 2021"),
  },
  "Year 2": {
    startDate: new Date("August 27, 2021"),
    endDate: new Date("August 25, 2022"),
  },
  "Year 3": {
    startDate: new Date("August 26, 2022"),
    endDate: new Date("August 28, 2023"),
  },
};

const WatchedDateRange = (props: Props) => {
  const {
    startDateFilterValue,
    startDateFilter,
    endDateFilterValue,
    endDateFilter,
    applyFilter,
    removeFilter,
  } = props;

  const [yearSelection, setYearSelection] = useState("All");

  return (
    <div className="filter-section">
      {/* Watched Date range selectors */}
      <div className="section-label">Watched Date</div>
      <div className="date-range-container">
        <DatePicker
          selected={startDateFilterValue}
          onChange={(d: Date) =>
            applyFilter({
              type: FilterType.START_DATE,
              value: d.getTime().toString(),
            })
          }
        />
        <a
          onClick={() => {
            if (startDateFilter) {
              removeFilter(startDateFilter);
            }
          }}
        >
          Reset
        </a>
        <DatePicker
          selected={endDateFilterValue}
          onChange={(d: Date) =>
            applyFilter({
              type: FilterType.END_DATE,
              value: d.getTime().toString(),
            })
          }
        />
        <a
          onClick={() => {
            if (endDateFilter) {
              removeFilter(endDateFilter);
            }
          }}
        >
          Reset
        </a>
        {/* Year selector (Year 1, Year 2, etc) */}
        <span className="year-selector-container">
          <Select
            value={yearSelection}
            label="Year..."
            onChange={(event: any) => {
              const selectedYear = event.target.value;
              setYearSelection(selectedYear);

              if (selectedYear === "All") {
                if (startDateFilter) {
                  removeFilter(startDateFilter);
                }
                if (endDateFilter) {
                  removeFilter(endDateFilter);
                }

                return;
              }

              applyFilter({
                type: FilterType.START_DATE,
                value: YEAR_SELECTIONS[selectedYear].startDate
                  .getTime()
                  .toString(),
              });

              applyFilter({
                type: FilterType.END_DATE,
                value: YEAR_SELECTIONS[selectedYear].endDate
                  .getTime()
                  .toString(),
              });
            }}
          >
            <MenuItem value={"All"}>All</MenuItem>
            {Object.keys(YEAR_SELECTIONS).map((ys: string) => (
              <MenuItem value={ys}>{ys}</MenuItem>
            ))}
          </Select>
        </span>
      </div>
    </div>
  );
};

export default WatchedDateRange;
