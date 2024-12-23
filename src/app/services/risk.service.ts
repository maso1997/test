// src/app/services/risk.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RiskService {
  // Utilisation de BehaviorSubject pour garder la trace des risques et les rendre observables
  private risksSource = new BehaviorSubject<any[]>([
    { name: 'Risque 1', description: 'Description 1', type: 'Type 1', responsiblePerson: 'Personne 1' },
    { name: 'Risque 2', description: 'Description 2', type: 'Type 2', responsiblePerson: 'Personne 2' },
  ]);
  risks$ = this.risksSource.asObservable();

  constructor() { }

  // Méthode pour mettre à jour la liste des risques
  updateRisks(risks: any[]) {
    this.risksSource.next(risks);
  }

  // Méthode pour ajouter un risque
  addRisk(risk: any) {
    const currentRisks = this.risksSource.value;
    this.risksSource.next([...currentRisks, risk]);
  }

  // Méthode pour supprimer un risque
  deleteRisk(risk: any) {
    const updatedRisks = this.risksSource.value.filter(r => r !== risk);
    this.risksSource.next(updatedRisks);
  }
}
