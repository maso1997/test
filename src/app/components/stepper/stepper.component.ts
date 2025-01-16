import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent {
  codeProduit:string='';
  productName: string = '';
  productDescription: string = '';
  createdBy:string='';
  reglementaire:boolean=false;


  onProductDataReceived(data: { codeProduit:string,productName: string, description: string, createdBy: string, reglementaire:boolean }) {
    this.codeProduit=data.codeProduit
    this.productName = data.productName;
    this.productDescription = data.description;
    this.createdBy = data.createdBy;
    this.reglementaire=data.reglementaire;

  }
  productForm!: FormGroup; // The FormGroup from the product form will be passed to this component
}
