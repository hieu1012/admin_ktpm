import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

// Kendo Grid
import { GridModule, PageChangeEvent } from '@progress/kendo-angular-grid';
import { KENDO_GRID_EXCEL_EXPORT } from '@progress/kendo-angular-grid';

// Ant Design
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

// Data
import { USERS } from '../../../data/users';

//Component
import { UserFormComponent } from './components/user-form/user-form.component';
import { DialogCofirmComponent } from '../../shared/dialog-cofirm/dialog-cofirm.component';

@Component({
  selector: 'app-user-management',
  imports: [
    GridModule,
    NzIconModule,
    KENDO_GRID_EXCEL_EXPORT,
    NzDropDownModule,
    UserFormComponent,

  ],

  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  listUsers: any[] = [];

  // Trạng thái hiển thị modal
  isUserFormVisible = false;

  ngOnInit(): void {
    this.listUsers = USERS;
  }

  // Xử lý phần modal
  openUserForm(): void {
    this.isUserFormVisible = true;
    console.log('Modal mở');
  }

  onModalClosed(): void {
    this.isUserFormVisible = false;
  }

  onUserSaved(userData: any): void {
    console.log('Nhận dữ liệu từ form:', userData);
    // Nếu đây là người dùng mới, thêm vào danh sách
    if (!userData.id) {
      // Tạo ID mới
      const newId = Math.max(...this.listUsers.map(user => user.id)) + 1;
      const newUser = { ...userData, id: newId };
      this.listUsers = [...this.listUsers, newUser];
    } else {
      // Nếu là cập nhật người dùng hiện có
      this.listUsers = this.listUsers.map(user =>
        user.id === userData.id ? { ...userData } : user
      );
    }

    // Sau khi xử lý xong, đóng modal
    this.isUserFormVisible = false;

  }

  // Xử lý checkbox
  selectedItems: any[] = []; // Danh sách ID của các sản phẩm đã chọn

  get isAllSelected(): boolean {
    return this.listUsers.length > 0 && this.selectedItems.length === this.listUsers.length;
  }

  toggleAllSelection(event: any): void {
    this.selectedItems = event.target.checked ? this.listUsers.map(item => item.id) : [];
  }

  isItemSelected(item: any): boolean {
    return this.selectedItems.includes(item.id);
  }

  toggleItemSelection(item: any): void {
    const index = this.selectedItems.indexOf(item.id);
    index === -1 ? this.selectedItems.push(item.id) : this.selectedItems.splice(index, 1);
  }


}
