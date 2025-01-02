import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent {
  productName: string = '';
  productDescription: string = '';

  onProductDataReceived(data: { productName: string, description: string }) {
    this.productName = data.productName;
    this.productDescription = data.description;
  }
  productForm!: FormGroup; // The FormGroup from the product form will be passed to this component
}
