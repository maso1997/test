import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbStepperComponent } from '@nebular/theme';
import { Tooltip } from 'bootstrap';

@Component({
  selector: 'gems-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent {
  @Input() stepper!: NbStepperComponent; 
  @Output() productData = new EventEmitter<{ codeProduit:string,productName: string, description: string,createdBy:string,reglementaire:boolean,dateChoice:string }>(); // Emit product data// Input to control the stepper navigation

  productForm: FormGroup;
  users = [
    { id: 1, name: 'MOHAMED', email: 'MOHAMED@example.com', poste: 'directeur', departement: 'Departement A' },
    { id: 2, name: 'salah', email: 'salah@example.com', poste: 'ingenieur', departement: 'Departement B' },
    { id: 3, name: 'mariam', email: 'mariam@example.com', poste: 'technicien', departement: 'Departement C' }
  ];
  selectedFiles: File[] = [];
  isReasonRequired: boolean = false;


  get tooltipContent(): string {
    const userId = this.productForm.get('porteurproduit')?.value; // Get the selected porteur ID
    const user = this.users.find(u => u.id === +userId); // Find user by ID in the array
    
      return `
        <div>
          <p><strong>Name:</strong> Ameni </p>
          <p><strong>Email:</strong> amenidjemai@gmail.com</p>
          <p><strong>Role:</strong> ingénieur</p>
          <p><strong>Department:</strong> dev</p>
        </div>
      `;
    
  }
  

  ngAfterViewInit(): void {
    const createdByElement = document.getElementById('createdBy');
    if (createdByElement) {
      new Tooltip(createdByElement, {
        title: this.tooltipContent,
        html: true, 
      });
    }
  }
  selectedUser: any = null;
  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      codeProduit: [{ value: 'Generated Code', disabled: true }], // No validators
      productName: ['', Validators.required],
      description: ['', Validators.required],
      porteurproduit: ['', Validators.required],
      porteurEmail: [{ value: '', disabled: true }], // No validators
      porteurPoste: [{ value: '', disabled: true }],
      porteurDepartement: [{ value: '', disabled: true }],
      sponsorproduit: ['', Validators.required],
      sponsorEmail: [{ value: '', disabled: true }], // No validators
      sponsorPoste: [{ value: '', disabled: true }],
      sponsorDepartement: [{ value: '', disabled: true }],
      coprésidentmétier: ['', Validators.required],
      coprésidentrisque: ['', Validators.required],
      affectation: ['', Validators.required],
      status: [{ value: 'En cours', disabled: true }], // No validators
      reason: [''], // Validators will be applied conditionally
      coordinator: [{ value: 'Coordinateur Actif', disabled: true }], // No validators
      reglementaire: [false],
      nonreglementaire: [true],
      createdBy: [{ value: 'Coordinateur Actif', disabled: true }],
      dateChoice: [null, Validators.required]
       // No validators
    });
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      this.selectedFiles = [...this.selectedFiles, ...files];
    }
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  onStatusChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const status = select.value;
    this.isReasonRequired = ['suspendu', 'expiré', 'validé', 'clôturé'].includes(status);
    if (this.isReasonRequired) {
      this.productForm.get('reason')?.setValidators(Validators.required);
    } else {
      this.productForm.get('reason')?.clearValidators();
    }
    this.productForm.get('reason')?.updateValueAndValidity();
  }

  onPorteurChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const selectedPorteur = this.users.find(user => user.id === +select.value);
    if (selectedPorteur) {
      this.productForm.patchValue({
        porteurEmail: selectedPorteur.email,
        porteurPoste: selectedPorteur.poste,
        porteurDepartement: selectedPorteur.departement
      });
    }
  }

  onSponsorChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const selectedSponsor = this.users.find(user => user.id === +select.value);
    if (selectedSponsor) {
      this.productForm.patchValue({
        sponsorEmail: selectedSponsor.email,
        sponsorPoste: selectedSponsor.poste,
        sponsorDepartement: selectedSponsor.departement
      });
    }
  }

  onSubmit() {
    if (this.productForm.valid && this.selectedFiles.length > 0) {
      this.productData.emit({
        codeProduit: this.productForm.get('codeProduit')?.value,
        productName: this.productForm.get('productName')?.value,
        description: this.productForm.get('description')?.value,
        createdBy: this.productForm.get('createdBy')?.value,
        reglementaire: this.productForm.get('reglementaire')?.value,
        dateChoice: this.productForm.get('dateChoice')?.value, // Include dateChoice
      });
      this.stepper.next();
    } else {
      this.productForm.markAllAsTouched();
    }
  }
  
}
