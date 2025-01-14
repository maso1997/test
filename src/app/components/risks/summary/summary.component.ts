// src/app/risks/summary/summary.component.ts
import { Component } from '@angular/core';
import { RisksService } from '../../risks.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent {
  summary = this.risksService.getSummary();

  constructor(public risksService: RisksService) {}
}
