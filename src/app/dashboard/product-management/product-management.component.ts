
import { Component, ViewChild } from '@angular/core';
import { KENDO_GRID } from "@progress/kendo-angular-grid";
import { FormsModule } from '@angular/forms';
import { GridModule } from '@progress/kendo-angular-grid';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { NgIf } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { ManufactureService } from '../../services/manufacture.service';

@Component({
  selector: 'app-product-management',
  imports: [KENDO_GRID, FormsModule, GridModule, DialogModule, InputsModule, DropDownsModule, NgIf],
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.css'
})
export class ProductManagementComponent {
  productss: any[] = [];
  categorys: any[] = [];
  manufactures: any[] = [];
  selectedProduct: any = null;
  isNew: boolean = false;
  uploadedFile: File | null = null;
  confirmDeleteId: string | null = null;
  showDeleteDialog: boolean = false;

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
      next: (data) => this.productss = data,
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

  onAddProduct(): void {
    this.isNew = true;
    this.selectedProduct = {
      name: '',
      price: 0,
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
}