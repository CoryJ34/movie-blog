export enum FilterType {
  TAG,
  YEAR,
  DECADE,
  WATCHLIST,
  LABEL,
  FORMAT,
  START_DATE,
  END_DATE,
  YEAR_START,
  YEAR_END,
}

export interface Filter {
  type: FilterType;
  value: string;
}

export interface FilterMap {
  [key: string]: Filter;
}

export interface FilterMeta {
  value: string;
  cls: string;
  count: number;
}

export interface AvailableFilters {
  [key: string]: FilterMeta[];
}
