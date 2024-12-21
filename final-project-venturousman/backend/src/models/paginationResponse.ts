export interface PaginationResponse<T = unknown> {
    items: T[];
    total: number;
    page: number;
    limit: number;
}
