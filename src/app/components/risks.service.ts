// src/app/risks.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RisksService {
  // Risk types and questions
  risks = [
    {
      type: 'Risque Financier',
      questions: [
        'Avez-vous des dettes non remboursées ?',
        'Avez-vous des revenus instables ?',
        'Dépensez-vous plus que ce que vous gagnez ?',
        'Avez-vous une faible épargne ?',
        'Votre budget est-il mal planifié ?',
      ],
    },
    {
      type: 'Risque Juridique',
      questions: [
        'Êtes-vous en litige avec une autre partie ?',
        'Respectez-vous toujours les lois locales ?',
        'Avez-vous des contrats non conformes ?',
        'Êtes-vous en retard dans vos déclarations fiscales ?',
        'Utilisez-vous des pratiques douteuses dans vos activités ?',
      ],
    },
    {
      type: 'Risque Opérationnel',
      questions: [
        'Avez-vous souvent des interruptions de service ?',
        'Vos processus sont-ils documentés ?',
        'Y a-t-il un manque de personnel qualifié ?',
        'Avez-vous des équipements vieillissants ?',
        'Les délais sont-ils souvent dépassés ?',
      ],
    },
    {
      type: 'Risque Stratégique',
      questions: [
        'Votre entreprise a-t-elle une stratégie claire ?',
        'Avez-vous identifié vos concurrents ?',
        'Votre plan d\'expansion est-il réaliste ?',
        'Vous manquez d\'innovation ?',
        'Êtes-vous affecté par des changements dans votre secteur ?',
      ],
    },
    {
      type: 'Risque Environnemental',
      questions: [
        'Respectez-vous les normes environnementales ?',
        'Êtes-vous exposé à des catastrophes naturelles ?',
        'Vos activités nuisent-elles à l\'environnement ?',
        'Avez-vous un plan pour gérer les déchets ?',
        'Avez-vous des mesures en place contre le changement climatique ?',
      ],
    },
  ];

  // Track user answers
  answers: boolean[][] = this.risks.map(() => Array(5).fill(false));

  // Generate summary
  getSummary() {
    return this.risks.map((risk, index) => {
      const yesCount = this.answers[index].filter((ans) => ans).length;
      return {
        type: risk.type,
        yesCount,
        total: risk.questions.length,
        message:
          yesCount > 2
            ? `Vous risquez un problème ${risk.type.toLowerCase()}`
            : `Vous ne risquez pas de problème ${risk.type.toLowerCase()}`,
      };
    });
  }
}
