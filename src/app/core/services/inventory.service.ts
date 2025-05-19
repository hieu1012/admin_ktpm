import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class InventoryService {
    private apiUrl = '/inventory';

    constructor(private http: HttpClient) { }

    getInventoryByProductID(id: any): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/api/inventory/${id}`);
    }

    updateInventory(id: any, quantity: any, productName: any): Observable<any> {
        const data = {
            quantity: quantity,
            productName: productName
        };
        return this.http.put<any>(`${this.apiUrl}/api/inventory/${id}`, data);
    }


}