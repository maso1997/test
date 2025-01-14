import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent {
  @Input() questions: { questionText: string }[] = [];
  @Input() answers: (boolean | null)[] = [];
  @Output() answersChange = new EventEmitter<(boolean | null)[]>();

  handleRadioChange(index: number, value: boolean) {
    this.answers[index] = value;
    this.answersChange.emit(this.answers);
  }
}
