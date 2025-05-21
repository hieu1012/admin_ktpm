import { Component, OnInit } from '@angular/core';
import { KENDO_GRID_EXCEL_EXPORT } from "@progress/kendo-angular-grid";
import { FormsModule } from '@angular/forms';
import { GridModule, PageChangeEvent, GridComponent } from '@progress/kendo-angular-grid';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { NgIf, NgFor } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { ManufactureService } from '../../core/services/manufacture.service';
import { CompositeFilterDescriptor, filterBy } from '@progress/kendo-data-query';
import { PriceFormatPipe } from '../../core/pipes/price-format.pipe';
import { fileExcelIcon, SVGIcon } from "@progress/kendo-svg-icons";
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { InventoryService } from '../../core/services/inventory.service';

import { NzSpinModule } from 'ng-zorro-antd/spin';


@Component({
  selector: 'app-product-management',
  imports: [NzButtonModule, NzSelectModule, NgFor, NzSpinModule, NzInputModule, FormsModule, GridModule, DialogModule, InputsModule, KENDO_GRID_EXCEL_EXPORT, DropDownsModule, NgIf, PriceFormatPipe, NzSliderModule, NzGridModule, NzInputNumberModule, NzDropDownModule, NzIconModule],
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.css',
})
export class ProductManagementComponent implements OnInit {
  productss: any[] = [];
  categorys: any[] = [];
  manufactures: any[] = [];
  gridData: any[] = [];
  pageSize: number = 5;
  skip: number = 0;
  gridView: any[] = [];

  selectedProduct: any = null;
  isNew = false;
  uploadedFiles: File[] = [];
  confirmDeleteId: string | null = null;
  showDeleteDialog = false;
  selectedItems: any[] = [];
  showBulkDeleteDialog = false;
  isDeleting = false;
  successCount = 0;
  failCount = 0;
  total = 0;
  fileExcelIcon: SVGIcon = fileExcelIcon;
  isLoading = false;
  deletedImageUrls: string[] = [];



  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private manufactureService: ManufactureService,
    private inventoryService: InventoryService
  ) { }

  fetchProductsForExcel = (component: GridComponent): ExcelExportData => {
    return {
      data: this.productss
    };
  };

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.productService.getAllProducts(0, 100).subscribe({
      next: (data) => {
        this.productss = data;
        this.gridData = data;
        this.loadItems();
      },
      error: (err) => console.error('Lỗi khi tải sản phẩm:', err)
    });

    this.categoryService.getAllCategories().subscribe({
      next: (res: any) => {
        this.categorys = res?.data || [];
      },
      error: (err) => console.error('Lỗi khi tải danh mục:', err)
    });

    this.manufactureService.getAllManufactures().subscribe({
      next: (res: any) => {
        this.manufactures = res?.data || [];
      },
      error: (err) => console.error('Lỗi khi tải nhà sản xuất:', err)
    });
  }

  loadItems(): void {
    this.gridView = this.gridData.slice(this.skip, this.skip + this.pageSize);
  }

  pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.loadItems();
  }

  onAddProduct(): void {
    this.isNew = true;
    this.uploadedFiles = [];
    this.selectedProduct = {
      name: '',
      price: 100000,
      shortDesc: '',
      detailDesc: '',
      quantity: 1,
      images: [],
      category: { id: '', name: '' },
      manufacture: { id: '', name: '' }
    };
  }

  // onEditProduct(product: any): void {
  //   this.isNew = false;
  //   this.uploadedFiles = [];
  //   this.selectedProduct = { ...product };
  // }
  onEditProduct(product: any): void {
    this.isNew = false;

    this.selectedProduct = {
      ...product,
      images: product.images.map((img: any) => img.url)
    };

    // Reset lại deletedImageUrls
    this.deletedImageUrls = [];

    // Giả lập file list từ ảnh cũ (không thực sự gửi lại các file này)
    this.uploadedFiles = product.images.map(() => null); // Dùng null để giữ đúng chỉ số khi remove
  }



  onImagesSelected(event: any): void {
    const files: FileList = event.target.files;
    if (!files.length) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedProduct.images.push(reader.result as string);
      };
      reader.readAsDataURL(file);
      this.uploadedFiles.push(file);
    });
  }

  onSaveProduct(product: any): void {
    if (this.isNew) {
      this.addNewProduct(product);
    } else {
      this.updateExistingProduct(product);
    }
  }

  updateExistingProduct(product: any): void {
    console.log('Cập nhật sản phẩm:', product);
    this.isLoading = true;
    this.productService.updateProduct(
      product,
      this.uploadedFiles.filter(f => f),
      this.deletedImageUrls
    )
      .subscribe({
        next: () => {
          this.loadData();
          this.resetForm();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Lỗi khi cập nhật sản phẩm:', err);
          this.isLoading = false;
        }
      });
  }

  // addNewProduct(product: any): void {
  //   if (!product.images || product.images.length === 0) {
  //     return console.error("Cần chọn hình ảnh cho sản phẩm mới");
  //   }

  //   this.productService.addProduct(product, this.uploadedFiles).subscribe({
  //     next: () => {
  //       this.loadData();
  //       this.resetForm();
  //     },
  //     error: (err) => console.error('Lỗi khi thêm sản phẩm:', err)
  //   });
  // }
  addNewProduct(product: any): void {
    if (!product.images || product.images.length === 0) {
      return console.error("Cần chọn hình ảnh cho sản phẩm mới");
    }

    this.isLoading = true; // Bắt đầu loading
    this.productService.addProduct(product, this.uploadedFiles).subscribe({
      next: () => {
        this.loadData();
        this.resetForm();
        this.isLoading = false; // Kết thúc loading
      },
      error: (err) => {
        console.error('Lỗi khi thêm sản phẩm:', err);
        this.isLoading = false; // Kết thúc loading khi lỗi
      }
    });
  }


  onCancelProduct(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.selectedProduct = null;
    this.isNew = false;
    this.uploadedFiles = [];
  }

  // removeImage(index: number): void {
  //   const removed = this.selectedProduct.images.splice(index, 1)[0];
  //   if (typeof removed === 'string' && removed.startsWith('http')) {
  //     this.deletedImageUrls.push(removed);
  //   }
  //   this.uploadedFiles.splice(index, 1);
  // }
  // Khi xóa ảnh
  removeImage(index: number): void {
    const removed = this.selectedProduct.images.splice(index, 1)[0];

    if (typeof removed === 'string' && removed.startsWith('http')) {
      this.deletedImageUrls.push(removed); // lưu URL ảnh cũ cần xóa
    } else {
      this.uploadedFiles.splice(index, 1); // ảnh mới thì xóa khỏi mảng files
    }

    if (this.uploadedFiles[index] !== null) {
      this.uploadedFiles.splice(index, 1);
    }
  }



  get isAllSelected(): boolean {
    return this.gridData.length > 0 && this.selectedItems.length === this.gridData.length;
  }

  toggleAllSelection(event: any): void {
    this.selectedItems = event.target.checked ? this.gridData.map(item => item.id) : [];
  }

  isItemSelected(item: any): boolean {
    return this.selectedItems.includes(item.id);
  }

  toggleItemSelection(item: any): void {
    const index = this.selectedItems.indexOf(item.id);
    index === -1 ? this.selectedItems.push(item.id) : this.selectedItems.splice(index, 1);
  }

  openBulkDeleteDialog(): void {
    if (this.selectedItems.length > 0) {
      this.showBulkDeleteDialog = true;
      this.successCount = 0;
      this.failCount = 0;
    }
  }

  bulkDeleteProducts(): void {
    this.isDeleting = true;
    const deleteRequests = this.selectedItems.map(id =>
      this.productService.deleteProduct(id).toPromise()
        .then(() => this.successCount++)
        .catch(() => this.failCount++)
    );

    Promise.allSettled(deleteRequests).then(() => {
      this.loadData();
      this.isDeleting = false;
    });
  }

  closeBulkDeleteDialog(): void {
    this.showBulkDeleteDialog = false;
    this.isDeleting = false;
    if (this.successCount > 0) this.selectedItems = [];
  }

  // searchCriteria dùng như cũ
  searchCriteria: any = {
    name: '',
    categoryId: null,
    manufactureId: null,
    quantity: null,
    minPrice: null,
    maxPrice: null
  };

  // Formatter hiển thị giá
  priceFormatter(value: number): string {
    return value ? `${value.toLocaleString('vi-VN')}` : '';
  }

  // Parser để nhập giá từ input
  priceParser(value: string): number {
    return parseFloat(value.replace(/[^0-9]/g, '')) || 0;
  }

  cancelDelete(): void {
    this.closeDeleteDialog();
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

  openDeleteDialog(id: string): void {
    this.confirmDeleteId = id;
    this.showDeleteDialog = true;
  }

  // Reset form tìm kiếm
  resetSearchCriteria(): void {
    this.searchCriteria = {
      name: '',
      categoryId: null,
      manufactureId: null,
      quantity: null,
      minPrice: 0,
      maxPrice: null
    };
    this.gridData = this.productss;
  }

  // Áp dụng tìm kiếm nâng cao
  applySearch(): void {
    const filters: CompositeFilterDescriptor = { logic: 'and', filters: [] };

    if (this.searchCriteria.name) {
      filters.filters.push({
        field: 'name',
        operator: 'contains',
        value: this.searchCriteria.name
      });
    }

    if (this.searchCriteria.categoryId !== null) {
      filters.filters.push({
        field: 'category.id',
        operator: 'eq',
        value: this.searchCriteria.categoryId
      });
    }

    if (this.searchCriteria.manufactureId !== null) {
      filters.filters.push({
        field: 'manufacture.id',
        operator: 'eq',
        value: this.searchCriteria.manufactureId
      });
    }

    if (this.searchCriteria.quantity !== null) {
      filters.filters.push({
        field: 'quantity',
        operator: 'eq',
        value: this.searchCriteria.quantity
      });
    }

    if (this.searchCriteria.minPrice !== null) {
      filters.filters.push({
        field: 'price',
        operator: 'gte',
        value: this.searchCriteria.minPrice
      });
    }

    if (this.searchCriteria.maxPrice !== null) {
      filters.filters.push({
        field: 'price',
        operator: 'lte',
        value: this.searchCriteria.maxPrice
      });
    }

    this.gridData = filterBy(this.productss, filters);
  }
}
