export interface RemarkObject {
    title: string,
    content: string[],
    date: string
}

export interface SingleCategoryMeta {
    opening?: RemarkObject,
    closing?: RemarkObject,
    misc?: RemarkObject[]
}

export interface CategoryMeta {
    [key: string]: SingleCategoryMeta
}