import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-dialog-cofirm-mutil',
  imports: [CommonModule, DialogModule, NzButtonModule, NzIconModule],
  templateUrl: './dialog-cofirm-mutil.component.html',
  styleUrl: './dialog-cofirm-mutil.component.css'
})
export class DialogCofirmMutilComponent {
  @Input() isVisible: boolean = false;
  @Input() selectedItems: any[] = [];
  @Output() isVisibleChange = new EventEmitter<boolean>();
  @Output() deleteConfirmed = new EventEmitter<any[]>();

  isDeleting: boolean = false;
  successCount: number = 0;
  failCount: number = 0;

  closeBulkDeleteDialog(): void {
    this.isVisible = false;
    this.isVisibleChange.emit(false);
  }

  cancelDelete(): void {
    this.closeBulkDeleteDialog();
  }

  bulkDeleteProducts(): void {
    // Kiểm tra nếu không có items nào được chọn
    if (!this.selectedItems || this.selectedItems.length === 0) {
      console.warn('No items selected for deletion');
      return;
    }

    this.isDeleting = true;
    this.successCount = 0;
    this.failCount = 0;

    // Simulate a bulk delete operation
    setTimeout(() => {
      this.isDeleting = false;
      this.successCount = this.selectedItems.length; // Assume all deletions are successful
      this.failCount = 0; // No failures in this simulation

      // Emit selected items to parent component for deletion
      this.deleteConfirmed.emit(this.selectedItems);

      // Close the dialog after the operation
      this.closeBulkDeleteDialog();
    }, 2000);
  }
}
