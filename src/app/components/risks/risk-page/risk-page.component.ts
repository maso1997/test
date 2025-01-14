// src/app/risks/risk-page/risk-page.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-risk-page',
  templateUrl: './risk-page.component.html',
  styleUrls: ['./risk-page.component.scss'],
})
export class RiskPageComponent {
  @Input() risk: any;
  @Input() answers!: boolean[];

  toggleAnswer(index: number) {
    this.answers[index] = !this.answers[index];
  }
}
