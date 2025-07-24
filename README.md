import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { NbToastrService, NbGlobalPhysicalPosition } from '@nebular/theme';
import { NotationService } from './notation.service';
import { SegmentDtoVues, AreaVueDto, FieldConfigVueDto } from './segmentDtoVues.model';

@Component({
  selector: 'app-add-notation',
  templateUrl: './add-notation.component.html',
  styleUrls: ['./add-notation.component.scss'],
})
export class AddNotationComponent implements OnInit {
  fieldForm!: FormGroup;
  referentiels$: any[] = [];
  segement?: SegmentDtoVues;

  constructor(
    private fb: FormBuilder,
    private toaster: NbToastrService,
    private serviceRef: any, // Type selon ton code
    private notationService: NotationService
  ) {
    this.fieldForm = this.fb.group({
      segment: [null, Validators.required],
      // Ajout d’un tableau areas pour chaque zone dynamique
      areas: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.serviceRef.getReferentiel(this.selectedRef).subscribe((data: any) => {
      this.referentiels$ = data;
    });
  }

  getAreaFG(index: number): FormGroup {
    return (this.fieldForm.get('areas') as FormArray).at(index) as FormGroup;
  }

  onSegementChange(segmentId: number): void {
    this.notationService.getSegmentById(segmentId).subscribe({
      next: (seg: SegmentDtoVues) => {
        this.segement = seg;
        // (Re)init du FormArray areas
        const areasArr = this.fieldForm.get('areas') as FormArray;
        areasArr.clear();
        seg.areas.forEach(area => {
          // Construction d’un FormGroup dynamique pour chaque field
          const group: { [k: string]: any } = {};
          area.fieldConfigurations.forEach((fc, fi) => {
            group['value' + fi] = [null];
          });
          areasArr.push(this.fb.group(group));
        });
      },
      error: err => this.toaster.danger('Erreur chargement segment')
    });
  }

  submit(): void {
    if (this.fieldForm.invalid) {
      this.fieldForm.markAllAsTouched();
      this.toaster.warning('Veuillez remplir tous les champs.', "Formulaire incomplet");
      return;
    }
    const payload = this.fieldForm.value;
    console.log('Payload soumis:', payload);
    this.toaster.success('Notation ajoutée ✅', 'Succès', {
      position: NbGlobalPhysicalPosition.TOP_RIGHT,
      duration: 3000,
    });
    this.fieldForm.reset();
    (this.fieldForm.get('areas') as FormArray).clear();
    this.segement = undefined;
  }
}
////////////////////////////////////::
<nb-card>
  <nb-card-header>
    <h2>Ajouter une notation</h2>
  </nb-card-header>
  <nb-card-body>
    <!-- Select segment -->
    <nb-form-field fullWidth>
      <nb-select
        fullWidth
        formControlName="segment"
        placeholder="Sélectionner un segment"
        (selectedChange)="onSegementChange($event)"
        [class.invalid]="fieldForm.get('segment')?.invalid && fieldForm.get('segment')?.touched"
      >
        <nb-option *ngFor="let s of referentiels$" [value]="s.id">
          {{ s.libelle }}
        </nb-option>
      </nb-select>
    </nb-form-field>
    <small class="error" *ngIf="fieldForm.get('segment')?.invalid && fieldForm.get('segment')?.touched">
      Ce champ est requis.
    </small>

    <!-- Zone dynamique : Areas -->
    <nb-accordion *ngIf="segement">
      <nb-accordion-item *ngFor="let area of segement.areas; let ai = index" [expanded]="true">
        <nb-accordion-item-header>
          <b>{{ area.libelle }}</b>
        </nb-accordion-item-header>
        <nb-accordion-item-body>
          <form [formGroup]="getAreaFG(ai)">
            <div *ngFor="let config of area.fieldConfigurations; let fi = index">
              <label>{{ config.libelle }}</label>
              <ng-container [ngSwitch]="config.type">
                <nb-form-field *ngSwitchCase="'TEXT'" fullWidth>
                  <input nbInput [formControlName]="'value' + fi" placeholder="Saisir texte" />
                </nb-form-field>
                <nb-form-field *ngSwitchCase="'DATE'" fullWidth>
                  <input nbInput type="date" [formControlName]="'value' + fi" />
                </nb-form-field>
                <nb-form-field *ngSwitchCase="'SELECT'" fullWidth>
                  <nb-select [formControlName]="'value' + fi">
                    <nb-option *ngFor="let opt of config.valueListItems" [value]="opt.id">
                      {{ opt.libelle }}
                    </nb-option>
                  </nb-select>
                </nb-form-field>
                <nb-form-field *ngSwitchCase="'BOOLEAN'" fullWidth>
                  <nb-select [formControlName]="'value' + fi">
                    <nb-option [value]="true">Oui</nb-option>
                    <nb-option [value]="false">Non</nb-option>
                  </nb-select>
                </nb-form-field>
              </ng-container>
            </div>
          </form>
        </nb-accordion-item-body>
      </nb-accordion-item>
    </nb-accordion>
  </nb-card-body>
  <nb-card-footer>
    <button nbButton status="primary" class="cr" type="submit" (click)="submit()">
      Valider
    </button>
  </nb-card-footer>
</nb-card>
@Transactional
public void seedSegmentPersonnePhysique() {
    // SEGMENT
    entityManager.createNativeQuery(
        "INSERT INTO segment (id, code, libelle) VALUES (10000, 'PP', 'Personne physique') " +
        "ON CONFLICT (id) DO NOTHING"
    ).executeUpdate();

    // AREA
    entityManager.createNativeQuery(
        "INSERT INTO area (id, code, libelle, segment_id) VALUES (10000, 'Donnees_Tiers', 'Données Tiers', 10000) " +
        "ON CONFLICT (id) DO NOTHING"
    ).executeUpdate();

    // LISTE DE VALEUR (Pour le SELECT "Sexe")
    entityManager.createNativeQuery(
        "INSERT INTO list_value (id, code, libelle) VALUES (10004, 'Sexe', 'Sexe') " +
        "ON CONFLICT (id) DO NOTHING"
    ).executeUpdate();

    // ITEMS DE LA LISTE "Sexe"
    entityManager.createNativeQuery(
        "INSERT INTO list_value_item (id, code, libelle, list_value_id) VALUES " +
        "(3, 'Masculin', 'Masculin', 10004), " +
        "(4, 'Feminin', 'Féminin', 10004) " +
        "ON CONFLICT (id) DO NOTHING"
    ).executeUpdate();

    // FIELD_CONFIGS pour l'area
    entityManager.createNativeQuery(
        "INSERT INTO field_configuration " +
        "(id, code, libelle, selected, type, value_list_id) VALUES " +
        "(10, 'Nom', 'Nom', true, 'TEXT', NULL), " +            // Champ texte
        "(12, 'Sexe', 'Sexe', true, 'SELECT', 10004), " +        // Champ SELECT relié à 10004
        "(13, 'Date_naissance', 'Date naissance', true, 'DATE', NULL), " + // Champ date
        "(14, 'Inactivite', 'Inactivité', true, 'BOOLEAN', NULL) " + // Champ booléen
        "ON CONFLICT (id) DO NOTHING"
    ).executeUpdate();

    // Lier les champs à l'area
    entityManager.createNativeQuery(
        "INSERT INTO area_field_config (area_id, field_config_id) VALUES " +
        "(10000, 10), (10000, 12), (10000, 13), (10000, 14) " +
        "ON CONFLICT (area_id, field_config_id) DO NOTHING"
    ).executeUpdate();
}
