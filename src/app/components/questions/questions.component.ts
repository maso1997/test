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
    // Sauvegarde de la réponse principale
    this.answers[index] = value;
    this.answersChange.emit(this.answers);

    // Initialisation des sous-réponses uniquement si la réponse est "Oui"
    if (value) {
      if (!this.subanswers[index]) {
        this.subanswers[index] = { yes: [], no: [] };
      }
      this.subanswers[index].yes = Array(this.questions[index].subquestions.yes.length).fill(null);
    } else {
      // Si la réponse est "Non", on vide les sous-réponses associées
      if (this.subanswers[index]) {
        this.subanswers[index].yes = [];
      }
    }
  }

  handleSubquestionChange(
    questionIndex: number,
    subquestionIndex: number,
    value: boolean
  ) {
    // Initialiser les sous-réponses si nécessaire
    if (!this.subanswers[questionIndex]) {
      this.subanswers[questionIndex] = { yes: [], no: [] };
    }

    // Mettre à jour uniquement les sous-réponses pour "Oui"
    if (!this.subanswers[questionIndex].yes) {
      this.subanswers[questionIndex].yes = Array(
        this.questions[questionIndex].subquestions.yes.length
      ).fill(null);
    }

    this.subanswers[questionIndex].yes[subquestionIndex] = value;
    this.subanswersChange.emit(this.subanswers);
  }
}
