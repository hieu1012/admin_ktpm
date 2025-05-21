import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, map, switchMap } from 'rxjs';

import { InventoryService } from './inventory.service';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = 'http://localhost:8089/api/product';

    constructor(private http: HttpClient, private inventoryService: InventoryService) { }

    // getAllProducts(): Observable<any[]> {
    //     return this.http.get<any>(this.apiUrl).pipe(
    //         map(response => response.data.result)
    //     );
    // }

    // http://localhost:8089/api/product?page=1&size=7
    getAllProducts(page: number, size: number): Observable<any[]> {
        return this.http.get<any>(`${this.apiUrl}?page=${page}&size=${size}`).pipe(
            map(response => {
                // console.log(response);
                return response.data.result;
            })
        );
    }

    // addProduct(product: any, file: File): Observable<any> {
    //     const formData = new FormData();

    //     formData.append('file', file);
    //     formData.append('name', product.name);
    //     formData.append('price', product.price.toString());
    //     formData.append('detailDesc', product.detailDesc || '');
    //     formData.append('shortDesc', product.shortDesc || '');
    //     formData.append('quantity', product.quantity.toString());
    //     formData.append('categoryId', product.category?.id || product.category);
    //     formData.append('manufactureId', product.manufacture?.id || product.manufacture);
    //     return this.http.post<any>(this.apiUrl, formData);
    // }

    addProduct(product: any, files: File | File[]): Observable<any> {
        const formData = new FormData();

        // Xử lý trường hợp nhiều file hoặc một file
        if (files) {
            const fileList = Array.isArray(files) ? files : [files];
            fileList.forEach(file => formData.append('files', file)); // dùng key 'files'
        } else {
            console.log('Không có file nào được chọn');
        }

        // Thêm các thông tin cơ bản của sản phẩm
        formData.append('name', product.name);
        formData.append('price', product.price.toString());
        formData.append('detailDesc', product.detailDesc || '');
        formData.append('shortDesc', product.shortDesc || '');
        formData.append('quantity', product.quantity.toString());

        // Xử lý category - hỗ trợ cả object và id
        if (product.category) {
            const categoryId = typeof product.category === 'object' ? product.category.id : product.category;
            formData.append('categoryId', categoryId.toString());
        }

        // Xử lý manufacture - hỗ trợ cả object và id
        if (product.manufacture) {
            const manufactureId = typeof product.manufacture === 'object' ? product.manufacture.id : product.manufacture;
            formData.append('manufactureId', manufactureId.toString());
        }

        // Thêm trường sold nếu được cung cấp
        if (product.sold !== undefined) {
            formData.append('sold', product.sold.toString());
        }

        return this.http.post<any>(this.apiUrl, formData);
    }

    deleteProduct(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    // updateProduct(product: any, file: File | null): Observable<any> {
    //     const formData = new FormData();
    //     // Thêm các trường cơ bản vào formData
    //     formData.append('id', product.id.toString());
    //     // formData.append('name', product.name);
    //     formData.append('price', product.price.toString());
    //     formData.append('shortDesc', product.shortDesc || '');
    //     formData.append('detailDesc', product.detailDesc || '');
    //     // formData.append('quantity', product.quantity.toString());



    //     // Xử lý trường categoryId
    //     if (product.category) {
    //         const categoryId = typeof product.category === 'object' ? product.category.id : product.category;
    //         formData.append('categoryId', categoryId.toString());
    //     }

    //     // Xử lý trường manufactureId
    //     if (product.manufacture) {
    //         const manufactureId = typeof product.manufacture === 'object' ? product.manufacture.id : product.manufacture;
    //         formData.append('manufactureId', manufactureId.toString());
    //     }

    //     // Thêm sold nếu có
    //     if (product.sold !== undefined) {
    //         formData.append('sold', product.sold.toString());
    //     }

    //     // Thêm file nếu có
    //     if (file) {
    //         formData.append('file', file);
    //     }

    //     return this.inventoryService.updateInventory(product.id, product.quantity, product.name).pipe(
    //         switchMap((inventoryResponse: any) => {

    //             // Sử dụng giá trị từ response inventory để thêm vào formData
    //             formData.append('quantity', inventoryResponse.data.quantity.toString());
    //             formData.append('name', inventoryResponse.data.productName);

    //             // Sau khi đã thêm đầy đủ dữ liệu, gọi API cập nhật product
    //             return this.http.put<any>(`${this.apiUrl}`, formData);
    //         })
    //     );
    // }


    updateProduct(product: any, files: File[] | File | null, deletedImageUrls: string[] = []): Observable<any> {
        const formData = new FormData();

        // Các trường cơ bản
        formData.append('id', product.id.toString());
        formData.append('name', product.name);
        formData.append('price', product.price.toString());
        formData.append('shortDesc', product.shortDesc || '');
        formData.append('detailDesc', product.detailDesc || '');

        if (product.category) {
            const categoryId = typeof product.category === 'object' ? product.category.id : product.category;
            formData.append('categoryId', categoryId.toString());
        }

        if (product.manufacture) {
            const manufactureId = typeof product.manufacture === 'object' ? product.manufacture.id : product.manufacture;
            formData.append('manufactureId', manufactureId.toString());
        }

        formData.append('quantity', product.quantity.toString());

        if (product.sold !== undefined) {
            formData.append('sold', product.sold.toString());
        }

        // ✅ Thêm file ảnh mới nếu có
        if (files) {
            const fileList = Array.isArray(files) ? files : [files];
            fileList.forEach((f) => formData.append('files', f));
        }

        // ✅ Gửi danh sách ảnh cũ bị xoá
        if (deletedImageUrls.length > 0) {
            deletedImageUrls.forEach(url => {
                formData.append('deletedImageUrls', url); // phải trùng tên key mà backend xử lý
            });
        }

        // Gọi inventory service để cập nhật tồn kho trước
        return this.inventoryService.updateInventory(product.id, product.quantity, product.name).pipe(
            switchMap((inventoryResponse: any) => {
                const updatedQuantity = inventoryResponse?.data?.quantity;
                const updatedName = inventoryResponse?.data?.productName;

                if (updatedQuantity !== undefined) {
                    formData.set('quantity', updatedQuantity.toString());
                }
                if (updatedName) {
                    formData.set('name', updatedName);
                }

                return this.http.put<any>(`${this.apiUrl}`, formData);
            })
        );
    }






}
