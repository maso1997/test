import { Component } from '@angular/core';

declare var bootstrap: any;

@Component({
  selector: 'app-validation-des-risques',
  templateUrl: './validation-des-risques.component.html',
  styleUrls: ['./validation-des-risques.component.scss']
})
export class ValidationDesRisquesComponent {
  // Liste des risques
  risques: { dnp: string, status: string, perimetre: string, type: string, options: string[] }[] = [
    { dnp: 'DNP-101', status: 'En cours', perimetre: 'Département IT', type: '', options: [] },
    { dnp: 'DNP-102', status: 'Validé', perimetre: 'Département RH', type: '', options: [] },
    { dnp: 'DNP-103', status: 'En attente', perimetre: 'Département Finance', type: '', options: [] }
  ];

  // Variables pour le modal
  selectedRisque: any = null;
  selectedDnp: string = '';
  selectedType: string = '';
  selectedOptions: string[] = [];
  dynamicOptions: string[] = [];

  // Map des options par type
  optionsMap: { [key: string]: string[] } = {
    A: ['Risque Type A Numéro 1', 'Risque Type A Numéro 2', 'Risque Type A Numéro 3'],
    B: ['Risque Type B Numéro 1', 'Risque Type B Numéro 2', 'Risque Type B Numéro 3'],
    C: ['Risque Type C Numéro 1', 'Risque Type C Numéro 2', 'Risque Type C Numéro 3']
  };

  // Ouvrir le modal pour ajouter/modifier un risque
  openModal(index: number) {
    const risque = this.risques[index];
    this.selectedDnp = risque.dnp;
    this.selectedType = risque.type || '';
    this.selectedOptions = [...(risque.options || [])];
    this.updateOptions();

    const modal = new bootstrap.Modal(document.getElementById('risqueModal')!);
    modal.show();
  }

  // Ouvrir le modal pour visualiser un risque
  openViewModal(risque: any) {
    this.selectedRisque = risque;
    const modal = new bootstrap.Modal(document.getElementById('viewRisqueModal')!);
    modal.show();
  }

 updateOptions() {
    // Charger les nouvelles options basées sur le type sélectionné
    this.dynamicOptions = this.optionsMap[this.selectedType] || [];

    // Réinitialiser les options sélectionnées si le type change
    this.selectedOptions = [];
}

  isOptionSelected(): boolean {
    return this.selectedOptions.length > 0;
  }

  toggleOption(option: string) {
    const index = this.selectedOptions.indexOf(option);
    if (index === -1) {
      this.selectedOptions.push(option);
    } else {
      this.selectedOptions.splice(index, 1);
    }
  }

  submitRisque() {
    console.log('Type de Risque:', this.selectedType);
    console.log('Options sélectionnées:', this.selectedOptions);

    // Trouver et mettre à jour le risque
    const risqueIndex = this.risques.findIndex(r => r.dnp === this.selectedDnp);
    if (risqueIndex !== -1) {
        this.risques[risqueIndex].type = this.selectedType;
        this.risques[risqueIndex].options = [...this.selectedOptions];
    }

    // Fermer le modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('risqueModal')!);
    modal?.hide();

    // Si un risque est sélectionné pour la visualisation, le mettre à jour
    if (this.selectedRisque?.dnp === this.selectedDnp) {
        this.selectedRisque = { ...this.risques[risqueIndex] };
    }
}

}
