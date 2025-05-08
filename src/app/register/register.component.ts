import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '12345678';

  constructor(private router: Router, private authService: AuthService) { }

  onRegister() {
    this.authService.register(this.email, this.password, this.name).subscribe({
      next: (response) => {
        console.log('Đăng ký thành công:', response);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Lỗi khi đăng ký:', error);
      }
    });
  }
}
