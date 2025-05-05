import { Component } from '@angular/core';
import { KENDO_GRID } from "@progress/kendo-angular-grid";
import { products } from "../../../data/products";
import { FormsModule } from '@angular/forms';
import { GridModule } from '@progress/kendo-angular-grid';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-product-management',
  imports: [KENDO_GRID, FormsModule, GridModule, DialogModule, InputsModule, DropDownsModule, NgIf],
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.css'
})
export class ProductManagementComponent {
  public gridData: any[] = products;

  public categoryList = [
    { id: '1', name: 'Laptop' },
    { id: '2', name: 'Smartphone' },
    { id: '3', name: 'Tablet' }
  ];

  public manufactureList = [
    { id: '1', name: 'Dell' },
    { id: '2', name: 'Apple' },
    { id: '3', name: 'Samsung' }
  ];
}


// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { CreateFormGroupArgs, GridModule, RowArgs } from '@progress/kendo-angular-grid';
// import { DialogModule } from '@progress/kendo-angular-dialog';
// import { InputsModule } from '@progress/kendo-angular-inputs';
// import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
// import { NgIf } from '@angular/common';

// @Component({
//   selector: 'app-product-management',
//   standalone: true,
//   imports: [
//     ReactiveFormsModule, GridModule, DialogModule, InputsModule, DropDownsModule
//   ],
//   templateUrl: './product-management.component.html',
//   styleUrls: ['./product-management.component.css']
// })
// export class ProductManagementComponent {
//   public products: any[] = [
//     {
//       id: 1,
//       name: 'iPhone 13',
//       price: 25000000,
//       shortDesc: 'Điện thoại cao cấp',
//       quantity: 10,
//       image: 'https://via.placeholder.com/60',
//       category: { id: '2', name: 'Smartphone' },
//       manufacture: { id: '2', name: 'Apple' }
//     }
//   ];

//   public formGroup!: FormGroup;

//   public categoryList = [
//     { id: '1', name: 'Laptop' },
//     { id: '2', name: 'Smartphone' },
//     { id: '3', name: 'Tablet' }
//   ];

//   public manufactureList = [
//     { id: '1', name: 'Dell' },
//     { id: '2', name: 'Apple' },
//     { id: '3', name: 'Samsung' }
//   ];

//   constructor(private fb: FormBuilder) {
//     this.createFormGroup = this.createFormGroup.bind(this);
//   }

//   public createFormGroup(args: CreateFormGroupArgs): FormGroup {
//     const item = args.isNew ? {
//       id: null,
//       name: '',
//       price: null,
//       shortDesc: '',
//       quantity: null,
//       image: '',
//       category: null,
//       manufacture: null
//     } : args.dataItem;

//     return this.fb.group({
//       id: [item.id],
//       name: [item.name, Validators.required],
//       price: [item.price, Validators.required],
//       shortDesc: [item.shortDesc],
//       quantity: [item.quantity, Validators.required],
//       image: [item.image],
//       category: [item.category, Validators.required],
//       manufacture: [item.manufacture, Validators.required]
//     });
//   }

//   public removeHandler({ dataItem }: RowArgs): void {
//     this.products = this.products.filter(p => p.id !== dataItem.id);
//   }

//   public saveHandler({ formGroup, isNew }: any): void {
//     const product = formGroup.value;
//     if (isNew) {
//       product.id = this.products.length + 1;
//       this.products.push(product);
//     } else {
//       const index = this.products.findIndex(p => p.id === product.id);
//       this.products[index] = product;
//     }
//     this.products = [...this.products]; // refresh grid
//   }

//   public cancelHandler(): void { }
// }
