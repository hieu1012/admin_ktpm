import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from '@progress/kendo-angular-dialog';



@Component({
  selector: 'app-dialog-cofirm',
  imports: [CommonModule, DialogModule],
  templateUrl: './dialog-cofirm.component.html',
  styleUrl: './dialog-cofirm.component.css'
})
export class DialogCofirmComponent {

  @Input() isVisible: boolean = false;
  @Output() isVisibleChange = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<boolean>();


  cancelDelete(): void {
    console.log('Hủy bỏ xóa');
    this.isVisible = false;
    this.isVisibleChange.emit();
    this.confirm.emit(false);
  }

  confirmDelete(): void {
    console.log('Xóa thành công');
    this.isVisibleChange.emit();
    this.confirm.emit(true);
  }

}
