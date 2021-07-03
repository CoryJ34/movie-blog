export enum FilterType {
    TAG,
    YEAR,
    DECADE,
    WATCHLIST
}

export interface Filter {
    type: FilterType,
    value: string
}