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
  cls?: string;
  applyFilter: (filter: Filter) => void;
  removeFilter: (filter: Filter) => void;
}

const FilterSection = (props: Props) => {
  const {
    label,
    filterType,
    filters,
    availableFilters,
    availableFromFiltered,
    cls,
    applyFilter,
    removeFilter,
  } = props;

  const onClick = (val: string, event: any) => {
    const exists = !!filters[stringifyFilter({ type: filterType, value: val })];

    if (exists) {
      removeFilter({ type: filterType, value: val });
    } else {
      // TODO: Add an alternative click that can apply a negation filter

      if (!!event.ctrlKey) {
        applyFilter({ type: filterType, value: val, negation: true });
      } else {
        applyFilter({ type: filterType, value: val, negation: false });
      }
    }
  };

  const availableForType = availableFromFiltered[filterType.toString()];

  return (
    <div className="filter-section">
      <div className="section-label">{label}</div>
      <div className="filters">
        {availableFilters[filterType].map((v) => {
          let matching = (availableForType || []).find(
            (a) => a.value === v.value
          );

          return (
            <div
              key={v.value}
              className={`${cls || "tag"} ${v.cls} ${
                !!(filters || {})[
                  stringifyFilter({ type: filterType, value: v.value })
                ]
                  ? "selected"
                  : ""
              } ${!availableForType || !matching ? "na" : ""}`}
              style={{
                backgroundColor: v.color,
              }}
              onClick={(event) => onClick(v.value, event)}
            >
              <div className="filter-count">
                {matching ? matching.count : 0}
              </div>
              {v.value}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FilterSection;
