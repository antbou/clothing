import { Component, ViewChild } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { Product, Products } from '../types';
import { ProductComponent } from '../components/product/product.component';
import { CommonModule } from '@angular/common';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { EditPopupComponent } from '../components/edit-popup/edit-popup.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ProductComponent,
    CommonModule,
    PaginatorModule,
    EditPopupComponent,
    ButtonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(private productsService: ProductsService) {}

  @ViewChild('paginator') paginator: Paginator | undefined;

  products: Product[] = [];

  first: number = 0;
  rows: number = 5;
  totalRecords: number = 0;

  displayEditPopup: boolean = false;
  displayAddPopup: boolean = false;

  selectedProduct: Product = {
    id: 0,
    name: '',
    price: '',
    image: '',
    rating: 0,
  };

  toggleEditPopup(product: Product) {
    this.displayEditPopup = !this.displayEditPopup;
    this.selectedProduct = product;
  }

  toggleDeletePopup(product: Product) {
    if (!product.id) {
      return;
    }

    this.deleteProduct(product.id);
  }

  toggleAddPopup() {
    this.displayAddPopup = !this.displayAddPopup;
  }

  onConfirmEdit(product: Product) {
    if (!this.selectedProduct.id) {
      return;
    }
    this.editProduct(product, this.selectedProduct.id);
    this.displayEditPopup = false;
  }

  onConfirmAdd(product: Product) {
    this.addProduct(product);
    this.displayAddPopup = false;
  }

  onProductOutput(product: Product) {
    console.log(product);
  }

  onPageChange(event: any) {
    this.fetchProducts(event.page, event.rows);
  }

  resetPaginator() {
    this.paginator?.changePage(0);
  }

  fetchProducts(page: number, perPage: number) {
    this.productsService
      .getProducts('http://localhost:3000/clothes', { page, perPage })
      .subscribe({
        next: (data: Products) => {
          this.products = data.items;
          this.totalRecords = data.total;
        },
        error: (error) => {
          console.error('Error:', error);
        },
      });
  }

  editProduct(product: Product, id: number) {
    this.productsService
      .editProduct(`http://localhost:3000/clothes/${id}`, product)
      .subscribe({
        next: (data) => {
          this.fetchProducts(0, this.rows);
          this.resetPaginator();
        },
        error: (error) => {
          console.error('Error:', error);
        },
      });
  }

  deleteProduct(id: number) {
    this.productsService
      .deleteProduct(`http://localhost:3000/clothes/${id}`)
      .subscribe({
        next: (data) => {
          this.fetchProducts(0, this.rows);
          this.resetPaginator();
        },
        error: (error) => {
          console.error('Error:', error);
        },
      });
  }

  addProduct(product: Product) {
    this.productsService
      .addProduct('http://localhost:3000/clothes', product)
      .subscribe({
        next: (data) => {
          this.fetchProducts(0, this.rows);
          this.resetPaginator();
        },
        error: (error) => {
          console.error('Error:', error);
        },
      });
  }

  ngOnInit() {
    this.fetchProducts(0, this.rows);
  }
}
