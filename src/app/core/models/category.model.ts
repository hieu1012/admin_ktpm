// Ở file models/category.model.ts
export interface CategoryResponse {
    statusCode: number;
    error: null | string;
    message: string;
    data: Category[];
}

export interface Category {
    id: number;
    name: string;
}