import {
  AvailableFilters,
  Filter,
  FilterMap,
  FilterType,
} from "../../models/Filter";
import { stringifyFilter } from "../../util/FilterUtils";
import "./styles/FilterSection.scss";

interface Props {
  label: string;
  filterType: FilterType;
  filters: FilterMap;
  availableFilters: AvailableFilters;
  availableFromFiltered: AvailableFilters;
  applyFilter: (filter: Filter) => void;
  removeFilter: (filter: Filter) => void;
}

interface Value {
  name: string;
  value: string;
}

const FilterSection = (props: Props) => {
  const {
    label,
    filterType,
    filters,
    availableFilters,
    availableFromFiltered,
    applyFilter,
    removeFilter,
  } = props;

  const onClick = (val: string) => {
    const exists = !!filters[stringifyFilter({ type: filterType, value: val })];

    if (exists) {
      removeFilter({ type: filterType, value: val });
    } else {
      applyFilter({ type: filterType, value: val });
    }
  };

  const availableForType = availableFromFiltered[filterType.toString()];

  return (
    <div className="filter-section">
      <div className="section-label">{label}</div>
      <div className="filters">
        {availableFilters[filterType].map((v) => (
          <div
            key={v}
            className={`tag ${v} ${
              !!(filters || {})[
                stringifyFilter({ type: filterType, value: v })
              ] ? "selected" : ""
            } ${
              !availableForType || availableForType.indexOf(v) < 0 ? "na" : ""
            }`}
            onClick={() => onClick(v)}
          >
              {/* <div className="filter-count">34</div> */}
            {v}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterSection;
