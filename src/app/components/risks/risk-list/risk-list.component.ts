import { Component } from '@angular/core';

@Component({
  selector: 'app-risk-list',
  templateUrl: './risk-list.component.html',
  styleUrls: ['./risk-list.component.scss']
})
export class RiskListComponent {
  risks = [
    { name: 'Risque 1', description: 'Description 1', type: 'Type 1', responsiblePerson: 'Personne 1' },
    { name: 'Risque 2', description: 'Description 2', type: 'Type 2', responsiblePerson: 'Personne 2' },
  ];

  selectedRisk: any = null;
  showDialog = false;
  dialogTitle = '';

  openAddRiskDialog() {
    this.selectedRisk = { name: '', description: '', type: '', responsiblePerson: '' };
    this.dialogTitle = 'Ajouter un risque';
    this.showDialog = true;
  }

  openEditRiskDialog(risk: any) {
    this.selectedRisk = { ...risk };
    this.dialogTitle = 'Modifier un risque';
    this.showDialog = true;
  }

  confirmDeleteRisk(risk: any) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce risque ?')) {
      this.risks = this.risks.filter((r) => r !== risk);
    }
  }

  saveRisk(risk: any) {
    // Validation: Ensure all fields are filled
    if (!risk.name || !risk.description || !risk.type || !risk.responsiblePerson) {
      alert('Tous les champs sont requis.');
      return;
    }

    // Edit or add new risk
    const index = this.risks.findIndex((r) => r.name === risk.name);
    if (index >= 0) {
      this.risks[index] = risk;
    } else {
      this.risks.push(risk);
    }
    this.closeDialog();
  }

  closeDialog(event?: MouseEvent) {
    // Check if event.target is an HTMLElement and use closest
    const target = event?.target as HTMLElement;
    if (event && !target?.closest('.modal-dialog')) {
      this.showDialog = false;
    } else {
      this.showDialog = false;
    }
  }
}
