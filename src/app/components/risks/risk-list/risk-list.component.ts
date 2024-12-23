import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RiskService } from 'src/app/services/risk.service';

@Component({
  selector: 'app-risk-list',
  templateUrl: './risk-list.component.html',
  styleUrls: ['./risk-list.component.scss']
})
export class RiskListComponent {
  risks: any[] = [];

  selectedRisk: any = null;
  showDialog = false;
  dialogTitle = '';

  constructor(private riskService: RiskService, private router: Router) {
    // Souscrire aux risques observables du service
    this.riskService.risks$.subscribe(risks => {
      this.risks = risks;
    });
  }

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
      this.riskService.deleteRisk(risk);
    }
  }

  saveRisk(risk: any) {
    if (!risk.name || !risk.description || !risk.type || !risk.responsiblePerson) {
      alert('Tous les champs sont requis.');
      return;
    }

    const index = this.risks.findIndex((r) => r.name === risk.name);
    if (index >= 0) {
      this.riskService.updateRisks(this.risks);
    } else {
      this.riskService.addRisk(risk);
    }
    this.closeDialog();
  }

  closeDialog(event?: MouseEvent) {
    const target = event?.target as HTMLElement;
    if (event && !target?.closest('.modal-dialog')) {
      this.showDialog = false;
    } else {
      this.showDialog = false;
    }
  }

  // Naviguer vers la page du rapport
  navigateToReport() {
    this.router.navigate(['/report']);
  }
}
