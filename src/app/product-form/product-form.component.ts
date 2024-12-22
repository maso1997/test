import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent {
  productForm: FormGroup;
  users = [
    { id: 1, name: 'User A' },
    { id: 2, name: 'User B' },
    { id: 3, name: 'User C' }
  ];
  selectedFiles: File[] = [];

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      description: ['', Validators.required],
      creationDate: ['', Validators.required],
      coordinator: ['', Validators.required]
    });
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      this.selectedFiles.push(...files);
    }
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1); 
  }

  onSubmit() {
    if (this.productForm.valid) {
      console.log('Form Submitted:', this.productForm.value);
      console.log('Uploaded Files:', this.selectedFiles);
      alert('Formulaire soumis avec succès !');
      this.productForm.reset();
      this.selectedFiles = [];
    }
  }
}
