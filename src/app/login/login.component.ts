import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  email: string = 'daotaohieu13@gmail.com';
  password: string = '12345678';

  constructor(private authService: AuthService, private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    // console.log('Thông tin đăng nhập', { email: this.email, password: this.password });
    // this.authService.login(this.email, this.password)
  }


  onLogin() {
    this.authService.login(this.email, this.password);
  }
}
