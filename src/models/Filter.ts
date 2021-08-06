export enum FilterType {
    TAG,
    YEAR,
    DECADE,
    WATCHLIST,
    LABEL,
    FORMAT
}

export interface Filter {
    type: FilterType,
    value: string
}