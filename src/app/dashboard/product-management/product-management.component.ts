
import { Component, ViewChild, OnInit } from '@angular/core';
import { KENDO_GRID, KENDO_GRID_EXCEL_EXPORT } from "@progress/kendo-angular-grid";
import { FormsModule } from '@angular/forms';
import { GridModule } from '@progress/kendo-angular-grid';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { NgIf } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { ManufactureService } from '../../core/services/manufacture.service';
import { CompositeFilterDescriptor, filterBy } from '@progress/kendo-data-query';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { PriceFormatPipe } from '../../core/pipes/price-format.pipe';
import { UppercasePipe } from '../../core/pipes/uppercase.pipe';
import { fileExcelIcon, SVGIcon } from "@progress/kendo-svg-icons";
import {
  aggregateBy,
  AggregateDescriptor,
  AggregateResult,
  GroupDescriptor,
} from "@progress/kendo-data-query";


@Component({
  selector: 'app-product-management',
  imports: [KENDO_GRID, FormsModule, GridModule, DialogModule, InputsModule, KENDO_GRID_EXCEL_EXPORT, DropDownsModule, NgIf, NzDropDownModule, UppercasePipe, PriceFormatPipe, NzIconModule],
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.css'
})
export class ProductManagementComponent implements OnInit {

  productss: any[] = [];
  categorys: any[] = [];
  manufactures: any[] = [];
  gridData: any[] = [];


  selectedProduct: any = null;
  isNew: boolean = false;
  uploadedFile: File | null = null;
  confirmDeleteId: string | null = null;
  showDeleteDialog: boolean = false;

  filter: CompositeFilterDescriptor = {
    logic: 'and',
    filters: [],
  };

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private manufactureService: ManufactureService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.productService.getAllProducts().subscribe({
      // next: (data) => this.productss = data,
      next: (data) => {
        this.productss = data;
        this.gridData = filterBy(this.productss, this.filter);
      },
      error: (err) => console.error('Lỗi khi tải sản phẩm:', err)
    });

    this.categoryService.getAllCategories().subscribe({
      next: (response: any) => {
        if (response?.data) {
          this.categorys = response.data;
        }
      },
      error: (err) => console.error('Lỗi khi tải danh mục:', err)
    });

    this.manufactureService.getAllManufactures().subscribe({
      next: (response: any) => {
        if (response?.data) {
          this.manufactures = response.data;
        }
      },
      error: (err) => console.error('Lỗi khi tải nhà sản xuất:', err)
    });
  }

  filterChange(filter: CompositeFilterDescriptor): void {
    this.filter = filter;
    this.gridData = filterBy(this.productss, this.filter);
  }



  onAddProduct(): void {
    this.isNew = true;
    this.selectedProduct = {
      name: '',
      price: 1000,
      shortDesc: '',
      detailDesc: '',
      quantity: 0,
      image: '',
      category: { id: '', name: '' },
      manufacture: { id: '', name: '' }
    };
  }

  onEditProduct(product: any): void {
    this.isNew = false;
    this.selectedProduct = { ...product };
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedProduct.image = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSaveProduct(product: any): void {
    if (product.id) {
      this.updateExistingProduct(product);
    } else {
      this.addNewProduct(product);
    }
  }

  updateExistingProduct(product: any): void {
    this.productService.updateProduct(product, this.uploadedFile).subscribe({
      next: (res) => {
        this.loadData();
        this.resetForm();
      },
      error: (err) => console.error('Lỗi khi cập nhật sản phẩm:', err)
    });
  }

  addNewProduct(product: any): void {
    if (!this.uploadedFile) {
      console.error("Cần chọn hình ảnh cho sản phẩm mới");
      return;
    }

    this.productService.addProduct(product, this.uploadedFile).subscribe({
      next: (res) => {
        this.loadData();
        this.resetForm();
      },
      error: (err) => console.error('Lỗi khi thêm sản phẩm:', err)
    });
  }

  resetForm(): void {
    this.selectedProduct = null;
    this.isNew = false;
    this.uploadedFile = null;
  }

  onCancelProduct(): void {
    this.resetForm();
  }

  openDeleteDialog(id: string): void {
    this.confirmDeleteId = id;
    this.showDeleteDialog = true;
  }

  confirmDelete(): void {
    if (!this.confirmDeleteId) return;

    this.productService.deleteProduct(this.confirmDeleteId).subscribe({
      next: () => {
        this.loadData();
        this.closeDeleteDialog();
      },
      error: (err) => console.error('Lỗi khi xóa sản phẩm:', err)
    });
  }

  closeDeleteDialog(): void {
    this.showDeleteDialog = false;
    this.confirmDeleteId = null;
  }

  cancelDelete(): void {
    this.closeDeleteDialog();
  }

  removeImage() {
    this.selectedProduct.image = null;
  }

  categoryFilterChange(value: string, filter: CompositeFilterDescriptor): void {
    console.log("Giá trị category filter:", value);

    // Tìm và xóa bất kỳ bộ lọc nào hiện tại về category.name
    this.filter.filters = this.filter.filters.filter(
      f => 'field' in f && f.field !== 'category.name'
    );

    // Thêm bộ lọc mới nếu có giá trị
    if (value && value !== 'Tất cả danh mục') {
      this.filter.filters.push({
        field: 'category.name',
        operator: 'eq',
        value: value
      });
    }

    console.log("Các bộ lọc hiện tại:", this.filter.filters);
    console.log("Số lượng dữ liệu gốc:", this.productss.length);

    // Áp dụng bộ lọc - luôn lọc từ dữ liệu gốc
    this.gridData = filterBy(this.productss, this.filter);

    console.log("Số lượng dữ liệu sau khi lọc:", this.gridData.length);
  }

  manufactureFilterChange(value: string, filter: CompositeFilterDescriptor): void {
    // Tìm và xóa bất kỳ bộ lọc nào hiện tại về manufacture.name
    this.filter.filters = this.filter.filters.filter(
      f => 'field' in f && f.field !== 'manufacture.name'
    );

    // Thêm bộ lọc mới nếu có giá trị
    if (value && value !== 'Tất cả hãng sản xuất') {
      this.filter.filters.push({
        field: 'manufacture.name',
        operator: 'eq',
        value: value
      });
    }
    this.gridData = filterBy(this.productss, this.filter);
  }


  // Biến để theo dõi trạng thái
  selectedItems: any[] = []; // Mảng lưu id các sản phẩm được chọn

  // Phương thức kiểm tra trạng thái "Chọn tất cả"
  get isAllSelected(): boolean {
    return this.gridData.length > 0 && this.selectedItems.length === this.gridData.length;
  }

  // Phương thức toggle trạng thái "Chọn tất cả"
  toggleAllSelection(event: any): void {
    const checked = event.target.checked;

    if (checked) {
      // Chọn tất cả
      this.selectedItems = this.gridData.map(item => item.id);
    } else {
      // Bỏ chọn tất cả
      this.selectedItems = [];
    }
  }

  // Phương thức kiểm tra xem một item có được chọn không
  isItemSelected(item: any): boolean {
    return this.selectedItems.includes(item.id);
  }

  // Phương thức toggle trạng thái của một item
  toggleItemSelection(item: any): void {
    const index = this.selectedItems.indexOf(item.id);
    if (index === -1) {
      this.selectedItems.push(item.id);
    } else {
      this.selectedItems.splice(index, 1);
    }
  }

  // =================== Các biến để quản lý xóa nhiều sản phẩm =========================
  showBulkDeleteDialog: boolean = false;
  isDeleting: boolean = false;
  deleteProgress: number = 0;
  successCount: number = 0;
  failCount: number = 0;

  // Mở dialog xóa nhiều sản phẩm 
  openBulkDeleteDialog(): void {
    if (this.selectedItems.length === 0) return;

    this.showBulkDeleteDialog = true;
    this.resetDeleteStatus();
  }

  // Xóa nhiều sản phẩm tuần tự
  bulkDeleteProducts(): void {
    if (this.selectedItems.length === 0) {
      this.closeBulkDeleteDialog();
      return;
    }

    this.isDeleting = true;
    this.resetDeleteStatus();

    // Clone mảng để không ảnh hưởng mảng gốc
    const itemsToDelete = [...this.selectedItems];
    this.processDeleteQueue(itemsToDelete);
  }

  // Xử lý hàng đợi xóa
  private processDeleteQueue(queue: string[]): void {
    if (queue.length === 0) {
      this.completeDelete();
      return;
    }

    const currentId = queue[0];
    const remaining = queue.slice(1);

    this.productService.deleteProduct(currentId).subscribe({
      next: () => this.handleDeleteSuccess(remaining),
      error: (err) => this.handleDeleteError(err, currentId, remaining)
    });
  }

  // Xử lý khi xóa thành công
  private handleDeleteSuccess(remaining: string[]): void {
    this.successCount++;
    this.updateProgress();
    this.processDeleteQueue(remaining);
  }

  // Xử lý khi xóa thất bại
  private handleDeleteError(error: any, itemId: string, remaining: string[]): void {
    console.error(`Không thể xóa sản phẩm ID: ${itemId}`, error);
    this.failCount++;
    this.updateProgress();
    this.processDeleteQueue(remaining);
  }

  // Cập nhật tiến trình
  private updateProgress(): void {
    const total = this.selectedItems.length;
    const processed = this.successCount + this.failCount;
    this.deleteProgress = Math.round((processed / total) * 100);
  }

  // Reset trạng thái xóa
  private resetDeleteStatus(): void {
    this.deleteProgress = 0;
    this.successCount = 0;
    this.failCount = 0;
  }

  // Hoàn tất quá trình xóa
  private completeDelete(): void {
    this.isDeleting = false;
    this.loadData();
  }

  // Đóng dialog xóa nhiều
  closeBulkDeleteDialog(): void {
    this.showBulkDeleteDialog = false;
    this.isDeleting = false;

    if (this.successCount > 0) {
      this.selectedItems = [];
    }
  }


  // =================== Xuất Excel =========================
  public fileExcelIcon: SVGIcon = fileExcelIcon;

  public aggregates: AggregateDescriptor[] = [
    { field: "UnitPrice", aggregate: "sum" },
  ];

  public products: any[] = this.productss;
  public total: AggregateResult = aggregateBy(this.products, this.aggregates);
  public group: GroupDescriptor[] = [
    {
      field: "Discontinued",
      aggregates: this.aggregates,
    },
  ];


}

