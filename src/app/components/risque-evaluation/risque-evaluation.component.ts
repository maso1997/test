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
        {
          questionText: 'La trésorerie est-elle suffisante pour ce projet ?',
          subquestions: {
            yes: ['Quelle est la marge financière disponible ?', 'Quels investissements sont prévus ?'],
            no: ['Quels sont les besoins de financement supplémentaires ?', 'Y a-t-il des solutions de financement envisagées ?']
          }
        },
        {
          questionText: 'Les coûts sont-ils bien estimés ?',
          subquestions: {
            yes: ['Quels outils ont été utilisés pour l’estimation ?', 'Quels sont les coûts non pris en compte ?'],
            no: ['Quels sont les coûts manquants ?', 'Comment améliorer l’estimation des coûts ?']
          }
        }
      ]
    },
    {
      title: 'Risque Juridique',
      questions: [
        {
          questionText: 'Le projet respecte-t-il les lois en vigueur ?',
          subquestions: {
            yes: ['Quels contrôles juridiques ont été effectués ?', 'Y a-t-il une validation officielle ?'],
            no: ['Quels aspects juridiques posent problème ?', 'Quelles actions sont prévues pour la conformité ?']
          }
        },
        {
          questionText: 'Les données sont-elles protégées conformément au RGPD ?',
          subquestions: {
            yes: ['Quelles mesures de sécurité sont en place ?', 'Y a-t-il une politique de confidentialité établie ?'],
            no: ['Quels sont les risques liés aux données ?', 'Quel plan est prévu pour la conformité au RGPD ?']
          }
        }
      ]
    },
    {
      title: 'Risque Opérationnel',
      questions: [
        {
          questionText: 'Les processus sont-ils bien définis ?',
          subquestions: {
            yes: ['Comment sont documentés les processus ?', 'Y a-t-il des processus optimisés ?'],
            no: ['Quels processus manquent de définition ?', 'Quel est l’impact des processus mal définis ?']
          }
        },
        {
          questionText: 'Les délais sont-ils réalistes ?',
          subquestions: {
            yes: ['Quelles marges de manœuvre sont prévues ?', 'Y a-t-il un suivi des délais ?'],
            no: ['Quels sont les obstacles aux délais réalistes ?', 'Comment améliorer la gestion du temps ?']
          }
        }
      ]
    },
    {
      title: 'Risque Technologique',
      questions: [
        {
          questionText: 'La technologie est-elle mature ?',
          subquestions: {
            yes: ['Quels sont les retours sur cette technologie ?', 'Quels benchmarks ont été réalisés ?'],
            no: ['Quels sont les problèmes liés à la technologie ?', 'Existe-t-il des alternatives plus fiables ?']
          }
        },
        {
          questionText: 'Les systèmes sont-ils bien sécurisés ?',
          subquestions: {
            yes: ['Quels audits de sécurité ont été effectués ?', 'Y a-t-il un plan de sauvegarde en place ?'],
            no: ['Quels sont les failles identifiées ?', 'Quel est le plan pour améliorer la sécurité ?']
          }
        }
      ]
    },
    {
      title: 'Risque Stratégique',
      questions: [
        {
          questionText: 'Le projet est-il aligné avec la stratégie globale ?',
          subquestions: {
            yes: ['Quels sont les bénéfices stratégiques identifiés ?', 'Comment le projet soutient-il les objectifs globaux ?'],
            no: ['Quels éléments ne sont pas alignés ?', 'Quelles adaptations stratégiques sont nécessaires ?']
          }
        },
        {
          questionText: 'Le marché cible est-il bien défini ?',
          subquestions: {
            yes: ['Quels sont les segments de marché visés ?', 'Quelles études de marché ont été effectuées ?'],
            no: ['Quels aspects du marché sont flous ?', 'Comment affiner la définition du marché cible ?']
          }
        }
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
