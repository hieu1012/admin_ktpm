import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

// Data
import { USERS } from '../../../data/users';

//Component
import { UserFormComponent } from './user-form/user-form.component';
import { DialogCofirmComponent } from '../../shared/dialog-cofirm/dialog-cofirm.component';
import { DialogCofirmMutilComponent } from '../../shared/dialog-cofirm-mutil/dialog-cofirm-mutil.component';

@Component({
  selector: 'app-user-management',
  imports: [
    GridModule,
    NzIconModule,
    KENDO_GRID_EXCEL_EXPORT,
    NzDropDownModule,
    UserFormComponent,
    DialogCofirmComponent,
    DialogCofirmMutilComponent,
    CommonModule,
    NzSelectModule,
    NzButtonModule,
    NzInputModule,
    NzInputNumberModule,
    FormsModule

  ],

  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  listUsers: any[] = [];
  filteredUsers: any[] = [];

  public pageSize: number = 8;         // Số dòng mỗi trang
  public skip: number = 0;             // Vị trí bắt đầu trang hiện tại
  public gridView: any[] = [];         // Dữ liệu đang hiển thị trong grid

  ngOnInit(): void {
    this.listUsers = USERS;
    this.filteredUsers = [...this.listUsers];
  }

  pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.pageSize = event.take;
    this.gridView = this.filteredUsers.slice(this.skip, this.skip + this.pageSize);
  }


  // =================== Xử lý Thêm người dùng và Update ========================
  isUserFormVisible = false;
  currentUser: any = null;

  openUserForm(user?: any): void {
    console.log('Open user form with user:', user);
    this.currentUser = user ? { ...user } : null;
    this.isUserFormVisible = true;
  }

  onModalClosed(): void {
    console.log('Modal closed');
    this.isUserFormVisible = false;
    this.currentUser = null;
  }

  onUserSaved(userData: any): void {
    if (!userData.id) {
      const newId = this.listUsers.length > 0
        ? Math.max(...this.listUsers.map(user => user.id)) + 1
        : 1;

      const newUser = { ...userData, id: newId, totalOrders: 0 };
      this.listUsers = [...this.listUsers, newUser];
    } else {
      this.listUsers = this.listUsers.map(user =>
        user.id === userData.id ? { ...user, ...userData } : user
      );
    }
  }

  // =================== Xử lý xóa 1 người dùng ========================
  isDeleteDialogVisible = false;
  userIdToDelete: number | null = null;

  openDeleteDialog(userId: number): void {
    this.isDeleteDialogVisible = true;
    this.userIdToDelete = userId;
  }
  onDialogVisibleChange(): void {
    this.isDeleteDialogVisible = false;
  }

  onDeleteConfirmed(confirm: boolean): void {
    if (confirm && this.userIdToDelete !== null) {
      this.deleteUser(this.userIdToDelete);
    }
  }

  deleteUser(userId: number): void {
    this.listUsers = this.listUsers.filter(user => user.id !== userId);
    console.log('Xóa người dùng có ID:', userId);
  }

  // =================== Xử lý checkbox và xóa nhiều ngườis ========================
  selectedItems: any[] = [];
  isMultiDeleteDialogVisible = false;

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

  // Xử lý sự kiện chọn từ grid
  onSelectionChange(e: SelectionEvent): void {
    console.log('Selection event:', e);

    // Lấy danh sách các dòng đã chọn từ sự kiện
    if (e.selectedRows) {
      // Lấy các user id từ những dòng đã chọn
      this.selectedItems = e.selectedRows.map(row => {
        const index = row.index;
        return this.listUsers[index].id;
      });
    } else {
      this.selectedItems = [];
    }

    console.log('Selected IDs:', this.selectedItems);
  }

  // Mở dialog xóa nhiều
  openMultiDeleteDialog(): void {
    if (this.selectedItems.length === 0) {
      // Có thể hiển thị thông báo ở đây
      console.log('Chưa có người dùng nào được chọn');
      return;
    }

    this.isMultiDeleteDialogVisible = true;
  }

  // Xử lý khi xác nhận xóa nhiều
  handleMultiDelete(selectedIds: any[]): void {
    console.log('Xóa nhiều người dùng với IDs:', selectedIds);

    // Lọc ra danh sách người dùng sau khi xóa
    this.listUsers = this.listUsers.filter(user => !selectedIds.includes(user.id));

    // Reset selection
    this.selectedItems = [];

    // Hiển thị thông báo thành công (có thể sử dụng toast hoặc notification)
    console.log('Đã xóa thành công', selectedIds.length, 'người dùng');
  }

  // =================== Xử lý tìm kiếm nâng cao ========================
  userSearchCriteria = {
    name: '',
    email: '',
    phone: '',
    minOrders: null,
    status: '',
    role: ''
  };

  applyUserSearch() {
    console.log('Applying search with criteria:', this.userSearchCriteria);

    const { name, email, phone, minOrders, status, role } = this.userSearchCriteria;

    this.filteredUsers = this.listUsers.filter(user => {
      const matchesName = !name || user.name?.toLowerCase().includes(name.toLowerCase());
      const matchesEmail = !email || user.email?.toLowerCase().includes(email.toLowerCase());
      const matchesPhone = !phone || user.phone?.includes(phone);
      const matchesOrders = !minOrders || user.totalOrders >= minOrders;
      const matchesStatus = !status || user.status?.toLowerCase() === status.toLowerCase();
      const matchesRole = !role || user.role?.toLowerCase() === role.toLowerCase();

      return matchesName && matchesEmail && matchesPhone && matchesOrders && matchesStatus && matchesRole;
    });

    console.log('Filtered users:', this.filteredUsers);
  }


  resetUserSearchCriteria() {
    this.userSearchCriteria = {
      name: '',
      email: '',
      phone: '',
      minOrders: null,
      status: '',
      role: ''
    };

    this.filteredUsers = [...this.listUsers];
  }

}