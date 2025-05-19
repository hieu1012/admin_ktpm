
declare var html2pdf: any;

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';


// Kendo Grid
import { GridModule, PageChangeEvent, SelectionEvent } from '@progress/kendo-angular-grid';
import { KENDO_GRID_EXCEL_EXPORT } from '@progress/kendo-angular-grid';

// Ant Design
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';



import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { ORDERS } from '../../../data/orders';

import { PriceFormatPipe } from '../../core/pipes/price-format.pipe';
import { DateTimeFormatPipe } from '../../shared/pipes/datetime-format.pipe';

@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.component.html',
  styleUrl: './order-management.component.css',
  standalone: true,
  imports: [NzTableModule, NzModalModule, NzDescriptionsModule, CommonModule, GridModule, PriceFormatPipe, NzIconModule, KENDO_GRID_EXCEL_EXPORT, NzDropDownModule, NzSelectModule, NzButtonModule, NzInputModule, NzInputNumberModule]
})
export class OrderManagementComponent implements OnInit {
  orders = [...ORDERS];
  displayedOrders = [...ORDERS];

  public pageSize = 7;
  public skip = 0;
  public gridView: any[] = [];

  ngOnInit(): void {
    // this.loadOrders();
  }




  getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return 'text-yellow-500';
      case 'shipped': return 'text-blue-500';
      case 'completed': return 'text-green-600';
      case 'cancelled': return 'text-red-500';
      default: return 'text-gray-500';
    }
  }

  viewOrderDetail(order: any): void {
    console.log('Xem chi tiết đơn hàng:', order);
    // Có thể mở modal hoặc điều hướng sang trang chi tiết
  }


  // ========================= Xử lý chọn nhiều đơn hàng =========================
  selectedItems: any[] = [];

  get isAllSelected(): boolean {
    return this.orders.length > 0 && this.selectedItems.length === this.orders.length;
  }

  toggleAllSelection(event: any): void {
    this.selectedItems = event.target.checked ? this.orders.map(item => item.id) : [];
  }

  isItemSelected(item: any): boolean {
    return this.selectedItems.includes(item.id);
  }

  toggleItemSelection(item: any): void {
    const index = this.selectedItems.indexOf(item.id);
    index === -1 ? this.selectedItems.push(item.id) : this.selectedItems.splice(index, 1);
  }

  loadOrders(): void {
    this.gridView = this.displayedOrders.slice(this.skip, this.skip + this.pageSize);
  }

  pageChange(event: PageChangeEvent): void {
    console.log('Page changed:', event);
    this.skip = event.skip;
    this.pageSize = event.take;
  }


  // ========================= Xem chi tiết đơn hàng =========================
  isDetailVisible = false;
  orderDetail: any = null;

  showOrderDetail(order: any): void {
    this.orderDetail = order;
    this.isDetailVisible = true;
  }

  handleCloseDetail(): void {
    this.isDetailVisible = false;
  }

  // ========================= In hóa đơn =========================

  showInvoicePrint = false;
  currentDate: Date = new Date();
  getStatusText(status: string | undefined): string {
    if (!status) return '';

    switch (status) {
      case 'completed': return 'Hoàn thành';
      case 'pending': return 'Chờ xử lý';
      case 'shipped': return 'Đang giao';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  }
  // Sửa lại phương thức in hóa đơn
  onPreviewInvoicePDF(): void {
    if (!this.orderDetail) {
      console.error('Không có dữ liệu đơn hàng để in');
      return;
    }
    this.currentDate = new Date(); // Cập nhật thời gian hiện tại

    this.showInvoicePrint = true;

    setTimeout(() => {
      const el = document.querySelector('.invoice-container') as HTMLElement;
      if (!el) return;

      html2pdf().from(el).set({
        filename: `HoaDon_${this.orderDetail?.id}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }).save().finally(() => {
        this.showInvoicePrint = false;
      });
    }, 500); // Tăng thời gian chờ để đảm bảo HTML đã render
  }


}
