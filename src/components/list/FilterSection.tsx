import { Filter, FilterType } from "../../models/Filter";
import './styles/FilterSection.scss'

interface Props {
  label: string;
  values: Value[];
  filterType: FilterType;
  filters: Filter[];
  applyFilter: (filter: Filter) => void;
  removeFilter: (filter: Filter) => void;
}

interface Value {
  name: string;
  value: string;
}

const FilterSection = (props: Props) => {
  const { label, values, filterType, filters, applyFilter, removeFilter } =
    props;

  const onClick = (val: string) => {
    const exists = (filters || []).find(
      (f) => f.type === filterType && f.value === val
    );

    if (exists) {
      removeFilter({ type: filterType, value: val });
    } else {
      applyFilter({ type: filterType, value: val });
    }
  };

  return (
    <div className="filter-section">
      <div className="section-label">{label}</div>
      <div className="filters">
        {values.map((v) => (
          <div key={v.value} className={`tag ${v.value}`} onClick={() => onClick(v.value)}>
            {v.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterSection;
