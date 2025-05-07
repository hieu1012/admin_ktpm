// Ở file models/category.model.ts
export interface ManufactureResponse {
    statusCode: number;
    error: null | string;
    message: string;
    data: Manufacture[];
}

export interface Manufacture {
    id: number;
    name: string;
}