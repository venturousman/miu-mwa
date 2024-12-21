export interface StandardResponse<T = unknown> {
    success: boolean;
    data: T;
}
