import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiLogin = '/auth/login';
    // private apiLogin = 'http://localhost:8081/auth/login';
    private apiRegister = '/auth/register';
    private apiUser = '/me';

    constructor(
        private http: HttpClient,
        private router: Router,
        private userService: UserService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    login(email: string, password: string): void {
        const body = { email, password };
        this.http.post<any>(this.apiLogin, body).subscribe({
            next: (response) => {
                console.log('Đăng nhập thành công', response);
                if (isPlatformBrowser(this.platformId)) {
                    const token = response.data.token;
                    localStorage.setItem('access_token', token);

                    this.userService.getUser().subscribe({
                        next: (user) => {
                            console.log('Thông tin người dùng:', user.data.role);
                            // ADMIN
                            if (user.data.role === 'ADMIN') {
                                localStorage.setItem('user', JSON.stringify(user.data));
                                console.log('Thông tin user đã được lưu trữ', localStorage.getItem('user'));
                                this.router.navigate(['/dashboard/products']);
                            } else {
                                // Một thông báo cho người dùng biết rằng họ không có quyền truy cập
                                alert('Bạn không có quyền truy cập vào trang này.');
                                this.router.navigate(['/login']);
                            }
                        },
                        error: (error) => {
                            console.error('Lỗi khi lấy thông tin người dùng:', error);
                        }
                    });
                }

            },
            error: (error) => {
                console.error('Đăng nhập thất bại', error);
            }
        });
    }

    getToken(): string | null {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem('access_token');
        }
        return null;
    }

    clear(): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
        }
    }

    isLoggedIn(): boolean {
        return this.getToken() !== null;
    }

    logout(): void {
        this.clear();
        this.router.navigate(['/login']);
    }

    register(email: string, password: string, fullName: string): Observable<any> {
        const body = { email, password, fullName };
        return this.http.post<any>(this.apiRegister, body);
    }

}