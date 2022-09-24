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
  FREE_TEXT,
  DIRECTOR,
  CAST,
  GENRE,
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
  color?: string;
  count: number;
}

export interface AvailableFilters {
  [key: string]: FilterMeta[];
}
