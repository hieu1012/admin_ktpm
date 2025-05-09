import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';

@Component({
  selector: 'app-product-grid',
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.css']
})
export class ProductGridComponent {
  @Input() gridData: any[] = [];
  @Input() selectedItems: any[] = [];
  @Input() categorys: any[] = [];
  @Input() manufactures: any[] = [];
  @Input() filter: CompositeFilterDescriptor = { logic: 'and', filters: [] };

  @Output() add = new EventEmitter<void>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<CompositeFilterDescriptor>();
  @Output() selectionChange = new EventEmitter<string[]>();

  isItemSelected(item: any): boolean {
    return this.selectedItems.includes(item.id);
  }

  get isAllSelected(): boolean {
    return this.gridData.length > 0 && this.selectedItems.length === this.gridData.length;
  }

  toggleAllSelection(event: any): void {
    const checked = event.target.checked;
    this.selectionChange.emit(checked ? this.gridData.map(i => i.id) : []);
  }

  toggleItemSelection(item: any): void {
    const selected = [...this.selectedItems];
    const index = selected.indexOf(item.id);
    if (index === -1) selected.push(item.id);
    else selected.splice(index, 1);
    this.selectionChange.emit(selected);
  }

  categoryFilterChange(value: string): void {
    const newFilter = this.filter.filters.filter(f => 'field' in f && f.field !== 'category.name');
    if (value && value !== 'Tất cả danh mục') {
      newFilter.push({ field: 'category.name', operator: 'eq', value });
    }
    this.filterChange.emit({ ...this.filter, filters: newFilter });
  }

  manufactureFilterChange(value: string): void {
    const newFilter = this.filter.filters.filter(f => 'field' in f && f.field !== 'manufacture.name');
    if (value && value !== 'Tất cả hãng sản xuất') {
      newFilter.push({ field: 'manufacture.name', operator: 'eq', value });
    }
    this.filterChange.emit({ ...this.filter, filters: newFilter });
  }
}