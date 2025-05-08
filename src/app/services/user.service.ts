import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUser = '/me';
    constructor(private http: HttpClient, private router: Router) { }

    getUser(): Observable<any> {
        return this.http.get<any>(this.apiUser);
    }


}
