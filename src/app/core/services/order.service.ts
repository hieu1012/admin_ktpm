import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OrderService { // Sửa tên class cho phù hợp với tên file
    private apiUrl = '/api/api/cart';
    private apiUrlOrder = '/api/api/orders';
    constructor(private http: HttpClient) { }

    // Tạo một giỏ hàng mới
    addCart(quantity: any, productId: any): Observable<any> {
        const cart = {
            quantity: quantity,
            productId: productId
        };
        return this.http.post<any>(`${this.apiUrl}/items`, cart);
    }

    getCartAllByUserId(userId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}?userId=${userId}`);
    }

    updateCartItem(itemId: number, quantity: number): Observable<any> {
        const cartItem = {
            quantity: quantity
        };
        return this.http.put<any>(`${this.apiUrl}/items/${itemId}`, cartItem);
    }

    removeCartItem(productId: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/items/${productId}`);
    }

    createOrder(shippingAddress: any, paymentMethod: any, taxAmount: any): Observable<any> {
        const order = {
            shippingAddress: shippingAddress,
            paymentMethod: paymentMethod,
            taxAmount: taxAmount
        };
        return this.http.post<any>(`${this.apiUrlOrder}`, order);
    }

    getAllOrders(): Observable<any> {
        return this.http.get<any>(`${this.apiUrlOrder}`);
    }

    cancelOrder(orderId: any): Observable<any> {
        // Truyền reason qua query parameter
        return this.http.put(`${this.apiUrlOrder}/${orderId}/cancel?reason=Cancelled+by+user`, {});
    }

}