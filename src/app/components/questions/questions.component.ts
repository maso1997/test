import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
})
export class QuestionsComponent {
  @Input()
  questions: { questionText: string; subquestions: { yes: string[]; no: string[] } }[] = [];

  @Input()
  answers: (boolean | null)[] = [];

  @Input()
  subanswers: { yes: (boolean | null)[]; no: (boolean | null)[] }[] = [];

  @Output()
  answersChange = new EventEmitter<(boolean | null)[]>();

  @Output()
  subanswersChange = new EventEmitter<{ yes: (boolean | null)[]; no: (boolean | null)[] }[]>();

  handleRadioChange(index: number, value: boolean) {
    this.answers[index] = value;
    this.answersChange.emit(this.answers);

    if (!this.subanswers[index]) {
      this.subanswers[index] = { yes: [], no: [] };
    }

    if (value) {
      if (!this.subanswers[index].yes) {
        this.subanswers[index].yes = Array(this.questions[index].subquestions.yes.length).fill(null);
      }
    } else {
      if (!this.subanswers[index].no) {
        this.subanswers[index].no = Array(this.questions[index].subquestions.no.length).fill(null);
      }
    }
  }

  handleSubquestionChange(
    questionIndex: number,
    subquestionIndex: number,
    value: boolean,
    type: 'yes' | 'no'
  ) {
    if (!this.subanswers[questionIndex]) {
      this.subanswers[questionIndex] = { yes: [], no: [] };
    }

    if (!this.subanswers[questionIndex][type]) {
      this.subanswers[questionIndex][type] = Array(
        this.questions[questionIndex].subquestions[type].length
      ).fill(null);
    }

    this.subanswers[questionIndex][type][subquestionIndex] = value;
    this.subanswersChange.emit(this.subanswers);
  }
}
