
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FieldConfigurationDTO, ListValueDTO, ListValueItemDTO, RisqueValueItemDTO } from '../../model/fieldConfig';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { NbToastrService } from '@nebular/theme';
import { TraitementsService } from 'src/app/features/service/traitement.service';
import { AreaServiceService } from '../../services/area-service.service';

@Component({
  selector: 'app-saisie-demande',
  templateUrl: './saisie-demande.component.html',
  styleUrl: './saisie-demande.component.scss',
  standalone: false
})
export class SaisieDemandeComponent implements OnInit {
  constructor(private demandeService:TraitementsService,private fb: FormBuilder,private toasterService:NbToastrService,private areaService:AreaServiceService) {
   this.searchFormGroup = this.fb.group({
      code: [''],
      libelle: [''],
      type: [''],
      contrainte: [''],
    });

     this.fieldForm = this.fb.group({
        code: [''],
        libelle: [''],
        type: [''],
        valueId: [null],
        customBloc: [null],
        risqueValueId: [null],
        risqueItemsValues: [null],
        selected: [true],
        fonction: [false],      
        fonctionType: [null],
        searchable:[true],
        dateBloc:[null],
        selectBoolean:[null],
        contrainte:[null]
  });
  }

  fonctionTypes = [
  { code: 'Cash', libelle: 'Calcule de Cash ' },
  { code: 'Produit', libelle: 'Calcule de Produit ' },
  { code: 'Contract', libelle: 'Calcule Contract ' },
  { code: 'Paye', libelle: 'Calcule de Paye a Risque Elevée' }
];

selectedType: string = '';
listeDeBlocsSelectionnee = false;
selectedRisks: { valueItemId: number; riskId: number }[] = [];
contrainte=false;
 fields: FieldConfigurationDTO[] = [];
  filtredItems: FieldConfigurationDTO[] = [];
  columns: any[] = [];
  dashboard = false;
  sortValue = '';
  sortDirection = true;
  searchFormGroup: FormGroup;
  canEdit = true;
  canAdd = true;
  formGroup!: FormGroup;
  fieldConfig!: any;
  fieldForm!: FormGroup;
  listeValue:any[]=[];
  listeArea:any[]=[];
  types:any[]=[
    {code:"select",libelle:"List"},
    {code:"text",libelle:"text"},
    {code:"number",libelle:"Numéro"},
    {code:"date",libelle:"date"},
    {code:"boolean",libelle:"Oui/Non"}
  ];

  listValueItems: ListValueItemDTO[] = [];
  riskValueItems: RisqueValueItemDTO[] = [];
  listRisque :any[] = [];

  selectedRisksMap: Record<number, RisqueValueItemDTO> = {};
  donnees: { value: string; niveauRisque: string }[] = [];

  ngOnInit(): void {
    this.listValue();
    this.getRisques();
      this.columns = [
      { key: 'code', label: 'Code', hidden: false },
      { key: 'libelle', label: 'Libellé', hidden: false },
      { key: 'type', label: 'Type', hidden: false },
      { key: 'contrainte', label: 'Contrainte', hidden: false },
      // Ajoute d'autres colonnes selon tes besoins
    ];

    this.loadFields();
    //this.listAreas();
this.fieldForm.get('fonction')!.valueChanges.subscribe(isFonction => {
  const ctrl = this.fieldForm.get('fonctionType')!;
  if (isFonction) {
    ctrl.setValidators([Validators.required]);
  } else {
    ctrl.clearValidators();
    ctrl.setValue(null);
  }
  ctrl.updateValueAndValidity();
});

this.fieldForm.get('type')?.valueChanges.subscribe((type) => {
  const form = this.fieldForm;
  const valueId = form.get('valueId');
  const risqueValueId = form.get('risqueValueId');
  const risqueItemsValues = form.get('risqueItemsValues');
  const customBloc = form.get('customBloc');
  const dateBloc = form.get('dateBloc');
  const selectBoolean = form.get('selectBoolean');
  const fonction = form.get('fonction');
  const fonctionType = form.get('fonctionType');

  // Reset validators by type
  switch(type) {
    case 'text':
      valueId?.clearValidators();
      risqueValueId?.clearValidators();
      risqueItemsValues?.clearValidators();
      customBloc?.setValidators([Validators.required]);
      dateBloc?.clearValidators();
      selectBoolean?.clearValidators();
      break;
    case 'select':
      valueId?.setValidators([Validators.required]);
      risqueValueId?.setValidators([Validators.required]);
      risqueItemsValues?.setValidators([Validators.required]);
      customBloc?.clearValidators();
      dateBloc?.clearValidators();
      selectBoolean?.clearValidators();
      break;
    case 'date':
      valueId?.clearValidators();
      risqueValueId?.clearValidators();
      risqueItemsValues?.clearValidators();
      customBloc?.clearValidators();
      dateBloc?.setValidators([Validators.required]);
      selectBoolean?.clearValidators();
      break;
    case 'boolean':
      valueId?.clearValidators();
      risqueValueId?.clearValidators();
      risqueItemsValues?.clearValidators();
      customBloc?.clearValidators();
      dateBloc?.clearValidators();
      selectBoolean?.setValidators([Validators.required]);
      break;
    default:
      valueId?.clearValidators();
      risqueValueId?.clearValidators();
      risqueItemsValues?.clearValidators();
      customBloc?.clearValidators();
      dateBloc?.clearValidators();
      selectBoolean?.clearValidators();
  }

  if (fonction?.value === true) {
    fonctionType?.setValidators([Validators.required]);
  } else {
    fonctionType?.clearValidators();
    fonctionType?.setValue(null);
  }

  Object.values(form.controls).forEach(ctrl => ctrl.updateValueAndValidity());
});


  }
onContrainteChange(event: boolean): void {
  this.contrainte = event;
}

 loadFields() {
    this.areaService.getFields().subscribe((data) => {
      this.fields = data;
      this.filtredItems = [...data];
    });
  }

  getColumnValue(item: any, key: string): any {
    return item[key];
  }

  onSearch(_: any) {
    const filter = this.searchFormGroup.value;
    this.filtredItems = this.fields.filter((item:any) => {
      return Object.keys(filter).every((key) => {
        const val = filter[key];
        return !val || ('' + item[key]).toLowerCase().includes(val.toLowerCase());
      });
    });
  }

  sortBy(key: string) {
    this.sortDirection = this.sortValue === key ? !this.sortDirection : true;
    this.sortValue = key;
    this.filtredItems.sort((a:any, b:any) => {
      return this.sortDirection
        ? ('' + a[key]).localeCompare('' + b[key])
        : ('' + b[key]).localeCompare('' + a[key]);
    });
  }


  onCheckboxChange(event: Event): void {
  const inputElement = event.target as HTMLInputElement;
  this.fieldForm.get('selected')?.setValue(inputElement.checked);
}


  onTypeChange(type: string): void {
    console.log(type);

  this.selectedType = type;
  this.fieldForm.value.customBloc=""
}

 onListAreaSelected(event: any) {
  }


  onListValueSelected(event: ListValueDTO) {
      this.listeDeBlocsSelectionnee = !!event;
     const selectedId = event?.id || null;
  this.fieldForm.patchValue({ valueId: selectedId });
this.demandeService.getValueItemSearch(event).subscribe({
      next: (response:any) => {
        this.listValueItems= response;
        console.log('Champ ajoute avec succès :', response);

      },
      error: (err:any) => {
        console.error('Erreur lors de la création du champ :', err);
      }
    });

    this.donnees = [];
    this.selectedRisksMap = {};
  }

   listValue(): void {
      this.demandeService.getAllValues().subscribe({
      next: (response:any) => {
        this.listeValue= response;
        console.log('Champ risque avec succès :', response);

      },
      error: (err:any) => {
        console.error('Erreur lors de la création du champ :', err);
      }
    });

  }

    listAreas(): void {
      this.demandeService.getAllAreas().subscribe({
      next: (response:any) => {
        this.listeArea= response;
        console.log('Champ area avec succès :', response);

      },
      error: (err:any) => {
        console.error('Erreur lors de la création du champ :', err);
      }
    });

  }

     getRisques(): void {
      this.demandeService.getAllRisque().subscribe({
      next: (response:any) => {
        this.listRisque= response;
        console.log('Champ ajoute avec succès :', response);

      },
      error: (err:any) => {
        console.error('Erreur lors de la création du champ :', err);
      }
    });

  }

  @Output() deleteItem = new EventEmitter<any>();
  onAddNewObject() {
  }

  navigateTo(item: any) {
  }
onSubmit(): void {
  console.log(this.fieldForm);

   if (this.fieldForm.invalid) {
    Object.values(this.fieldForm.controls).forEach(control => {
      control.markAsTouched();
    });
    return;
  }



  if (this.fieldForm.valid) {
    const dto = this.fieldForm.value;
    console.log(dto);

    dto.risqueItemsValues = this.selectedRisks;
    this.demandeService.createConfig(dto).subscribe({
      next: (response:any) => {

        console.log('Configuration créée :', response);
        this.toasterService.success("Le champ est ceée avec succées")
      setTimeout(() => {
        window.location.reload();
      }, 2000);

      },
      error: (err:any) => {
        this.toasterService.danger("Le code déja exist ")
        console.error('Erreur :', err);
      }
    });
  }else {
    this.toasterService.warning("Il faut remplir tous les champs")
  }
}


 onRiskItemSelected(valueItem: any, selectedRisk: any): void {
    const existing = this.selectedRisks.findIndex(r => r.valueItemId === valueItem.id);
    const entry = { valueItemId: valueItem.id, riskId: selectedRisk.id };

    if (existing !== -1) {
      this.selectedRisks[existing] = entry;
    } else {
      this.selectedRisks.push(entry);
    }

    console.log('Sélections actuelles :', this.selectedRisks);
  }

  onRiskItemValue(selectedRisk: any):void{
    console.log(selectedRisk);



  }


  onRiskListSelected(event: any): void {
    console.log(event);
          this.listeDeBlocsSelectionnee = !!event;

         const selectedId = event?.id || null;
  this.fieldForm.patchValue({ risqueValueId: selectedId });

  this.demandeService.getAllRisqueSearch(event).subscribe({
      next: (response:any) => {
        this.riskValueItems= response;
        console.log('Champ rrrr avec succès :', response);

      },
      error: (err:any) => {
        console.error('Erreur lors de la création du champ :', err);
      }
    });
  }

  //  onRiskItemSelected(valueItem: ListValueItemDTO, riskItem: RisqueValueItemDTO): void {
  //   this.selectedRisksMap[valueItem.id] = riskItem;

  //   const existingIndex = this.donnees.findIndex(d => d.value === valueItem.libelle);
  //   if (existingIndex !== -1) {
  //     this.donnees[existingIndex].niveauRisque = riskItem.libelle;
  //   } else {
  //     this.donnees.push({
  //       value: valueItem.libelle,
  //       niveauRisque: riskItem.libelle
  //     });
  //   }
  // }
}


<nb-card accent="danger">
  <nb-card-header class="d-flex flex-row justify-content-between align-items-center">
    <h5 class="title-heading text-uppercase my-auto p-2">
      Ajouter un Champ
    </h5>
  </nb-card-header>

  <nb-card-body class="single-card-body">
    <form [formGroup]="fieldForm" (ngSubmit)="onSubmit()">
      <!-- Ligne 1 : Code & Libellé -->
      <div class="form-row">
        <!-- <div class="form-item" >
      <h6 class="field-label">
        <nb-icon icon="chevron-down-outline"></nb-icon> Liste de blocs
      </h6>
      <nb-form-field fullWidth>
        <nb-select fullWidth placeholder="Sélectionner une ou plusieurs blocs" (selectedChange)="onListAreaSelected($event)">
          <nb-option *ngFor="let val of listeArea" [value]="val">{{ val.libelle }}</nb-option>
        </nb-select>
      </nb-form-field>
    </div> -->
        <div class="form-item">
          <h6 class="field-label">
            <nb-icon icon="code-outline"></nb-icon> Code
          </h6>
          <nb-form-field fullWidth>
            <input nbInput fullWidth formControlName="code" placeholder="Code"
              [class.nb-theme-danger]="fieldForm.get('code')?.invalid && fieldForm.get('code')?.touched" />
          </nb-form-field>
          <div class="text-danger mt-1" *ngIf="fieldForm.get('code')?.invalid && fieldForm.get('code')?.touched">
            Ce champ est requis.
          </div>
        </div>

        <div class="form-item">
          <h6 class="field-label">
            <nb-icon icon="edit-outline"></nb-icon> Libellé
          </h6>
          <nb-form-field fullWidth>
            <input nbInput fullWidth formControlName="libelle" placeholder="Libellé"
              [class.nb-theme-danger]="fieldForm.get('libelle')?.invalid && fieldForm.get('libelle')?.touched" />
          </nb-form-field>
          <div class="text-danger mt-1" *ngIf="fieldForm.get('libelle')?.invalid && fieldForm.get('libelle')?.touched">
            Ce champ est requis.
          </div>
        </div>
      </div>

      <div class="form-row">
        <div class="form-item">
          <h6 class="field-label">
            <nb-icon icon="list-outline"></nb-icon> Type
          </h6>
          <nb-form-field fullWidth>
            <nb-select fullWidth formControlName="type" placeholder="Type" (selectedChange)="onTypeChange($event)"
              [class.nb-theme-danger]="fieldForm.get('type')?.invalid && fieldForm.get('type')?.touched">
              <nb-option *ngFor="let type of types" [value]="type.code">{{type.libelle}}</nb-option>

            </nb-select>
          </nb-form-field>
          <div class="text-danger mt-1" *ngIf="fieldForm.get('type')?.invalid && fieldForm.get('type')?.touched">
            Ce champ est requis.
          </div>
        </div>
        <div class="form-item-search">
          <h6 class="field-label-search">
            <nb-icon icon="checkmark-square-outline"></nb-icon>
          </h6>

          <nb-checkbox formControlName="selected">
            Activer le champ dans la matrice
          </nb-checkbox>

          <h6 class="field-label-search">
            <nb-icon icon="checkmark-square-outline"></nb-icon>
          </h6>

          <nb-checkbox formControlName="selected">
            Recherchable
          </nb-checkbox>



          <h6 class="field-label-search">
            <nb-icon icon="checkmark-square-outline"></nb-icon>
          </h6>
          <nb-checkbox formControlName="fonction">
    Activer la fonction
            </nb-checkbox>


          <h6 class="field-label-search">
            <nb-icon icon="checkmark-square-outline"></nb-icon>
          </h6>

          <nb-checkbox class="form-item" *ngIf="selectedType !== 'select'"
            [checked]="fieldForm.get('contrainte')?.value" (checkedChange)="onContrainteChange($event)">
            Avec contrainte
          </nb-checkbox>
          <h6 class="field-label-search">
            <nb-icon icon="checkmark-square-outline"></nb-icon>
          </h6>




        </div>



      </div>
      <div class="form-item" *ngIf="selectedType === 'text' || selectedType === 'number'">
        <h6 class="field-label">
          <nb-icon icon="chevron-down-outline"></nb-icon> Valeur
        </h6>
        <nb-form-field fullWidth>
          <input nbInput fullWidth placeholder="Valeur" formControlName="customBloc" />
        </nb-form-field>
        <div class="text-danger mt-1"
          *ngIf="fieldForm.get('customBloc')?.invalid && fieldForm.get('customBloc')?.touched">
          Ce champ est requis.
        </div>

      </div>

      <div class="form-row">
        <div class="form-item" *ngIf="selectedType === 'select'">
          <h6 class="field-label">
            <nb-icon icon="grid-outline"></nb-icon> Liste de valeurs
          </h6>
          <nb-form-field fullWidth>
            <nb-select fullWidth placeholder="Sélectionner une liste" (selectedChange)="onListValueSelected($event)"
              [class.nb-theme-danger]="fieldForm.get('valueId')?.invalid && fieldForm.get('valueId')?.touched"
              [disabled]="selectedType !== 'select'">
              <nb-option *ngFor="let val of listeValue" [value]="val">{{ val.libelle }}</nb-option>
            </nb-select>
          </nb-form-field>
          <div class="text-danger mt-1" *ngIf="fieldForm.get('valueId')?.invalid && fieldForm.get('valueId')?.touched">
            La sélection de type(s) est obligatoire.
          </div>
        </div>

        <div class="form-item" *ngIf="selectedType === 'select' || contrainte">
          <h6 class="field-label">
            <nb-icon icon="alert-triangle-outline"></nb-icon> Catégories de risque
          </h6>

          <nb-form-field fullWidth>
            <nb-select fullWidth placeholder="Sélectionner une catégorie" (selectedChange)=" onRiskListSelected($event)"
              [class.nb-theme-danger]="fieldForm.get('risqueValueId')?.invalid && fieldForm.get('risqueValueId')?.touched">
              <nb-option *ngFor="let risk of listRisque" [value]="risk">{{ risk.libelle }}</nb-option>
            </nb-select>
          </nb-form-field>
          <div class="text-danger mt-1"
            *ngIf="fieldForm.get('risqueValueId')?.invalid && fieldForm.get('risqueValueId')?.touched">
            La sélection de type(s) est obligatoire.
          </div>
        </div>
        <div class="form-item" *ngIf="fieldForm.get('fonction')?.value">
          <h6 class="field-label">
            <nb-icon icon="options-outline"></nb-icon>
            Type de calcule
          </h6>
          <nb-form-field fullWidth>
            <nb-select fullWidth formControlName="fonctionType" placeholder="Sélectionner un type de fonction"
              [class.nb-theme-danger]="fieldForm.get('fonctionType')?.invalid && fieldForm.get('fonctionType')?.touched">
              <nb-option *ngFor="let ft of fonctionTypes" [value]="ft.code">
                {{ ft.libelle }}
              </nb-option>
            </nb-select>
          </nb-form-field>
          <div class="text-danger mt-1"
            *ngIf="fieldForm.get('fonctionType')?.invalid && fieldForm.get('fonctionType')?.touched">
            Ce champ est requis.
          </div>
        </div>
      </div>

      <nb-card class="mt-4" *ngIf="listeDeBlocsSelectionnee && selectedType === 'select'">
        <nb-card-header class="d-flex justify-content-center align-items-center">
          <nb-icon icon="list-outline" class="me-2"></nb-icon>
          &nbsp; Tableau des valeurs et risques
        </nb-card-header>

        <nb-card-body>
          <div class="header-row d-flex font-weight-bold mb-2" style="gap: 1rem;">
            <div style="flex: 1;">Valeur</div>
            <div style="flex: 1;">Niveau de Risque</div>
          </div>

          <nb-list *ngIf="listValueItems.length > 0">
            <nb-list-item *ngFor="let item of listValueItems" class="d-flex align-items-center" style="gap: 1rem;">
              <div style="flex: 1;">{{ item.libelle }}</div>
              <div style="flex: 1;">
                <nb-form-field fullWidth>
                  <nb-icon nbPrefix icon="alert-triangle-outline"></nb-icon>
                  <nb-select fullWidth formControlName="risqueItemsValues" placeholder="Sélectionner un risque"
                    [class.nb-theme-danger]="fieldForm.get('risqueItemsValues')?.invalid && fieldForm.get('risqueItemsValues')?.touched"
                    (selectedChange)="onRiskItemSelected(item, $event)">
                    <nb-option *ngFor="let risk of riskValueItems" [value]="risk">{{ risk.libelle }}</nb-option>
                  </nb-select>
                </nb-form-field>
                <div class="text-danger mt-1"
                  *ngIf="fieldForm.get('risqueItemsValues')?.invalid && fieldForm.get('risqueItemsValues')?.touched">
                  La sélection de type(s) est obligatoire.
                </div>
              </div>
            </nb-list-item>
          </nb-list>


          <div
            *ngIf="listValueItems.length === 0 && (this.fieldForm.value.customBloc !='' || this.fieldForm.value.dateBloc !=null || this.fieldForm.value.selectBoolean !=null)"
            class="text-center text-muted mt-3">
            Aucune donnée à afficher pour le moment.
          </div>
        </nb-card-body>
      </nb-card>
      <div class="d-flex justify-content-end mt-4">
        <button nbButton class="nb-btn-brown" type="submit">Valider</button>
      </div>
    </form>

  </nb-card-body>
</nb-card>

<!-- <nb-card class="mt-4" *ngIf="fieldTotal.length > 0">
  <nb-card-header>
    <nb-icon icon="grid-outline"></nb-icon>
    &nbsp; Liste des configurations
  </nb-card-header>
  <nb-card-body>
    <table class="nb-table full-width">
      <thead>
        <tr>
          <th>Code</th>
          <th>Libellé</th>
          <th>Type</th>
          <th>Contrainte</th>
          <th>Valeur</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let config of fieldTotal">
          <td>{{ config.code }}</td>
          <td>{{ config.libelle }}</td>
          <td>{{ config.type }}</td>
          <td>{{ config.contrainte ? 'Oui' : 'Non' }}</td>
          <td>{{ config.valeur || '—' }}</td>
        </tr>
      </tbody>
    </table>
  </nb-card-body>
</nb-card> -->

<table class="table w-100 table-striped" [ngClass]="{ 'table-striped': dashboard }"
  aria-label="Tableau des données avec options de tri et de recherche">
  <thead [ngClass]="{ 'table table-striped table-bordered': dashboard, 'bg-header fw-bold': !dashboard }">
    <tr>
      <ng-container *ngFor="let column of columns">
        <th *ngIf="!column.hidden" scope="col" (click)="sortBy(column.key)" class="p-3 border border-end-white"
          [ngClass]="{ 'bg-danger text-light': dashboard }" style="max-width: 150px">
          <div class="d-flex justify-content-between">
            <div>{{ column.label }}</div>
            <div [ngClass]="(sortValue == column.key) ? 'text-black' : 'd-none'">
              <span *ngIf="sortDirection">
                <nb-icon icon="arrow-up-line"></nb-icon>
              </span>
              <span *ngIf="!sortDirection">
                <nb-icon icon="arrow-down-line"></nb-icon>
              </span>
            </div>
          </div>
        </th>
      </ng-container>

      <th *ngIf="canEdit && !dashboard" scope="col" colspan="2" class="p-3 border border-end-white">Actions</th>
    </tr>
  </thead>

  <tbody>
    <!-- Ligne de recherche -->
    <tr>
      <ng-container *ngFor="let column of columns">
        <td *ngIf="!column.hidden">
          <form [formGroup]="searchFormGroup">
            <input *ngIf="!column.options" formControlName="{{ column.key }}" class="form-control"
              placeholder="{{ column.label }}" (input)="onSearch(null)" fullWidth />
            <nb-select *ngIf="column.options" formControlName="{{ column.key }}" placeholder="{{ column.label }}"
              (selectedChange)="onSearch(null)" fullWidth>
              <nb-option *ngFor="let option of column.options" [value]="option.value">
                {{ option.label }}
              </nb-option>
            </nb-select>
          </form>
        </td>
      </ng-container>
    </tr>

    <tr *ngFor="let item of filtredItems">
      <ng-container *ngFor="let column of columns">
        <td *ngIf="!column.hidden" class="px-4 truncate" (click)="navigateTo(item)"
          [ngClass]="{ 'truncate': dashboard }">
          {{ getColumnValue(item, column.key) }}
        </td>
      </ng-container>
      <td class="editIcon text-center" *ngIf="canEdit && !dashboard">
        <nb-icon class="btn-details edit-icon" style="color: darkorange" icon="edit-line"></nb-icon>
        <nb-icon class="btn-details delete-icon" icon="spam-3-line" style="color: red"
          (click)="deleteItem.emit(item)"></nb-icon>
      </td>
    </tr>
  </tbody>
</table>


/////////////////////////////////////////////notation
<nb-card accent="danger">
  <nb-card-header class="d-flex flex-row justify-content-between align-items-center">
    <h5 class="title-heading text-uppercase my-auto p-2">Notation</h5>
  </nb-card-header>

  <form [formGroup]="fieldForm" (ngSubmit)="submit()">
    <nb-card-body>
      <nb-form-field fullWidth>
        <nb-select
          fullWidth
          formControlName="segment"
          placeholder="Sélectionner un segment"
          [class.invalid]="fieldForm.get('segment')?.invalid && fieldForm.get('segment')?.touched"
          (selectedChange)="onSegmentChange($event)">
          <nb-option *ngFor="let type of referentiels$" [value]="type.id">
            {{ type.libelle }}
          </nb-option>
        </nb-select>
      </nb-form-field>
      <small class="error" *ngIf="fieldForm.get('segment')?.invalid && fieldForm.get('segment')?.touched">
        Ce champ est requis.
      </small>
    </nb-card-body>

    <ng-container *ngIf="segement?.areas?.length">
      <div formGroupName="fields">
        <ng-container *ngFor="let area of segement.areas">
          <nb-card class="area-card">
            <nb-card-header accent="danger" class="areatit">
              <nb-icon icon="map-outline" pack="eva"></nb-icon>
              <strong>{{ area.libelle }}</strong>
            </nb-card-header>

            <nb-card-body>
              <div *ngFor="let config of area.fieldConfigurations" class="field-row">
                <div class="field-label">
                  <strong>{{ config.libelle }}</strong>
                </div>

                <ng-container [ngSwitch]="config.type">
                  <!-- TEXT -->
                  <nb-form-field fullWidth *ngSwitchCase="'text'">
                    <input nbInput fullWidth [formControlName]="config.id.toString()" placeholder="Saisir texte" />
                  </nb-form-field>

                  <!-- DATE -->
                  <nb-form-field fullWidth *ngSwitchCase="'date'">
                    <input nbInput fullWidth [formControlName]="config.id.toString()" placeholder="Sélectionner une date"  datePickers />
                  </nb-form-field>

                  <!-- SELECT -->
                  <nb-form-field fullWidth *ngSwitchCase="'select'">
                    <nb-select fullWidth [formControlName]="config.id.toString()" placeholder="Sélectionner…" multiple>
                      <nb-option *ngFor="let opt of config.risqueValueList" [value]="opt.risqueValueItem.id">
                        {{ opt.listValueItem.libelle }}
                      </nb-option>
                    </nb-select>
                  </nb-form-field>

                  <!-- BOOLEAN -->
                  <nb-form-field fullWidth *ngSwitchCase="'boolean'">
                    <nb-select fullWidth [formControlName]="config.id.toString()">
                      <nb-option [value]="true">Oui</nb-option>
                      <nb-option [value]="false">Non</nb-option>
                    </nb-select>
                  </nb-form-field>
                </ng-container>

                <!-- Erreur de validation -->
                <small class="error" *ngIf="fieldForm.get('fields')?.get(config.id.toString())?.invalid &&
                                             fieldForm.get('fields')?.get(config.id.toString())?.touched">
                  Ce champ est requis.
                </small>
              </div>
            </nb-card-body>
          </nb-card>
        </ng-container>
      </div>
    </ng-container>

    <nb-card class="actions-cards">
      <nb-card-body class="actions">
        <button nbButton status="primary" type="submit">
          <nb-icon icon="checkmark-outline"></nb-icon>
          Valider
        </button>
      </nb-card-body>
    </nb-card>
  </form>
</nb-card>


import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { GestionReferentielsService } from '../../gestion-referentiel/services/gestion-referentiels.service';
import { Referentiel } from 'src/app/core/models/Referentiel';
import { ReferentielTypes } from '../../traitement-demande/model/fieldConfig';
import { NotationService } from '../notation.service';
import { SegmentDtoVues } from '../model/segementDtoVue';
import {  NbGlobalPhysicalPosition } from '@nebular/theme';
import { formatDate } from '@angular/common';
import { NbDatepickerModule, NbInputModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
@Component({
  standalone: false,
  selector: 'app-add-notation',
  templateUrl: './add-notation.component.html',
  styleUrl: './add-notation.component.scss'
})
export class AddNotationComponent implements OnInit {
  fieldForm!: FormGroup;
    selectedRef: string = "segments";
    referentiels$ !: Referentiel[];
    referentielTypes: ReferentielTypes[] = [];
    segement: SegmentDtoVues = {} as SegmentDtoVues;
datePickers: { [key: number]: any } = {};

  constructor(private fb: FormBuilder,private toasterService:NbToastrService,private serviceRef: GestionReferentielsService,private notationService:NotationService) {

      this.referentielTypes  = [
      {value:'segments', label:'Segment', hasExpression:false},
      {value:'areas', label:'Area', hasExpression:false},
      {value:'listValues', label:'List Value ', hasExpression:true},
      {value:'listValueItems', label:'List Value Item', hasExpression:false},
      {value:'risqueValueLists', label:'Risque Value', hasExpression:false},
      {value:'risqueValueItems', label:'Risque Value Item', hasExpression:false},
    ];

this.fieldForm = this.fb.group({
  segment: ['', Validators.required],
  fields: this.fb.group({}) 
});

  }
    ngOnInit(): void {
      this.serviceRef.getReferentiel(this.selectedRef).subscribe(data => {
        this.referentiels$ = data
      })


    }

onSegmentChange(segmentId: number) {
  this.fieldForm.patchValue({ segment: segmentId });

  this.notationService.getSegmentById(segmentId).subscribe({
    next: (response) => {
      const newSegment = response;
      console.log('Nouveau segment reçu :', newSegment);

      this.segement = newSegment;

      // Vérifie que le sous-groupe 'fields' existe, sinon crée-le
      let fieldsGroup = this.fieldForm.get('fields') as FormGroup;
      if (!fieldsGroup) {
        fieldsGroup = this.fb.group({});
        this.fieldForm.setControl('fields', fieldsGroup);
      }

      for (const area of newSegment.areas) {
        for (const config of area.fieldConfigurations) {
          const key = config.id.toString();

          if (!fieldsGroup.contains(key)) {
            let defaultValue: any;
            let validators = [Validators.required];

            switch (config.type) {
              case 'select':
                defaultValue = [];
                break;
              case 'boolean':
              case 'number':
              case 'date':
                defaultValue = null;
                break;
              case 'text':
              default:
                defaultValue = '';
            }

            fieldsGroup.addControl(key, new FormControl(defaultValue, validators));
          }
        }
      }
    },
    error: (err: any) => {
      console.error('Erreur lors de la récupération du segment :', err);
    }
  });
}






  submit(): void {
    if (this.fieldForm.invalid) {
      this.fieldForm.markAllAsTouched();
      this.toasterService.danger('Formulaire invalide', 'Erreur');
      return;
    }

    const segmentId = this.fieldForm.value.segment as number;
    const fieldsGroup = this.fieldForm.get('fields') as FormGroup;
    const allValues = fieldsGroup.getRawValue();

    const fieldValues: any[] = [];

    if (this.segement?.areas?.length) {
      for (const area of this.segement.areas) {
        for (const config of area.fieldConfigurations) {
          const key = config.id.toString();
          const value = allValues[key];

          const fv: any = {
            fieldConfigId: config.id,
            areaId: area.id,
          };

          switch (config.type) {
            case 'text':
              if (value !== null && value !== '') fv.valueString = value;
              break;

            case 'number':
              if (value !== null && value !== '') fv.valueLong = Number(value);
              break;

            case 'date':
              if (value) {
                fv.valueDate = formatDate(value, 'yyyy-MM-dd', 'en');
              }
              break;

            case 'boolean':
              if (value !== null && value !== undefined) fv.valueBoolean = value === true;
              break;

            case 'select':
              fv.selectedRisqueValueItemIds = Array.isArray(value) ? value : (value ? [value] : []);
              break;

            default:
              if (value !== null && value !== '') fv.valueString = value;
          }

          fieldValues.push(fv);
        }
      }
    } else {
      console.warn('Aucune configuration de champ trouvée dans le segment');
    }

    const payload = {
      segmentId,
      fieldValues
    };

    this.notationService.saveNotation(payload).subscribe({
      next: () => {
        this.toasterService.success('Notation ajoutée avec succès ✅', 'Succès', {
          status: 'success',
          duration: 3000,
          destroyByClick: true,
          position: NbGlobalPhysicalPosition.TOP_RIGHT,
          preventDuplicates: true
        });
        // reset
        this.fieldForm.reset();
        this.fieldForm.setControl('fields', this.fb.group({}));
        this.segement = {} as SegmentDtoVues;
      },
      error: (err) => {
        this.toasterService.danger('Erreur lors de l’ajout de la notation', 'Erreur');
        console.error(err);
      }
    });
  }
}

/////////////////////////tt///////////////////////////////////////////////////////
public class FieldValueDTO {
    private Long fieldConfigId;
    private Long areaId;

    private String valueString;
    private Boolean valueBoolean;
    private Long valueLong;
    private String valueDate; // format ISO yyyy-MM-dd

    // Pour les selects
    private List<Long> selectedValueItemIds;
    private List<Long> selectedRisqueValueItemIds;

public class NotationDTO {
    private Long id;
    private Long segmentId;
    private String level;
    private Double riskScore;
    private LocalDateTime createdAt;
////////////////////////////
public class NotationSaveDTO {
    private Long segmentId;
    private String level;
    private List<FieldValueDTO> fieldValues;
/.//////////////////////////@Entity
public class FieldValue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Notation notation;

    @ManyToOne(optional = false)
    private FieldConfiguration fieldConfiguration;

    @ManyToOne
    private Area area;

    @Column
    private String valueString;

    @Column
    private Boolean valueBoolean;

    @Column
    private Long valueLong;

    @Column
    private LocalDate valueDate;

    @Column
    private String selectedValueItemIdsCsv;

    @Column
    private String selectedRisqueValueItemIdsCsv;

///////////////////////////////////////////////




@Entity
public class Notation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Segment segment;

    @OneToMany(mappedBy = "notation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FieldValue> fieldValues = new ArrayList<>();

    @Column(length = 4, nullable = false)
    private String level;

    private Double riskScore = 0.0;

    private LocalDateTime createdAt = LocalDateTime.now();

/////////////////////////////////////////////
package com.sahambank.fccr.core.service.Impl;


import com.sahambank.fccr.core.dto.FieldValueDTO;
import com.sahambank.fccr.core.dto.NotationDTO;
import com.sahambank.fccr.core.dto.NotationSaveDTO;
import com.sahambank.fccr.core.entities.*;
import com.sahambank.fccr.core.repository.*;
import com.sahambank.fccr.core.service.NotationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class NotationServiceImpl implements NotationService {

    private final NotationRepository notationRepository;
    private final SegmentRepository segmentRepository;
    private final FieldConfigurationRepository fieldConfigRepository;
    private final AreaRepository areaRepository;
    private final ListValueItemRepository listValueItemRepository;
    private final RisqueValueItemRepository risqueValueItemRepository;

    public NotationServiceImpl(NotationRepository notationRepository,
                               SegmentRepository segmentRepository,
                               FieldConfigurationRepository fieldConfigRepository,
                               AreaRepository areaRepository,
                               ListValueItemRepository listValueItemRepository,
                               RisqueValueItemRepository risqueValueItemRepository) {
        this.notationRepository = notationRepository;
        this.segmentRepository = segmentRepository;
        this.fieldConfigRepository = fieldConfigRepository;
        this.areaRepository = areaRepository;
        this.listValueItemRepository = listValueItemRepository;
        this.risqueValueItemRepository = risqueValueItemRepository;
    }

    {}

    @Override
    public NotationDTO saveNotation(NotationSaveDTO dto) {
        Segment segment = segmentRepository.findById(dto.getSegmentId())
                .orElseThrow(() -> new IllegalArgumentException("Segment introuvable: " + dto.getSegmentId()));

        String level = normalizeLevel(dto.getLevel());

        Notation notation = new Notation();
        notation.setSegment(segment);
        notation.setLevel(level);
        notation.setCreatedAt(LocalDateTime.now());

        double totalScore = 0.0;
        List<FieldValue> fieldValues = new ArrayList<>();

        for (FieldValueDTO fvDto : dto.getFieldValues()) {
            FieldConfiguration config = fieldConfigRepository.findById(fvDto.getFieldConfigId())
                    .orElseThrow(() -> new IllegalArgumentException("FieldConfiguration introuvable: " + fvDto.getFieldConfigId()));

            FieldValue fv = new FieldValue();
            fv.setNotation(notation);
            fv.setFieldConfiguration(config);

            Area area = null;
            if (fvDto.getAreaId() != null) {
                area = areaRepository.findById(fvDto.getAreaId())
                        .orElseThrow(() -> new IllegalArgumentException("Area introuvable: " + fvDto.getAreaId()));
                fv.setArea(area);
            }

            // 1) Mapper la valeur typée
            applyTypedValue(fv, config, fvDto);

            // 2) Mapper les listes de sélection (si select)
            if (fvDto.getSelectedValueItemIds() != null && !fvDto.getSelectedValueItemIds().isEmpty()) {
                fv.setSelectedValueItemIdsCsv(joinCsv(fvDto.getSelectedValueItemIds()));
            }
            if (fvDto.getSelectedRisqueValueItemIds() != null && !fvDto.getSelectedRisqueValueItemIds().isEmpty()) {
                fv.setSelectedRisqueValueItemIdsCsv(joinCsv(fvDto.getSelectedRisqueValueItemIds()));
            }

            fieldValues.add(fv);

            // 3) Calcul du score si ce champ est fonctionnel
            if (Boolean.TRUE.equals(config.isFonction())) {
                double fieldScore = computeFieldScore(config, area, fvDto, level);
                totalScore += fieldScore;
            }
        }

        notation.setFieldValues(fieldValues);

        // IMPORTANT: Assure-toi que riskScore est de type double/Double dans Notation.
        // Option A (recommandée): setter double
        notation.setRiskScore(totalScore);

        // Option B (si riskScore est un int et DOIT le rester), choisis une conversion explicite:
        // notation.setRiskScore((int) Math.round(totalScore)); // arrondi
        // notation.setRiskScore((int) totalScore);             // troncature

        Notation saved = notationRepository.save(notation);

        NotationDTO out = new NotationDTO();
        out.setId(saved.getId());
        out.setSegmentId(saved.getSegment().getId());
        out.setLevel(saved.getLevel());
        out.setRiskScore(saved.getRiskScore());
        out.setCreatedAt(saved.getCreatedAt());
        return out;
    }

    private String normalizeLevel(String level) {
        if (level == null) return "ML";
        level = level.trim().toUpperCase();
        return switch (level) {
            case "L", "ML", "MH" -> level;
            default -> "ML";
        };
    }

    private void applyTypedValue(FieldValue fv, FieldConfiguration config, FieldValueDTO dto) {
        String type = config.getType() != null ? config.getType().toLowerCase() : "";

        switch (type) {
            case "boolean" -> fv.setValueBoolean(Boolean.TRUE.equals(dto.getValueBoolean()));
            case "number" -> {
                if (dto.getValueLong() != null) {
                    fv.setValueLong(dto.getValueLong());
                }
            }
            case "date" -> {
                if (dto.getValueDate() != null && !dto.getValueDate().isBlank()) {
                    fv.setValueDate(LocalDate.parse(dto.getValueDate()));
                }
            }
            case "text" -> fv.setValueString(dto.getValueString());
            case "select" -> fv.setValueString(dto.getValueString());
            default -> {
                if (dto.getValueString() != null) fv.setValueString(dto.getValueString());
                if (dto.getValueBoolean() != null) fv.setValueBoolean(dto.getValueBoolean());
                if (dto.getValueLong() != null) fv.setValueLong(dto.getValueLong());
                if (dto.getValueDate() != null && !dto.getValueDate().isBlank()) {
                    fv.setValueDate(LocalDate.parse(dto.getValueDate()));
                }
            }
        }
    }

    private double computeFieldScore(FieldConfiguration config, Area area, FieldValueDTO fvDto, String level) {
        Set<RisqueValueItem> selectedRisks = new HashSet<>();

        if (fvDto.getSelectedRisqueValueItemIds() != null && !fvDto.getSelectedRisqueValueItemIds().isEmpty()) {
            selectedRisks.addAll(
                    risqueValueItemRepository.findAllById(fvDto.getSelectedRisqueValueItemIds())
            );
        }

        if (fvDto.getSelectedValueItemIds() != null && !fvDto.getSelectedValueItemIds().isEmpty()) {
            List<ListValueItem> listItems =
                    listValueItemRepository.findAllById(fvDto.getSelectedValueItemIds());

            for (ListValueItem li : listItems) {
                if (li.getAssociations() != null) {
                    li.getAssociations().forEach(assoc -> {
                        if (assoc.getRisqueValueItem() != null) {
                            selectedRisks.add(assoc.getRisqueValueItem());
                        }
                    });
                }
            }
        }

        if (selectedRisks.isEmpty()) return 0.0;

        Long areaId = (area != null) ? area.getId() : null;
        double sum = 0.0;
        String lvl = (level != null) ? level.toUpperCase() : "";

        for (RisqueValueItem riskItem : selectedRisks) {
            if (riskItem.getWeights() == null) continue;

            Optional<RisqueItemWeight> weightOpt = riskItem.getWeights().stream()
                    .filter(w -> w.getFieldConfiguration() != null &&
                            Objects.equals(w.getFieldConfiguration().getId(), config.getId()) &&
                            (areaId == null || (w.getArea() != null &&
                                    Objects.equals(w.getArea().getId(), areaId))))
                    .findFirst();

            if (weightOpt.isEmpty()) continue;

            RisqueItemWeight w = weightOpt.get();

            switch (lvl) {
                case "L"  -> sum += safe(w.getWeightL());  // int -> double
                case "MH" -> sum += safe(w.getWeightMh());
                default   -> sum += safe(w.getWeightMl());  // ML par défaut
            }
        }

        return sum;
    }

    // Conversion sûre: int -> double
    private static double safe(int value) {
        return (double) value;
    }

    private static String joinCsv(List<Long> ids) {
        return ids.stream().map(String::valueOf).collect(Collectors.joining(","));
    }
}
//////////////////////////////////
-- ********************************* Table notation **********************************************
CREATE TABLE IF NOT EXISTS notation (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    segment_id BIGINT NOT NULL,
    level VARCHAR(4),
    risk_score DOUBLE PRECISION DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notation_segment FOREIGN KEY (segment_id) REFERENCES segment(id)
);

-- ********************************* Table field_value **********************************************
CREATE TABLE IF NOT EXISTS field_value (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    notation_id BIGINT NOT NULL,
    field_configuration_id BIGINT NOT NULL,
    area_id BIGINT,
    value_string VARCHAR(255),
    value_long BIGINT,
    value_boolean BOOLEAN,
    value_date DATE,
    selected_value_item_ids_csv TEXT,
    selected_risque_value_item_ids_csv TEXT,
    CONSTRAINT fk_field_value_notation FOREIGN KEY (notation_id) REFERENCES notation(id) ON DELETE CASCADE,
    CONSTRAINT fk_field_value_field_configuration FOREIGN KEY (field_configuration_id) REFERENCES field_configuration(id),
    CONSTRAINT fk_field_value_area FOREIGN KEY (area_id) REFERENCES area(id)
);
/////////////////////////////////
package com.sahambank.fccr.core.mapper;

import com.sahambank.fccr.core.entities.*;
import com.sahambank.fccr.core.dto.FieldConfig.FieldConfigurationDTO;
import com.sahambank.fccr.core.dto.FieldConfigurationCreateDTO;
import com.sahambank.fccr.core.dto.ValueItemRisqueItemDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class FieldConfigurationMapper implements EntityMapper<FieldConfigurationDTO, FieldConfiguration> {
    @Autowired private ListValueMapper listValueMapper;
    @Autowired private RisqueValueListMapper risqueValueListMapper;



    @Override
    public FieldConfigurationDTO toDto(FieldConfiguration entity) {
        if (entity == null) return null;

        FieldConfigurationDTO dto = new FieldConfigurationDTO();
        dto.setId(entity.getId());
        dto.setCode(entity.getCode());
        dto.setLibelle(entity.getLibelle());
        dto.setType(entity.getType());
        dto.setSelected(entity.isSelected());
        String type = entity.getType();
        dto.setFonction(entity.isFonction());
        dto.setFonctionType(entity.getFonctionType());

        if ("text".equalsIgnoreCase(type)) {
            dto.setCustomBloc(entity.getCustomBloc());
        } else if ("date".equalsIgnoreCase(type)) {
            dto.setDateBloc(entity.getDateBloc());
        } else if ("boolean".equalsIgnoreCase(type)) {
            dto.setSelectBoolean(entity.isSelectBoolean());
        } else if ("select".equalsIgnoreCase(type)) {
        if (entity.getValueItemRisqueItem() != null && !entity.getValueItemRisqueItem().isEmpty()) {
            List<ValueItemRisqueItemDto> valueItemRisqueItemDtos = new ArrayList<>();
            for (ValueItemRisqueItem item : entity.getValueItemRisqueItem()) {
                ValueItemRisqueItemDto dtoItem = new ValueItemRisqueItemDto();
                dtoItem.setId(item.getId());
                dtoItem.setValueItemId(item.getListValueItem().getId());
                dtoItem.setRisqueValueItemId(item.getRisqueValueItem().getId());
                valueItemRisqueItemDtos.add(dtoItem);
            }
            dto.setValueItemRisqueItemDto(valueItemRisqueItemDtos);
        }


        if (entity.getValueList() != null) {
            dto.setValueId(entity.getValueList().getId());
        }
    }
        if (entity.getAreas() != null && !entity.getAreas().isEmpty()) {
            Set<Long> areaIds = entity.getAreas().stream()
                    .map(Area::getId)
                    .collect(Collectors.toSet());
            dto.setAreasId(areaIds);
        }

        if (entity.getRisqueValueList() != null) {
            dto.setRisqueValueId(entity.getRisqueValueList().getId());
        }

        return dto;
    }



    @Override
    public FieldConfiguration toEntity(FieldConfigurationDTO dto) {
        if (dto == null) return null;

        FieldConfiguration entity = new FieldConfiguration();
        entity.setId(dto.getId());
        entity.setCode(dto.getCode());
        entity.setLibelle(dto.getLibelle());
        entity.setType(dto.getType());
        entity.setSelected(dto.isSelected());
        entity.setFonctionType(dto.getFonctionType());
        entity.setFonction(dto.isFonction());

        if (dto.getValueId() != null) {
            ListValue valueStub = new ListValue();
            valueStub.setId(dto.getValueId());
            entity.setValueList(valueStub);
        }

        if (dto.getRisqueValueId() != null) {
            RisqueValueList risqueStub = new RisqueValueList();
            risqueStub.setId(dto.getRisqueValueId());
            entity.setRisqueValueList(risqueStub);
        }

        if (dto.getAreasId() != null && !dto.getAreasId().isEmpty()) {
            Set<com.sahambank.fccr.core.entities.Area> areaStubs = dto.getAreasId().stream().map(id -> {
                Area area = new Area();
                area.setId(id);
                return area;
            }).collect(Collectors.toSet());
            entity.setAreas(areaStubs);
        }
        return entity;
    }

    public FieldConfiguration toEntityCreate(FieldConfigurationCreateDTO dto) {
        if (dto == null) return null;

        FieldConfiguration entity = new FieldConfiguration();
        entity.setId(dto.getId());
        entity.setCode(dto.getCode());
        entity.setLibelle(dto.getLibelle());
        entity.setType(dto.getType());
        entity.setSelected(dto.isSelected());
        entity.setSearchable(dto.isSearchable());
        entity.setFonctionType(dto.getFonctionType());
        entity.setFonction(dto.isFonction());

        if (dto.getValueId() != null) {
            ListValue valueStub = new ListValue();
            valueStub.setId(dto.getValueId());
            entity.setValueList(valueStub);
        }

        if (dto.getRisqueValueId() != null) {
            RisqueValueList risqueStub = new RisqueValueList();
            risqueStub.setId(dto.getRisqueValueId());
            entity.setRisqueValueList(risqueStub);
        }

        String type = dto.getType();
        if ("text".equalsIgnoreCase(type)) {
            entity.setCustomBloc(dto.getCustomBloc());
        } else if ("date".equalsIgnoreCase(type)) {
            entity.setDateBloc(dto.getDateBloc());
        } else if ("boolean".equalsIgnoreCase(type)) {
            entity.setSelectBoolean(dto.isSelectBoolean());
        }

        return entity;
    }

    /*
     public FieldConfigurationDTO toDto(FieldConfiguration entity) {
        if (entity == null) return null;

        FieldConfigurationDTO dto = new FieldConfigurationDTO();
        dto.setId(entity.getId());
        dto.setCode(entity.getCode());
        dto.setLibelle(entity.getLibelle());
        dto.setType(entity.getType());

        // Conversion des Area en ID
        if (entity.getAreas() != null && !entity.getAreas().isEmpty()) {
            Set<Long> areaIds = entity.getAreas().stream()
                    .map(Area::getId)
                    .collect(Collectors.toSet());
            dto.setAreasId(areaIds);
        }

        if (entity.getValueList() != null) {
            dto.setValueId(entity.getValueList().getId());
        }

        if (entity.getRisqueValueList() != null) {
            dto.setRisqueValueId(entity.getRisqueValueList().getId());
        }

        return dto;
    }

    @Override
    public FieldConfiguration toEntity(FieldConfigurationDTO dto) {
        if (dto == null) return null;

        FieldConfiguration entity = new FieldConfiguration();
        entity.setId(dto.getId());
        entity.setCode(dto.getCode());
        entity.setLibelle(dto.getLibelle());
        entity.setType(dto.getType());

        if (dto.getValueId() != null) {
            ListValue valueStub = new ListValue();
            valueStub.setId(dto.getValueId());
            entity.setValueList(valueStub);
        }

        if (dto.getRisqueValueId() != null) {
            RisqueValueList risqueStub = new RisqueValueList();
            risqueStub.setId(dto.getRisqueValueId());
            entity.setRisqueValueList(risqueStub);
        }

        // Conversion des areasId en objets Area (stub)
        if (dto.getAreasId() != null && !dto.getAreasId().isEmpty()) {
            Set<Area> areaStubs = dto.getAreasId().stream().map(id -> {
                Area area = new Area();
                area.setId(id);
                return area;
            }).collect(Collectors.toSet());
            entity.setAreas(areaStubs);
        }

        return entity;
    }
    */
}

