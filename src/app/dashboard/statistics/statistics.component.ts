import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { ORDERS } from '../../../data/orders';
import { PriceFormatPipe } from '../../core/pipes/price-format.pipe';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, NzCardModule, NzStatisticModule, NzGridModule, PriceFormatPipe, NzTableModule],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent {
  orders = ORDERS;
  selectedStatus: string | null = null;

  get totalOrders(): number {
    return this.orders.length;
  }

  get totalRevenue(): number {
    return this.orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
  }

  countByStatus(status: string): number {
    return this.orders.filter(order => order.status === status).length;
  }

  get uniqueCustomerCount(): number {
    const customerIds = this.orders.map(order => order.customerId);
    return new Set(customerIds).size;
  }

  get filteredOrders(): any[] {
    return this.selectedStatus
      ? this.orders.filter(order => order.status === this.selectedStatus)
      : [];
  }

  selectStatus(status: string): void {
    this.selectedStatus = status;
  }

  clearFilter(): void {
    this.selectedStatus = null;
  }
}
