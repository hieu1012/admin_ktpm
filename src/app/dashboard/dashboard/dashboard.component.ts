import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  pageTitle: string = 'Quản lý sản phẩm';

  user: any = null;


  constructor(private router: Router, private authService: AuthService, private route: ActivatedRoute) { }


  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');

    // Lắng nghe NavigationEnd để cập nhật title khi điều hướng
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // Delay để đảm bảo router-outlet đã load xong
        setTimeout(() => {
          const activeRoute = this.getDeepestChild(this.route);
          this.pageTitle = activeRoute.snapshot.data['title'] || 'Bảng điều khiển';
        });
      });
  }

  getDeepestChild(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }

  onLogout(): void {
    this.authService.logout();
  }


}
