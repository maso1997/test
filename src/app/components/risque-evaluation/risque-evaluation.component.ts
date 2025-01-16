import { Component,  Input } from '@angular/core';
import { NbStepperComponent } from '@nebular/theme';

@Component({
  selector: 'gems-risque-evaluation',
  templateUrl: './risque-evaluation.component.html',
  styleUrls: ['./risque-evaluation.component.scss']
})
export class RisqueEvaluationComponent {
  @Input() stepper!: NbStepperComponent; 

  isPageValid(): boolean {
    const currentAnswers = this.answers[this.currentPage];
    return currentAnswers.every(answer => answer !== null);  // Check if all answers are not null
  }


  isLoading: boolean = false;
  
  risks = [
    {
      title: 'Risque Financier',
      questions: [
        { questionText: 'La trésorerie est-elle suffisante pour ce projet ?' },
       // { questionText: 'Les coûts sont-ils bien estimés ?' },
        //{ questionText: 'Le retour sur investissement est-il incertain ?' },
       // { questionText: 'Y a-t-il des dettes importantes liées à ce projet ?' },
        //{ questionText: 'Les prévisions financières sont-elles réalistes ?' }
      ]
    },
    {
      title: 'Risque Juridique',
      questions: [
        { questionText: 'Le projet respecte-t-il les lois en vigueur ?' },
        //{ questionText: 'Y a-t-il des risques de litiges ?' },
        //{ questionText: 'Les contrats sont-ils clairs et complets ?' },
       // { questionText: 'Les données sont-elles protégées conformément au RGPD ?' },
       // { questionText: 'Y a-t-il un risque de non-conformité ?' }
      ]
    },
    {
      title: 'Risque Opérationnel',
      questions: [
        { questionText: 'Les processus sont-ils bien définis ?' },
       // { questionText: 'Les employés sont-ils formés pour ce projet ?' },
       // { questionText: 'Les outils nécessaires sont-ils disponibles ?' },
       // { questionText: 'Y a-t-il un risque d\'erreurs humaines ?' },
       // { questionText: 'Les délais sont-ils réalistes ?' }
      ]
    },
    {
      title: 'Risque Technologique',
      questions: [
        { questionText: 'La technologie est-elle mature ?' },
       // { questionText: 'Les systèmes sont-ils bien sécurisés ?' },
       // { questionText: 'Y a-t-il un plan de sauvegarde ?' },
      //  { questionText: 'Les outils technologiques sont-ils compatibles ?' },
       // { questionText: 'Le projet dépend-il de fournisseurs tiers ?' }
      ]
    },
    {
      title: 'Risque Stratégique',
      questions: [
        { questionText: 'Le projet est-il aligné avec la stratégie globale ?' },
        //{ questionText: 'Les objectifs sont-ils clairs ?' },
       // { questionText: 'Y a-t-il des impacts négatifs sur l\'image de l\'entreprise ?' },
       // { questionText: 'Le marché cible est-il bien défini ?' },
        //{ questionText: 'Les concurrents sont-ils bien analysés ?' }
      ]
    }
  ];

  currentPage = 0;
  answers: (boolean | null)[][] = this.risks.map(risk => new Array(risk.questions.length).fill(null));
  results: string[] = [];
  recommendation: string | null = null;

  get currentRisk() {
    return this.risks[this.currentPage];
  }

  nextPage() {
    if (this.isPageValid()) {
      if (this.currentPage < this.risks.length - 1) {
        this.currentPage++;
      }
    } else {
      // Optional: show an alert or message indicating that all questions must be answered
      alert('Please answer all questions before proceeding.');
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  calculateResults() {
    this.results = this.risks.map((risk, i) => {
      const yesCount = this.answers[i].filter(answer => answer === true).length;
      return `${risk.title}: ${yesCount}/${risk.questions.length} réponses "oui"`;
    });
  
    // Identify risky categories
    const riskyRisks = this.risks.filter((risk, i) => {
      const yesCount = this.answers[i].filter(answer => answer === true).length;
      const majority = risk.questions.length / 2; // More than half of the questions
      return yesCount > majority;
    }).map(risk => risk.title);
  
    // Update the recommendation based on risky categories
    if (riskyRisks.length > 0) {
      this.recommendation = `Vous avez des risques : ${riskyRisks.join(', ')}. Votre demande sera traitée.`;
    } else {
      this.recommendation = 'Votre demande sera traitée.';
    }
  
    // Move to the results page
    this.currentPage = this.risks.length;
  
    // Automatically move to the next step after 1 second
    setTimeout(() => {
      this.stepper.next(); // Move to the next step
    }, 5000);
  }

  
}
