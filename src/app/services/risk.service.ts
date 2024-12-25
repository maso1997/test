import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RiskService {
  // BehaviorSubject to store the current list of risks
  private risksSource = new BehaviorSubject<any[]>([

  ]);
  risks$ = this.risksSource.asObservable(); // Expose risks$ as an observable

  // Méthode pour récupérer tous les risques
  getRisks(): any[] {
    return this.risksSource.getValue();
  }

  // Méthode pour ajouter un risque
  addRisk(risk: any) {
    const currentRisks = this.risksSource.getValue();
    this.risksSource.next([...currentRisks, risk]);
  }

  // Méthode pour mettre à jour les risques
  updateRisks(updatedRisks: any[]) {
    this.risksSource.next(updatedRisks);
  }

  // Méthode pour supprimer un risque
  deleteRisk(riskToDelete: any) {
    const currentRisks = this.risksSource.getValue();
    const filteredRisks = currentRisks.filter(risk => risk.name !== riskToDelete.name);
    this.risksSource.next(filteredRisks);
  }
}
