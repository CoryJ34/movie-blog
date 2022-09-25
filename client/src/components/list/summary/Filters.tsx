import { AvailableFilters, Filter, FilterType } from "../../../models/Filter";
import FilterSection from "../FilterSection";

interface Props {
  filters: { [key: string]: Filter };
  availableFilters: AvailableFilters;
  availableFromFiltered: AvailableFilters;
  applyFilter: (filter: Filter) => void;
  removeFilter: (filter: Filter) => void;
}

const FILTERABLES: { type: FilterType; label: string; cls?: string }[] = [
  {
    type: FilterType.WATCHLIST,
    label: "Watchlist",
    cls: "category",
  },
  {
    type: FilterType.TAG,
    label: "Tag",
  },
  {
    type: FilterType.DECADE,
    label: "Decade",
  },
  {
    type: FilterType.LABEL,
    label: "Label",
  },
  {
    type: FilterType.FORMAT,
    label: "Format",
  },
];

const Filters = (props: Props) => {
  const {
    filters,
    availableFilters,
    availableFromFiltered,
    applyFilter,
    removeFilter,
  } = props;

  return (
    <div className="filters">
      {FILTERABLES.map((f) => (
        <FilterSection
          label={f.label}
          filterType={f.type}
          filters={filters}
          availableFilters={availableFilters}
          availableFromFiltered={availableFromFiltered}
          cls={f.cls}
          applyFilter={applyFilter}
          removeFilter={removeFilter}
        />
      ))}
    </div>
  );
};

export default Filters;
