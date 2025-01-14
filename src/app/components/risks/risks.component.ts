// src/app/risks/risks.component.ts
import { Component } from '@angular/core';
import { RisksService } from '../risks.service';

@Component({
  selector: 'app-risks',
  templateUrl: './risks.component.html',
  styleUrls: ['./risks.component.scss'],
})
export class RisksComponent {
  currentPage = 0;

  constructor(public risksService: RisksService) {}

  nextPage() {
    if (this.currentPage < this.risksService.risks.length) this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 0) this.currentPage--;
  }
}
