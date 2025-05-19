import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { ProductManagementComponent } from './dashboard/product-management/product-management.component';
import { UserManagementComponent } from './dashboard/user-management/user-management.component';
import { OrderManagementComponent } from './dashboard/order-management/order-management.component';
import { StatisticsComponent } from './dashboard/statistics/statistics.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: 'dashboard',
        component: DashboardComponent,
        children: [
            {
                path: '',
                redirectTo: 'products',
                pathMatch: 'full',
            },
            {
                path: 'products',
                component: ProductManagementComponent,
                data: { title: 'Quản lý sản phẩm' }
            },
            {
                path: 'users',
                component: UserManagementComponent,
                data: { title: 'Quản lý người dùng' }
            },
            {
                path: 'orders',
                component: OrderManagementComponent,
                data: { title: 'Quản lý đơn hàng' }
            },
            {
                path: 'statistics',
                component: StatisticsComponent,
                data: { title: 'Thống kê' }
            }

        ]
    }
];
