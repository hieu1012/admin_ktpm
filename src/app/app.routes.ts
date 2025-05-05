// import { Routes } from '@angular/router';
// import { LoginComponent } from './login/login.component';
// import { RegisterComponent } from './register/register.component';
// import { DashboardComponent } from './dashboard/dashboard.component';

// export const routes: Routes = [
//     { path: '', redirectTo: '/login', pathMatch: 'full' },
//     { path: 'login', component: LoginComponent },
//     { path: 'register', component: RegisterComponent },
//     { path: 'dashboard', component: DashboardComponent }
// ];


import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { ProductManagementComponent } from './dashboard/product-management/product-management.component';
import { UserManagementComponent } from './dashboard/user-management/user-management.component';
import { OrderManagementComponent } from './dashboard/order-management/order-management.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: 'dashboard',
        component: DashboardComponent,
        children: [
            { path: 'products', component: ProductManagementComponent },
            { path: 'users', component: UserManagementComponent },
            { path: 'orders', component: OrderManagementComponent },
            { path: '', redirectTo: 'products', pathMatch: 'full' }
        ]
    }
];
