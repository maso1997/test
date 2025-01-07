import { Component, Input } from '@angular/core';
import { NbStepperComponent } from '@nebular/theme';

@Component({
  selector: 'gems-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss'],
})
export class QuestionnaireComponent {
  @Input() productName: string = '';
  @Input() productDescription: string = '';
  @Input() stepper!: NbStepperComponent;

  // Risk data
  riskTypes = [
    {
      type: 'Risque A',
      options: ['Option 1 de Risque A', 'Option 2 de Risque A', 'Option 3 de Risque A'],
      questions: ['Question 1 de Risque A ?', 'Question 2 de Risque A ?', 'Question 3 de Risque A ?'],
    },
    {
      type: 'Risque B',
      options: ['Option 1 de Risque B', 'Option 2 de Risque B', 'Option 3 de Risque B'],
      questions: ['Question 1 de Risque B ?', 'Question 2 de Risque B ?', 'Question 3 de Risque B ?'],
    },
    {
      type: 'Risque C',
      options: ['Option 1 de Risque C', 'Option 2 de Risque C', 'Option 3 de Risque C'],
      questions: ['Question 1 de Risque C ?', 'Question 2 de Risque C ?', 'Question 3 de Risque C ?'],
    },
  ];

  selectedRiskType: string = '';
  selectedRiskOptions: string[] = [];
  selectedQuestions: string[] = [];
  selectedOptions: { [key: string]: boolean } = {};

  questions: string[] = [];
  questionError: string | null = null;

  // Called when the risk type changes
  onRiskTypeChange() {
    const selectedRisk = this.riskTypes.find((risk) => risk.type === this.selectedRiskType);
    this.selectedRiskOptions = selectedRisk?.options || [];
    this.selectedQuestions = selectedRisk?.questions || [];
  }

  // Add an empty question
  addQuestion() {
    this.questions = [...this.questions, ''];
    this.questionError = null;
  }

  // Remove a question
  removeQuestion(index: number) {
    this.questions = this.questions.filter((_, i) => i !== index);
    this.questionError = null;
  }

  // Track by function for rendering
  trackByFn(index: number): number {
    return index;
  }

  // Submit the form
  submit(stepper: NbStepperComponent) {
    const allQuestionsFilled = this.questions.every((q) => q.trim() !== '');
    if (allQuestionsFilled) {
      stepper.next();
      this.questionError = null;
    } else {
      this.questionError = 'Veuillez écrire ou supprimer la question.';
    }
  }
}
