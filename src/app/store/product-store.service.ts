import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductService } from '../services/product.service';

@Injectable({
    providedIn: 'root'
})
export class ProductStoreService {
    private productsSubject = new BehaviorSubject<any[]>([]);
    public products$: Observable<any[]> = this.productsSubject.asObservable();

    constructor(private productService: ProductService) { }

    loadProducts(): void {
        this.productService.getAllProducts().subscribe({
            next: (products) => this.productsSubject.next(products),
            error: (err) => console.error('Lỗi khi tải sản phẩm:', err)
        });
    }

    addProductToStore(product: any): void {
        const current = this.productsSubject.getValue();
        this.productsSubject.next([...current, product]);
    }

    updateProductInStore(updatedProduct: any): void {
        const current = this.productsSubject.getValue();
        const updated = current.map(p => p.id === updatedProduct.id ? updatedProduct : p);
        this.productsSubject.next(updated);
    }

    removeProductFromStore(id: string): void {
        const current = this.productsSubject.getValue();
        const filtered = current.filter(p => p.id !== id);
        this.productsSubject.next(filtered);
    }
}
