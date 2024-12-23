import { Component } from '@angular/core';
import { RiskService } from '../../services/risk.service';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent {
  risks: any[] = [];
  showDetailsModal = false;
  selectedRisk: any = null;

  constructor(private riskService: RiskService) {
    // Souscrire aux risques dans le service
    this.riskService.risks$.subscribe(risks => {
      this.risks = risks;
    });
  }

  // Afficher les détails du risque dans une modale
  viewRiskDetails(risk: any) {
    this.selectedRisk = risk;
    this.showDetailsModal = true;
  }

  // Fermer la modale des détails
  closeDetailsModal() {
    this.showDetailsModal = false;
  }

  // Générer le PDF complet avec tous les risques
  generatePDF() {
    const doc = new jsPDF();
    doc.text('Rapport des Risques', 20, 10);
    let yPosition = 20;

    // Ajouter les en-têtes de table
    doc.text('Risque', 20, yPosition);
    doc.text('Description', 60, yPosition);
    doc.text('Type', 120, yPosition);
    doc.text('Personne Responsable', 160, yPosition);
    yPosition += 10;

    // Ajouter les lignes de la table
    this.risks.forEach((risk) => {
      doc.text(risk.name, 20, yPosition);
      doc.text(risk.description, 60, yPosition);
      doc.text(risk.type, 120, yPosition);
      doc.text(risk.responsiblePerson, 160, yPosition);
      yPosition += 10;
    });

    doc.save('rapport_risques.pdf');
  }

  // Générer le PDF pour un risque spécifique
  downloadRiskPDF(risk: any) {
    const doc = new jsPDF();
    doc.text('Risque Détails', 20, 10);
    let yPosition = 20;

    // Détails du risque
    doc.text(`Nom du risque: ${risk.name}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Description: ${risk.description}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Type: ${risk.type}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Personne Responsable: ${risk.responsiblePerson}`, 20, yPosition);

    doc.save(`${risk.name}_details.pdf`);
  }
}
