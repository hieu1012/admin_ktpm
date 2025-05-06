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

}
