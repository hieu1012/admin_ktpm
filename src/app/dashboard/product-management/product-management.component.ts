import { Component } from '@angular/core';
import { KENDO_GRID } from "@progress/kendo-angular-grid";
import { products } from "../../../data/products";
import { FormsModule } from '@angular/forms';
import { GridModule } from '@progress/kendo-angular-grid';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { NgIf } from '@angular/common';
import { ProductStoreService } from '../../store/product-store.service';


@Component({
  selector: 'app-product-management',
  imports: [KENDO_GRID, FormsModule, GridModule, DialogModule, InputsModule, DropDownsModule],
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.css'
})
export class ProductManagementComponent {
  productss: any[] = [];

  newProduct: any = {
    name: '',
    price: 0,
    shortDesc: '',
    quantity: 0,
    categoryId: null,
    manufactureId: null
  };

  categoryList = [
    { id: '1', name: 'Laptop' },
    { id: '2', name: 'Smartphone' },
    { id: '3', name: 'Tablet' }
  ];

  manufactureList = [
    { id: '1', name: 'Dell' },
    { id: '2', name: 'Apple' },
    { id: '3', name: 'Samsung' }
  ];

  constructor(private productStore: ProductStoreService) { }

  ngOnInit(): void {
    this.productStore.loadProducts();
    this.productStore.products$.subscribe(data => {
      this.productss = data;
    });
  }

  isVisible = false;

  showModal(): void {
    console.log('Button add clicked!');
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

}


