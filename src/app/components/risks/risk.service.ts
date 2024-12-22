import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Risk } from './risk.model';

@Injectable({
  providedIn: 'root',
})
export class RiskService {
  private risks: Risk[] = [
    { id: 1, name: 'Risque 1', description: 'Description du risque 1', type: 'Financier', responsiblePerson: 'Alice' },
    { id: 2, name: 'Risque 2', description: 'Description du risque 2', type: 'Sécurité', responsiblePerson: 'Bob' },
    { id: 3, name: 'Risque 3', description: 'Description du risque 3', type: 'Technologique', responsiblePerson: 'Charlie' },
    { id: 4, name: 'Risque 4', description: 'Description du risque 4', type: 'Opérationnel', responsiblePerson: 'Diana' },
  ];

  getRisks(): Observable<Risk[]> {
    return of(this.risks);
  }
}
