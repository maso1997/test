import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  notifications = [
    { date: '2025-01-09', title: 'Nouvelle mise à jour disponible' },
    { date: '2025-01-08', title: 'Maintenance programmée à 22h' },
    { date: '2025-01-07', title: 'Changement de politique de sécurité' },
    { date: '2025-01-02', title: 'Nouveau guide utilisateur disponible' }
  ];

  produits = [
    { code: 'P001', nom: 'Produit A' },
    { code: 'P002', nom: 'Produit B' },
    { code: 'P003', nom: 'Produit C' }
  ];

  risques = [
    { nom: 'Risque A', type: 'Financier' },
    { nom: 'Risque B', type: 'Technique' },
    { nom: 'Risque C', type: 'Opérationnel' }
  ];

  questionnaires = [
    { question: 'Avez-vous un plan de continuité ?', risque: 'Risque A' },
    { question: 'Le système est-il sécurisé ?', risque: 'Risque B' },
    { question: 'Les employés sont-ils formés ?', risque: 'Risque C' }
  ];
}
