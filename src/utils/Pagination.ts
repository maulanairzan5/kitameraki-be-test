export interface PageInfo {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

export function CreatePageInfo(totalItems: number, pageSize: number, currentPage?: number): PageInfo {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const current = currentPage && currentPage > 0 ? currentPage : 1;

    return {
        currentPage: current > totalPages ? totalPages : current,
        pageSize,
        totalItems,
        totalPages
    };
}
