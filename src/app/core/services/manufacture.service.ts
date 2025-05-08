import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ManufactureResponse } from '../models/manufacture.model';

@Injectable({
    providedIn: 'root'
})
export class ManufactureService {
    private apiUrl = 'http://localhost:8089/api/manufacture';

    constructor(private http: HttpClient) { }

    getAllManufactures(): Observable<ManufactureResponse> {
        return this.http.get<ManufactureResponse>(this.apiUrl);
    }
}