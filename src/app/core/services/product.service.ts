import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = 'http://localhost:8089/api/product';

    constructor(private http: HttpClient) { }

    getAllProducts(): Observable<any[]> {
        return this.http.get<any>(this.apiUrl).pipe(
            map(response => response.data.result)
        );
    }

    addProduct(product: any, file: File): Observable<any> {
        const formData = new FormData();

        formData.append('file', file);
        formData.append('name', product.name);
        formData.append('price', product.price.toString());
        formData.append('detailDesc', product.detailDesc || '');
        formData.append('shortDesc', product.shortDesc || '');
        formData.append('quantity', product.quantity.toString());
        formData.append('categoryId', product.category?.id || product.category);
        formData.append('manufactureId', product.manufacture?.id || product.manufacture);
        return this.http.post<any>(this.apiUrl, formData);
    }

    deleteProduct(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    updateProduct(product: any, file: File | null): Observable<any> {
        const formData = new FormData();

        // Thêm các trường cơ bản vào formData
        formData.append('id', product.id.toString());
        formData.append('name', product.name);
        formData.append('price', product.price.toString());
        formData.append('shortDesc', product.shortDesc || '');
        formData.append('detailDesc', product.detailDesc || '');
        formData.append('quantity', product.quantity.toString());

        // Xử lý trường categoryId
        if (product.category) {
            const categoryId = typeof product.category === 'object' ? product.category.id : product.category;
            formData.append('categoryId', categoryId.toString());
        }

        // Xử lý trường manufactureId
        if (product.manufacture) {
            const manufactureId = typeof product.manufacture === 'object' ? product.manufacture.id : product.manufacture;
            formData.append('manufactureId', manufactureId.toString());
        }

        // Thêm sold nếu có
        if (product.sold !== undefined) {
            formData.append('sold', product.sold.toString());
        }

        // Thêm file nếu có
        if (file) {
            formData.append('file', file);
        }

        // Gọi API PUT
        return this.http.put<any>(`${this.apiUrl}`, formData);
    }







}
