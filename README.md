import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { GestionReferentielsService } from '../../gestion-referentiel/services/gestion-referentiels.service';
import { Referentiel } from 'src/app/core/models/Referentiel';
import { ReferentielTypes } from '../../traitement-demande/model/fieldConfig';
import { NotationService } from '../notation.service';
import { SegmentDtoVues } from '../model/segementDtoVue';
import {  NbGlobalPhysicalPosition } from '@nebular/theme';
import { FieldConfigVueDto } from '../model/fieldConfiguration';
import { ListValueItemVueDto } from '../model/listeValueItemDto';

@Component({
  standalone: false,
  selector: 'app-add-notation',
  templateUrl: './add-notation.component.html',
  styleUrl: './add-notation.component.scss'
})

export class AddNotationComponent implements OnInit {
  fieldForm: FormGroup;
  referentiels$: Referentiel[] = [];
  segment?: SegmentDtoVues;
  selectedRef = 'segments';

  constructor(
    private fb: FormBuilder,
    private serviceRef: GestionReferentielsService,
    private notationService: NotationService,
    private toasterService: NbToastrService
  ) {
    this.fieldForm = this.fb.group({
      segment: [null, Validators.required],
      areas: this.fb.array([]),
      identifiantTiers: ['', Validators.required],
      derniereNote: ['', Validators.required],
      methodologie: ['', Validators.required],
      utilisateur: ['', Validators.required],
      statut: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.serviceRef
      .getReferentiel(this.selectedRef)
      .subscribe((data: Referentiel[]) => {
        this.referentiels$ = data;
      });
  }

  get areas(): FormArray {
    return this.fieldForm.get('areas') as FormArray;
  }

  onSegmentChange(segmentId: number): void {
    this.notationService.getSegmentById(segmentId).subscribe({
      next: (seg) => {
        this.segment = seg;
        this.buildAreasControls();
      },
      error: () => {
        this.toasterService.danger('Erreur chargement segment');
      },
    });
  }

  private buildAreasControls(): void {
    this.areas.clear();
    this.segment?.areas.forEach((area) => {
      const groupConfig = area.fieldConfigurations.reduce(
        (acc, _cfg, idx) => ({
          ...acc,
          ['value' + idx]: [null, Validators.required],
        }),
        {}
      );
      this.areas.push(this.fb.group(groupConfig));
    });
  }

  submit(): void {
    if (this.fieldForm.invalid) {
      this.fieldForm.markAllAsTouched();
      this.toasterService.warning(
        'Veuillez remplir tous les champs.',
        'Formulaire incomplet'
      );
      return;
    }

    console.log('Payload soumis:', this.fieldForm.value);
    this.toasterService.success('Notation ajoutée ✅', 'Succès', {
      position: NbGlobalPhysicalPosition.TOP_RIGHT,
      duration: 3000,
    });

    this.fieldForm.reset();
    this.areas.clear();
    this.segment = undefined;
  }}
<nb-card accent="danger">
  <nb-card-header>Notation</nb-card-header>

  <form [formGroup]="fieldForm" (ngSubmit)="submit()">
    <nb-card-body>

      <!-- 1. Choix du segment -->
      <nb-form-field fullWidth>
        <nb-select
          formControlName="segment"
          placeholder="Sélectionner un segment"
          (selectedChange)="onSegmentChange($event)"
        >
          <nb-option *ngFor="let s of referentiels$" [value]="s.id">
            {{ s.libelle }}
          </nb-option>
        </nb-select>
      </nb-form-field>
      <small class="error"
             *ngIf="fieldForm.get('segment')?.touched && fieldForm.get('segment')?.invalid">
        Ce champ est requis.
      </small>

      <!-- 2. Informations principales -->
      <nb-accordion>
        <nb-accordion-item expanded="true">
          <nb-accordion-item-header>Informations principales</nb-accordion-item-header>
          <nb-accordion-item-body>
            <div class="form-grid">
              <div class="form-row full-width">
                <label>Identifiant de tiers</label>
                <nb-form-field fullWidth>
                  <input nbInput formControlName="identifiantTiers" placeholder="Ex. 123456">
                </nb-form-field>
              </div>
              <div class="form-row full-width">
                <label>Dernière note</label>
                <nb-form-field fullWidth>
                  <input nbInput formControlName="derniereNote" placeholder="Ex. 4.5">
                </nb-form-field>
              </div>
              <div class="form-row full-width">
                <label>Méthodologie</label>
                <nb-form-field fullWidth>
                  <input nbInput formControlName="methodologie" placeholder="Décrire la méthodologie">
                </nb-form-field>
              </div>
              <div class="form-row full-width">
                <label>Utilisateur</label>
                <nb-form-field fullWidth>
                  <input nbInput formControlName="utilisateur" placeholder="Nom d’utilisateur">
                </nb-form-field>
              </div>
              <div class="form-row full-width">
                <label>Statut de la note</label>
                <nb-form-field fullWidth>
                  <input nbInput formControlName="statut" placeholder="Validé / Brouillon">
                </nb-form-field>
              </div>
            </div>
          </nb-accordion-item-body>
        </nb-accordion-item>
      </nb-accordion>

      <!-- 3. Zones dynamiques par segment -->
      <div formArrayName="areas" *ngIf="segment">
        <nb-accordion>
          <nb-accordion-item
            *ngFor="let area of segment.areas; let ai = index"
            [expanded]="true"
          >
            <nb-accordion-item-header>
              <b>{{ area.libelle }}</b>
            </nb-accordion-item-header>
            <nb-accordion-item-body [formGroupName]="ai">
              <div *ngFor="let config of area.fieldConfigurations; let fi = index">
                <label>{{ config.libelle }}</label>
                <ng-container [ngSwitch]="config.type">
                  <!-- TEXT -->
                  <nb-form-field *ngSwitchCase="'TEXT'" fullWidth>
                    <input nbInput [formControlName]="'value' + fi" placeholder="Saisir texte" />
                  </nb-form-field>

                  <!-- DATE -->
                  <nb-form-field *ngSwitchCase="'DATE'" fullWidth>
                    <input nbInput type="date" [formControlName]="'value' + fi" />
                  </nb-form-field>

                  <!-- SELECT -->
                  <nb-form-field *ngSwitchCase="'SELECT'" fullWidth>
                    <nb-select [formControlName]="'value' + fi" placeholder="Sélectionner…">
                      <nb-option *ngFor="let opt of config.risqueValueList" [value]="opt.id">
                        {{ opt.listValueItem.libelle }}
                      </nb-option>
                    </nb-select>
                  </nb-form-field>

                  <!-- BOOLEAN -->
                  <nb-form-field *ngSwitchCase="'BOOLEAN'" fullWidth>
                    <nb-select [formControlName]="'value' + fi">
                      <nb-option [value]="true">Oui</nb-option>
                      <nb-option [value]="false">Non</nb-option>
                    </nb-select>
                  </nb-form-field>
                </ng-container>
              </div>
            </nb-accordion-item-body>
          </nb-accordion-item>
        </nb-accordion>
      </div>

    </nb-card-body>

    <nb-card-footer>
      <button nbButton status="primary" type="submit">Valider</button>
    </nb-card-footer>
  </form>

  <!-- 4. Debug JSON brut -->
  <nb-card-footer *ngIf="segment">
    <h6>Segment chargé (raw JSON)</h6>
    <pre>{{ segment | json }}</pre>
  </nb-card-footer>
</nb-card>


{ "id": 10000, "code": "PP", "libelle": "Personne physique", "areas": [ { "id": 10000, "code": "Donnees_Tiers", "libelle": "Données Tiers", "fieldConfigurations": [ { "id": 10000, "code": "Nom", "libelle": "Nom", "type": "TEXT", "expression": null, "risqueValueList": null, "selected": true, "customBloc": null, "searchable": true, "dateBloc": null, "selectBoolean": false }, { "id": 10001, "code": "Prenom", "libelle": "Prénom", "type": "TEXT", "expression": null, "risqueValueList": null, "selected": true, "customBloc": null, "searchable": true, "dateBloc": null, "selectBoolean": false }, { "id": 10002, "code": "Date_de_naissance", "libelle": "Date de naissance", "type": "DATE", "expression": null, "risqueValueList": null, "selected": true, "customBloc": null, "searchable": false, "dateBloc": null, "selectBoolean": false }, { "id": 10003, "code": "Role", "libelle": "Rôle", "type": "SELECT", "expression": null, "risqueValueList": null, "selected": true, "customBloc": null, "searchable": false, "dateBloc": null, "selectBoolean": false },



::::::::::::::::::::::::::::::
{
  "id": 10000,
  "code": "PP",
  "libelle": "Personne physique",
  "areas": [
    {
      "id": 10000,
      "code": "Donnees_Tiers",
      "libelle": "Données Tiers",
      "fieldConfigurations": [
        {
          "id": 10000,
          "code": "Nom",
          "libelle": "Nom",
          "type": "TEXT",
          "expression": null,
          "risqueValueId": null,
          "selected": true,
          "customBloc": null,
          "searchable": true,
          "dateBloc": null,
          "selectBoolean": false,
          "risqueValueList": []
        },
        {
          "id": 10003,
          "code": "Role",
          "libelle": "Rôle",
          "type": "SELECT",
          "expression": null,
          "risqueValueId": 10003,
          "selected": true,
          "customBloc": null,
          "searchable": false,
          "dateBloc": null,
          "selectBoolean": false,
          "risqueValueList": [
            {
              "id": 10000,
              "listValueItem": {
                "id": 10000,
                "code": "Client",
                "libelle": "Client"
              },
              "risqueValueItem": {
                "id": 10000,
                "code": "LL",
                "libelle": "Low",
                "weight": {
                  "id": 10000,
                  "weightL": 10,
                  "weightMl": 20,
                  "weightMh": 30
                }
              }
            },
            {
              "id": 10001,
              "listValueItem": {
                "id": 10000,
                "code": "Client",
                "libelle": "Client"
              },
              "risqueValueItem": {
                "id": 10001,
                "code": "LMH",
                "libelle": "Med-High",
                "weight": {
                  "id": 10001,
                  "weightL": 15,
                  "weightMl": 25,
                  "weightMh": 35
                }
              }
            }
            // … etc.
          ]
        }
      ]
    }
  ]
}
:::::::::::::::::::::::::::::::::::


public class FieldConfiguration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String libelle;

    @Column(name = "selected", nullable = false)
    private boolean selected = false;


    @Column(nullable = false)
    private String type;
    @Column
    private String expression;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "value_list_id")
    private ListValue valueList;

    @Column(nullable = true)
    private String customBloc;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "risque_list_id")
    private RisqueValueList risqueValueList;
    @ManyToMany(mappedBy = "fieldConfigurations")
    private Set<Area> areas = new HashSet<>();

    @OneToMany(mappedBy = "fieldConfiguration", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ValueItemRisqueItem> valueItemRisqueItem;
    public SegmentDtoVues toDtoVue(Segment segment) {
        SegmentDtoVues dto = new SegmentDtoVues();
        dto.setId(segment.getId());
        dto.setCode(segment.getCode());
        dto.setLibelle(segment.getLibelle());

        List<AreasVueDto> areasDtoList = new ArrayList<>();
        for (Area area : segment.getAreas()) {
            AreasVueDto areaDto = new AreasVueDto();
            areaDto.setId(area.getId());
            areaDto.setCode(area.getCode());
            areaDto.setLibelle(area.getLibelle());

            List<FieldConfigVueDto> fieldDtos = new ArrayList<>();
            for (FieldConfiguration config : area.getFieldConfigurations()) {
                FieldConfigVueDto fieldDto = new FieldConfigVueDto();
                fieldDto.setId(config.getId());
                fieldDto.setCode(config.getCode());
                fieldDto.setLibelle(config.getLibelle());
                fieldDto.setType(config.getType());
                fieldDto.setExpression(config.getExpression());
                fieldDto.setSelected(config.isSelected());
                fieldDto.setSearchable(config.isSearchable());
                if(config.getType().equals("text") || config.getType().equals("number")){
                    fieldDto.setCustomBloc(config.getCustomBloc());
                    if(config.getRisqueValueList().getId()!=null) {
                        fieldDto.setRisqueValueId(config.getRisqueValueList().getId());
                    }

                } else if(config.getType().equals("date")){
                    fieldDto.setDateBloc(config.getDateBloc());
                    if(config.getRisqueValueList().getId()!=null){
                        fieldDto.setRisqueValueId(config.getRisqueValueList().getId());

                    }


                }else if(config.getType().equals("boolean")){
                    fieldDto.setSelectBoolean(config.isSelectBoolean());
                    if(config.getRisqueValueList().getId()!=null) {

                        fieldDto.setRisqueValueId(config.getRisqueValueList().getId());
                    }
                }


                else if(config.getType().equals("select")){

                List<ValueItemRisqueItemVueDto> risqueDtos = new ArrayList<>();
                if (config.getValueItemRisqueItem() != null) {
                    for (ValueItemRisqueItem item : config.getValueItemRisqueItem()) {
                        ValueItemRisqueItemVueDto itemDto = new ValueItemRisqueItemVueDto();
                        itemDto.setId(item.getId());

                        if (item.getListValueItem() != null) {
                            ListValueItemVueDto listValueDto = new ListValueItemVueDto();
                            listValueDto.setId(item.getListValueItem().getId());
                            listValueDto.setCode(item.getListValueItem().getCode());
                            listValueDto.setLibelle(item.getListValueItem().getLibelle());
                            itemDto.setListValueItem(listValueDto);
                        }

                        if (item.getRisqueValueItem() != null) {
                            RisqueValueItemVueDto risqueItemDto = new RisqueValueItemVueDto();
                            risqueItemDto.setId(item.getRisqueValueItem().getId());
                            risqueItemDto.setCode(item.getRisqueValueItem().getCode());
                            risqueItemDto.setLibelle(item.getRisqueValueItem().getLibelle());

                            if (item.getRisqueValueItem().getWeight() != null) {
                                RisqueItemWeightDto weightDto = new RisqueItemWeightDto();
                                weightDto.setId(item.getRisqueValueItem().getWeight().getId());
                                weightDto.setWeightL(item.getRisqueValueItem().getWeight().getWeightL());
                                weightDto.setWeightMh(item.getRisqueValueItem().getWeight().getWeightMh());
                                weightDto.setWeightMl(item.getRisqueValueItem().getWeight().getWeightMl());

                                risqueItemDto.setWeight(weightDto);
                            }

                            itemDto.setRisqueValueItem(risqueItemDto);
                        }

                        risqueDtos.add(itemDto);
                    }
                }else {
                    fieldDto.setCustomBloc(config.getCustomBloc());
                }

                    fieldDto.setRisqueValueList(risqueDtos);

                }
                fieldDtos.add(fieldDto);
            }

            areaDto.setFieldConfigurations(fieldDtos);
            areasDtoList.add(areaDto);
        }

        dto.setAreas(areasDtoList);
        return dto;
    }
public class SegmentDtoVues {
    private Long id;
    private String code;
    private String libelle;
    private List<AreasVueDto> areas;

public class AreasVueDto {
    private Long id;
    private String code;
    private String libelle;
    private List<FieldConfigVueDto> fieldConfigurations;

public class FieldConfigVueDto {
    private Long id;
    private String code;
    private String libelle;
    private String type;
    private String expression;
    private List<ValueItemRisqueItemVueDto> risqueValueList;
    private boolean selected;
    private String customBloc;
    private Long risqueValueId;
    private boolean searchable;
    private LocalDate dateBloc;
    private boolean selectBoolean;
public class ValueItemRisqueItemVueDto {
    private Long id;
    private ListValueItemVueDto listValueItem;
    private RisqueValueItemVueDto risqueValueItem;
public class ListValueItemVueDto {
    private Long id;
    private String code;
    private String libelle;
