export interface SortMeta {
    field: string;
    order: number;
}
export interface FilterMetadata {
    value?: any;
    matchMode?: string;
}

export interface filter {
    first?: number;
    rows?: number;
    sortField?: string;
    sortOrder?: number;
    multiSortMeta?: SortMeta[];
    filters?: {
        [s: string]: FilterMetadata;
    };
    globalFilter?: any;
}