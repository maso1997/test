import { Component, Input } from '@angular/core';
import { NbStepperComponent } from '@nebular/theme';

@Component({
  selector: 'gems-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss'],
})
export class QuestionnaireComponent {
  @Input() productName: string = '';  // Product Name
  @Input() productDescription: string = '';  // Product Description
  @Input() stepper!: NbStepperComponent;
  questions: string[] = ['']; // Initialize with one empty question input
  questionError: string | null = null; // To hold error message

  // Add an empty question
  addQuestion() {
    this.questions = [...this.questions, '']; // Add a new empty question input
    this.questionError = null; // Reset the error message
  }

  // Remove a question by its index
  removeQuestion(index: number) {
    this.questions = this.questions.filter((_, i) => i !== index);
    this.questionError = null; // Reset the error message
  }

  // Track by function for rendering
  trackByFn(index: number): number {
    return index; // Unique identifier for each question
  }

  // Submit the form and move to the next step
  submit(stepper: NbStepperComponent) {
    // Check if all questions are filled
    const allQuestionsFilled = this.questions.every((q) => q.trim() !== '');
    if (allQuestionsFilled) {
      // Move to the next step
      this.stepper.next();
      this.questionError = null; // Reset the error message
    } else {
      // Show an error message
      this.questionError = 'Veuillez écrire ou supprimer la question.';
    }
  }
}
