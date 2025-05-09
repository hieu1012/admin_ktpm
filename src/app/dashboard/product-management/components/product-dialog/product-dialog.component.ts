import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.css']
})
export class ProductDialogComponent {
  @Input() product: any = null;
  @Input() isNew: boolean = false;
  @Input() categorys: any[] = [];
  @Input() manufactures: any[] = [];

  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  @Output() imageSelected = new EventEmitter<File>();
  @Output() removeImage = new EventEmitter<void>();

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) this.imageSelected.emit(file);
  }
}