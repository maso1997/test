<nb-card accent="danger">
  <nb-card-header>Notation</nb-card-header>

  <form [formGroup]="fieldForm" (ngSubmit)="submit()">
    <nb-card-body>

      <!-- 1. Sélection du segment -->
      <nb-form-field fullWidth >
        <nb-select
          fullWidth
          formControlName="segment"
          placeholder="Sélectionner un segment"
          (selectedChange)="onSegmentChange($event)"
        >
          <nb-option *ngFor="let s of segments$ | async" [value]="s.id">
            {{ s.libelle }}
          </nb-option>
        </nb-select>
      </nb-form-field>
      <small class="error"
             *ngIf="fieldForm.get('segment')?.touched && fieldForm.get('segment')?.invalid">
        Ce champ est requis.
      </small>

      <!-- 2. Informations principales -->
<nb-accordion class="cc">
  <nb-accordion-item expanded="true">
    <nb-accordion-item-header>
      Informations principales
    </nb-accordion-item-header>
    <nb-accordion-item-body>
      <div class="form-grid">
        
        <div class="form-row full-width">
          <label class="form-label">
            <strong>Identifiant de tiers</strong>
          </label>
          <nb-form-field fullWidth class="input-field">
            <input
              nbInput
              fullWidth
              placeholder="Ex. 123456"
              formControlName="identifiantTiers"
            />
          </nb-form-field>
        </div>

        <div class="form-row full-width">
          <label class="form-label">
            <strong>Dernière note</strong>
          </label>
          <nb-form-field fullWidth class="input-field">
            <input
              nbInput
              fullWidth
              placeholder="Ex. 4.5"
              formControlName="derniereNote"
            />
          </nb-form-field>
        </div>

        <div class="form-row full-width">
          <label class="form-label">
            <strong>Méthodologie</strong>
          </label>
          <nb-form-field fullWidth class="input-field">
            <input
              nbInput
              fullWidth
              placeholder="Décrire la méthodologie"
              formControlName="methodologie"
            />
          </nb-form-field>
        </div>

        <div class="form-row full-width">
          <label class="form-label">
            <strong>Utilisateur</strong>
          </label>
          <nb-form-field fullWidth class="input-field">
            <input
              nbInput
              fullWidth
              placeholder="Nom d’utilisateur"
              formControlName="utilisateur"
            />
          </nb-form-field>
        </div>

        <div class="form-row full-width">
          <label class="form-label">
            <strong>Statut de la note</strong>
          </label>
          <nb-form-field fullWidth class="input-field">
            <input
              nbInput
              fullWidth
              placeholder="Validé / Brouillon"
              formControlName="statut"
            />
          </nb-form-field>
        </div>

      </div>
    </nb-accordion-item-body>
  </nb-accordion-item>
</nb-accordion>



      <!-- 3. Champs dynamiques par area -->
      <nb-accordion *ngIf="segmentDetail">
        <nb-accordion-item *ngFor="let areaFG of areasFA.controls; let ai = index" expanded="true">
          <nb-accordion-item-header>
            {{ segmentDetail.areas?.[ai]?.libelle }}
          </nb-accordion-item-header>
          <nb-accordion-item-body>
            <div *ngFor="let fieldFG of getFieldsFA(ai).controls; let fi = index" [formGroupName]="fi" class="field-row">
              <div class="field-label">
                <strong>{{ fieldFG.get('libelle')?.value }}</strong>
              </div>
              <div class="field-select">
<ng-container [ngSwitch]="fieldFG.get('type')?.value">

  <nb-form-field *ngSwitchCase="'TEXT'" fullWidth>
    <input fullWidth nbInput formControlName="value" />
  </nb-form-field>

  <nb-form-field *ngSwitchCase="'DATE'" fullWidth>
    <input nbInput fullWidth type="date" formControlName="value" />
  </nb-form-field>

  <nb-form-field *ngSwitchCase="'SELECT'" fullWidth>
    <nb-select fullWidth formControlName="value">
      <nb-option fullWidth *ngFor="let opt of fieldFG.get('options')?.value" [value]="opt.id">
        {{ opt.libelle }}
      </nb-option>
    </nb-select>
  </nb-form-field>

  <nb-form-field *ngSwitchCase="'BOOLEAN'" fullWidth>
    <nb-select formControlName="value" placeholder="Oui / Non">
      <nb-option
        *ngFor="let opt of fieldFG.get('options')?.value"
        [value]="opt.id"
      >
        {{ opt.libelle }}
      </nb-option>
    </nb-select>
  </nb-form-field>

</ng-container>

              </div>
            </div>
          </nb-accordion-item-body>
        </nb-accordion-item>
      </nb-accordion>

    </nb-card-body>

    <nb-card-footer >
      <div class="actions-card ">
      <button nbButton  class="cr" type="submit">
        Valider
      </button>
      </div>

    </nb-card-footer>
  </form>
</nb-card>

import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { GestionReferentielsService } from '../../gestion-referentiel/services/gestion-referentiels.service';
import { Referentiel } from 'src/app/core/models/Referentiel';
import { AreaDTO, ReferentielTypes } from '../../traitement-demande/model/fieldConfig';
import { NotationService } from '../notation.service';
import { SegmentDtoVues } from '../model/segementDtoVue';
import {  NbGlobalPhysicalPosition } from '@nebular/theme';
import { FieldConfigDto } from '../../traitement-demande/model/searchSegments/SegmentsDto';

@Component({
  standalone: false,
  selector: 'app-add-notation',
  templateUrl: './add-notation.component.html',
  styleUrl: './add-notation.component.scss'
})

export class AddNotationComponent implements OnInit {
  fieldForm: FormGroup;
  segments$ = this.serviceRef.getReferentiel('segments');
  segmentDetail: any;            // on reste en any pour contourner les DTO

  constructor(
    private fb: FormBuilder,
    private toaster: NbToastrService,
    private serviceRef: GestionReferentielsService,
    private notationService: NotationService,
  ) {
    this.fieldForm = this.fb.group({
      segment:          [null, Validators.required],
      identifiantTiers: ['', Validators.required],
      derniereNote:     ['', Validators.required],
      methodologie:     ['', Validators.required],
      utilisateur:      ['', Validators.required],
      statut:           ['', Validators.required],
      areas:            this.fb.array([]),
    });
  }

  ngOnInit(): void {}

  get areasFA(): FormArray {
    return this.fieldForm.get('areas') as FormArray;
  }

  getFieldsFA(areaIndex: number): FormArray {
    return this.areasFA.at(areaIndex).get('fields') as FormArray;
  }

  private buildFieldControl(cfg: any): FormGroup {
    // 1. Récupérer les options éventuelles
    let options = cfg.valueListItems ?? cfg.risqueValueItems ?? [];

    // 2. Si BOOLEAN sans options, fallback Oui/Non
    if (cfg.type === 'BOOLEAN' && options.length === 0) {
      options = [
        { id: true,  libelle: 'Oui' },
        { id: false, libelle: 'Non' },
      ];
    }

    // 3. Validation : required si sélectionné et pas BOOLEAN
    const validators = cfg.selected && cfg.type !== 'BOOLEAN'
      ? [Validators.required]
      : [];

    return this.fb.group({
      id:      [cfg.id],
      code:    [cfg.code],
      libelle: [cfg.libelle],
      type:    [cfg.type],
      options: [options],
      value:   [null, validators],
    });
  }

  onSegmentChange(segmentId: number): void {
    this.notationService.getSegmentById(segmentId).subscribe({
      next: (seg: any) => {
        this.segmentDetail = seg;
        this.areasFA.clear();

        seg.areas.forEach((area: any) => {
          const fieldCtrls = area.fieldConfigurations.map((cfg: any) =>
            this.buildFieldControl(cfg)
          );
          this.areasFA.push(this.fb.group({
            areaId: [area.id],
            fields: this.fb.array(fieldCtrls),
          }));
        });
      },
      error: err => console.error('Erreur chargement segment', err),
    });
  }

  submit(): void {
    if (this.fieldForm.invalid) {
      this.fieldForm.markAllAsTouched();
      return;
    }

    const payload = this.fieldForm.value;
    console.log('Payload soumis', payload);

    this.toaster.success('Notation ajoutée ✅', 'Succès', {
      position: NbGlobalPhysicalPosition.TOP_RIGHT,
      duration: 3000,
    });

    this.fieldForm.reset();
    this.areasFA.clear();
    this.segmentDetail = undefined;
  }
}


package com.sahambank.fccr.core.util;

import jakarta.persistence.EntityManager;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
public class DataSeederService {

    private final EntityManager entityManager;

    @Value("${seed.insert-user}")
    private boolean insertUser;

    public DataSeederService(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Transactional
    public void seedValues() {
        if (!insertUser) {
            return;
        }




    // 1. SEGMENTS
        entityManager.createNativeQuery(
                "INSERT INTO segment (id, code, libelle) VALUES " +
                "  (10000, 'PP', 'Personne physique'), " +
                "  (10001, 'PM', 'Personne morale') " +
                "ON CONFLICT (id) DO NOTHING"
                ).executeUpdate();

    // 2. AREAS
        entityManager.createNativeQuery(
                "INSERT INTO area (id, code, libelle, segment_id) VALUES " +
                "  (10000, 'Donnees_Tiers',   'Données Tiers',    10000), " +
                "  (10001, 'Geolocalisation', 'Géolocalisation', 10001), " +
                "  (10002, 'Activite',        'Activité',         10001) " +
                "ON CONFLICT (id) DO NOTHING"
                ).executeUpdate();

    // 3. LIST_VALUE (sans Oui/Non)
        entityManager.createNativeQuery(
                "INSERT INTO list_value (id, code, libelle) VALUES " +
                "  (10000, 'Nom',                   'Nom'), " +
                "  (10001, 'Prenom',                'Prénom'), " +
                "  (10002, 'Date_de_naissance',     'Date de naissance'), " +
                "  (10003, 'Role',                  'Rôle'), " +
                "  (10004, 'Sexe',                  'Sexe'), " +
                "  (10005, 'Pays_de_naissance',     'Pays de naissance'), " +
                "  (10006, 'Inactivite',            'Inactivité'), " +
                "  (10007, 'Date_d_activite',       'Date d''activité'), " +
                "  (10008, 'Pays_residence_fiscal', 'Pays de résidence fiscal'), " +
                "  (10009, 'Pays_citoyennete',      'Pays de citoyenneté'), " +
                "  (10010, 'Pays_souscription',     'Pays de souscription'), " +
                "  (10011, 'Produit_renseigner',    'Produit à renseigner') " +
                "ON CONFLICT (id) DO NOTHING"
                ).executeUpdate();

    // 4. LIST_VALUE_ITEM (sans Oui/Non pour boolean)
        entityManager.createNativeQuery(
                "INSERT INTO list_value_item (id, code, libelle, list_value_id) VALUES " +
                "  (10000, 'Client',        'Client',             10003), " +
                "  (10001, 'Tiers_Client',  'Tiers lié à Client', 10003), " +
                "  (10002, 'FSP',           'FSP',                10003), " +
                "  (10003, 'Masculin',      'Masculin',           10004), " +
                "  (10004, 'Feminin',       'Féminin',            10004), " +
                "  (10005, 'Actif',         'Actif',              10006), " +
                "  (10006, 'Inactif',       'Inactif',            10006), " +
                "  (10007, 'TUN',           'Tunisie',            10008), " +
                "  (10008, 'MA',            'Maroc',              10008), " +
                "  (10009, 'FR',            'France',             10008), " +
                "  (10010, 'AL',            'Albanie',            10009), " +
                "  (10011, 'DEU',           'Allemagne',          10009), " +
                "  (10012, 'JPN',           'Japon',              10009), " +
                "  (10013, 'USA',           'États-Unis',         10010), " +
                "  (10014, 'BRA',           'Brésil',             10010), " +
                "  (10015, 'RUS',           'Russie',             10010), " +
                "  (10016, 'CARTE',         'Carte',              10011), " +
                "  (10017, 'CREDITS',       'Crédits',            10011), " +
                "  (10018, 'ASSURANCE',     'Assurance',          10011), " +
                "   (10007, 'OUI', 'Oui', 10004),"+
                "(10008, 'NON', 'Non', 10004)"+

                "ON CONFLICT (id) DO NOTHING"
                ).executeUpdate();

    // 5. RISQUE_VALUE_LIST
        entityManager.createNativeQuery(
                "INSERT INTO risque_value_list (id, code, libelle) VALUES " +
                "  (10000, 'L_H_Levels',  'Low/high'), " +
                "  (10001, 'MONTHS_LVL',  'Période en mois'), " +
                "  (10002, '0_8_INTERV',  'Intervalle 0..8'), " +
                "  (10003, 'SENSIBILITE', 'BOOLEAN'), " +
                "  (10004, 'OUI_NON',     'BOOLEAN'), " +
                "  (10005, 'DATE',        'DATE') " +
                "ON CONFLICT (id) DO NOTHING"
                ).executeUpdate();

    // 6. RISQUE_VALUE_ITEM
        entityManager.createNativeQuery(
                "INSERT INTO risque_value_item (id, code, libelle, risque_value_list_id) VALUES " +
                "  (10000, 'LL',     'Low',       10000), " +
                "  (10001, 'LMH',    'Med-High',  10000), " +
                "  (10002, 'LHigh',  'High',      10000), " +
                "  (10003, 'LML',    'Med-Low',   10000), " +
                "  (10004, 'SENS_L', 'Faible',    10003), " +
                "  (10005, 'SENS_M', 'Moyen',     10003), " +
                "  (10006, 'SENS_H', 'Élevé',     10003) " +
                "ON CONFLICT (id) DO NOTHING"
                ).executeUpdate();

// 7. FIELD_CONFIGURATION — colonnes corrigées : value_list_id et risque_list_id
        entityManager.createNativeQuery(
                "INSERT INTO field_configuration (" +
                        "  id, code, libelle, selected, type, expression, " +
                        "  value_list_id, risque_list_id, custom_bloc, " +
                        "  searchable, date_bloc, select_boolean" +
                        ") VALUES " +
                        // Données Tiers
                        "(10000, 'Nom',                   'Nom',                     true,  'TEXT',    NULL,  NULL,       NULL, NULL,  true,  NULL,   false), " +
                        "(10001, 'Prenom',                'Prénom',                  true,  'TEXT',    NULL,  NULL,       NULL, NULL,  true,  NULL,   false), " +
                        "(10002, 'Date_de_naissance',     'Date de naissance',       true,  'DATE',    NULL,  NULL,       NULL, NULL,  false, NULL,    false), " +
                        "(10003, 'Role',                  'Rôle',                    true,  'SELECT',  NULL,  10003,      NULL, NULL,  false, NULL,   false), " +
                        "(10004, 'Sexe',                  'Sexe',                    true,  'SELECT',  NULL,  10004,      NULL, NULL,  false, NULL,   false), " +
                        "(10005, 'Pays_de_naissance',     'Pays de naissance',       true,  'SELECT',  NULL,  10005,      NULL, NULL,  false, NULL,   false), " +
                        "(10006, 'Inactivite',            'Inactivité',              true,  'SELECT',  NULL,  10006,      NULL, NULL,  false, NULL,   false), " +
                        "(10007, 'Date_activite',         'Date d''activité',        true,  'DATE',    NULL,  NULL,       NULL, NULL,  false, NULL,    false), " +
                        // Géolocalisation
                        "(10008, 'Pays_residence_fiscal', 'Pays de résidence fiscal',true,  'SELECT',  NULL,  10008,      NULL, NULL,  false, NULL,   false), " +
                        "(10009, 'Pays_citoyennete',      'Pays de citoyenneté',     true,  'SELECT',  NULL,  10009,      NULL, NULL,  false, NULL,   false), " +
                        "(10010, 'Pays_souscription',     'Pays de souscription',    true,  'SELECT',  NULL,  10010,      NULL, NULL,  false, NULL,   false), " +
                        // Activité
                        "(10011, 'Produit_renseigner',    'Produit à renseigner',    true,  'SELECT',  NULL,  10011,      NULL, NULL,  false, NULL,   false), " +
                        "(10012, 'Apporteur_affaire',     'Apporteur d''affaire',    true,  'BOOLEAN', NULL,  NULL,       10004, NULL,  false, NULL,    true),  " +
                        "(10013, 'Lien_environnement',    'Lien avec l''environnement',true,'BOOLEAN',NULL, NULL,       10004, NULL,  false, NULL,    true)   " +
                        "ON CONFLICT (id) DO NOTHING"
        ).executeUpdate();



    // 8. AREA ↔ FIELD_CONFIGURATION
    // Données Tiers (10000)
        entityManager.createNativeQuery(
                "INSERT INTO area_field_config (area_id, field_config_id) VALUES " +
                "  (10000, 10000), (10000, 10001), (10000, 10002), (10000, 10003), " +
                "  (10000, 10004), (10000, 10007), (10000, 10008), (10000, 10010) " +
                "ON CONFLICT (area_id, field_config_id) DO NOTHING"
                ).executeUpdate();

    // Géolocalisation (10001)
        entityManager.createNativeQuery(
                "INSERT INTO area_field_config (area_id, field_config_id) VALUES " +
                "  (10001, 10005), (10001, 10006), (10001, 10009) " +
                "ON CONFLICT (area_id, field_config_id) DO NOTHING"
                ).executeUpdate();

    // Activité (10002)
        entityManager.createNativeQuery(
                "INSERT INTO area_field_config (area_id, field_config_id) VALUES " +
                "  (10002, 10011), (10002, 10012), (10002, 10013) " +
                "ON CONFLICT (area_id, field_config_id) DO NOTHING"
                ).executeUpdate();

    // 9. VALUEITEM_RISQUEITEM (sans associations aux anciens Oui/Non)
        entityManager.createNativeQuery(
                "INSERT INTO valueitem_risqueitem (list_value_item_id, risque_value_item_id) VALUES " +
                "  (10000, 10000), (10000, 10001), (10000, 10002), (10000, 10003), " +
                "  (10001, 10000), (10001, 10001), (10001, 10002), (10001, 10003), " +
                "  (10002, 10000), (10002, 10001), (10002, 10002), (10002, 10003), " +
                "  (10003, 10004), (10003, 10005), (10003, 10006), " +
                "  (10004, 10004), (10004, 10005), (10004, 10006) " +
                "ON CONFLICT ON CONSTRAINT uq_valueitem_risqueitem DO NOTHING"
                ).executeUpdate();

    // 10. RISQUE_ITEM_WEIGHT
        entityManager.createNativeQuery(
                "INSERT INTO risque_item_weight " +
                "(id, risque_value_item_id, weightl, weight_ml, weight_mh) VALUES " +
                "  (10000, 10000, 10, 20, 30), " +
                "  (10001, 10001, 15, 25, 35), " +
                "  (10002, 10002, 20, 30, 40), " +
                "  (10003, 10003, 12, 22, 32), " +
                "  (10004, 10004,  5, 10, 15), " +
                "  (10005, 10005, 10, 15, 20), " +
                "  (10006, 10006, 10, 15, 22) " +
                "ON CONFLICT (id) DO NOTHING"
                ).executeUpdate();
}
}
package com.sahambank.fccr.core.entities;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "field_configuration")
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

    @Column(nullable = true)
    private boolean searchable;

    @Column(nullable = true)
    private LocalDate dateBloc;

    @Column(nullable = true)
    private boolean selectBoolean;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getLibelle() {
        return libelle;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public boolean isSelected() {
        return selected;
    }

    public void setSelected(boolean selected) {
        this.selected = selected;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getExpression() {
        return expression;
    }

    public void setExpression(String expression) {
        this.expression = expression;
    }

    public ListValue getValueList() {
        return valueList;
    }

    public void setValueList(ListValue valueList) {
        this.valueList = valueList;
    }

    public RisqueValueList getRisqueValueList() {
        return risqueValueList;
    }

    public void setRisqueValueList(RisqueValueList risqueValueList) {
        this.risqueValueList = risqueValueList;
    }

    public Set<Area> getAreas() {
        return areas;
    }

    public void setAreas(Set<Area> areas) {
        this.areas = areas;
    }

    public List<ValueItemRisqueItem> getValueItemRisqueItem() {
        return valueItemRisqueItem;
    }

    public void setValueItemRisqueItem(List<ValueItemRisqueItem> valueItemRisqueItem) {
        this.valueItemRisqueItem = valueItemRisqueItem;
    }

    public String getCustomBloc() {
        return customBloc;
    }

    public void setCustomBloc(String customBloc) {
        this.customBloc = customBloc;
    }


    public boolean isSearchable() {
        return searchable;
    }

    public void setSearchable(boolean searchable) {
        this.searchable = searchable;
    }

    public LocalDate getDateBloc() {
        return dateBloc;
    }

    public void setDateBloc(LocalDate dateBloc) {
        this.dateBloc = dateBloc;
    }

    public boolean isSelectBoolean() {
        return selectBoolean;
    }

    public void setSelectBoolean(boolean selectBoolean) {
        this.selectBoolean = selectBoolean;
    }
}
import { ValueItemRisqueItemVueDto } from "./valueItemRisqueItemVueDto";

export interface FieldConfigVueDto {
  id: number;
  code: string;
  libelle: string;
  type: string;
  expression: string;
  selected: boolean;
  risqueValueList: ValueItemRisqueItemVueDto[];
}
import { ListValueItemVueDto } from "./listeValueItemDto";
import { RisqueValueItemVueDto } from "./risqueValueItemVueDto";

export interface ValueItemRisqueItemVueDto {
  id: number;
  listValueItem: ListValueItemVueDto;
  risqueValueItem: RisqueValueItemVueDto;
}
export interface ListValueItemVueDto {
  id: number;
  code: string;
  libelle: string;
}
import { RisqueItemWeightDto } from "./risqueItemWeightDto";

export interface RisqueValueItemVueDto {
  id: number;
  code: string;
  libelle: string;
  weight: RisqueItemWeightDto;
}
import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {ListValueDTO} from "../../traitement-demande/model/fieldConfig";
import {SegmentsDto} from "../../traitement-demande/model/searchSegments/SegmentsDto";
import {Referentiel} from "../../../core/models/Referentiel";

@Injectable({
  providedIn: 'root'
})
export class GestionReferentielsService {

  private apiUrl = environment.api.url

  constructor(private http: HttpClient) {
  }

  private getEndpoint(type : string ): string {
    switch (type) {
      case 'segments':           return 'referentiel/segments';
      case 'areas':              return 'referentiel/areas';
      case 'listValues':         return 'referentiel/list-values';
      case 'listValueItems':     return 'referentiel/list-value-items';
      case 'risqueValueLists':   return 'referentiel/risque-value-lists';
      case 'risqueValueItems':   return 'referentiel/risque-value-items';
      default:                   return '';
    }
  }
  getReferentiel(type : string): Observable<Referentiel[]>{
    const endpoint = this.getEndpoint(type);
    if(!endpoint) return of ([]);
    return this.http.get<Referentiel[]> (`${this.apiUrl}${endpoint}`) ;
  }

  createReferentiel(type: string, data: Referentiel): Observable<Referentiel> {
    console.log("ref ",data)
    const endpoint = this.getEndpoint(type);
    return this.http.post<Referentiel>(`${this.apiUrl}/${endpoint}`, data);
  }

  updateReferentiel(type : string , data: Referentiel): Observable<Referentiel>{
    const endpoint = this.getEndpoint(type);
    return this.http.put<Referentiel> (`${this.apiUrl}/${endpoint}/${data.id}`,
      data , {responseType :'json' }) ;
  }
  deleteReferentiel(type : string , id : number ): Observable<void>{
    const endpoint = this.getEndpoint(type);
    return this.http.delete<void> (`${this.apiUrl}/${endpoint}/${id}`) ;
  }

}



import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";



@Injectable({
  providedIn: 'root'
})
export class NotationService {

     private apiUrl = environment.api.url
  constructor(private http: HttpClient) {
  }
  getSegmentById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/segments/${id}`);
  }
}

//////////////old version ///////////////////////
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { GestionReferentielsService } from '../../gestion-referentiel/services/gestion-referentiels.service';
import { Referentiel } from 'src/app/core/models/Referentiel';
import { ReferentielTypes } from '../../traitement-demande/model/fieldConfig';
import { NotationService } from '../notation.service';
import { SegmentDtoVues } from '../model/segementDtoVue';
import {  NbGlobalPhysicalPosition } from '@nebular/theme';

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
  libelle: ['', Validators.required],
  identifiantTiers: ['', Validators.required],
  derniereNote: ['', Validators.required],
  methodologie: ['', Validators.required],
  utilisateur: ['', Validators.required],
  statut: ['', Validators.required],
});

  }



    ngOnInit(): void {
           this.serviceRef.getReferentiel(this.selectedRef).subscribe(data => {
        this.referentiels$ = data
      })


    }

      onSegementChange(event: any) {
         const selectedId = event?.id || null;
      this.fieldForm.patchValue({ valueId: selectedId });
    this.notationService.getSegmentById(event).subscribe({
          next: (response) => {
            this.segement= response;
            console.log('Champ ajoute avec succès :', response);
            console.log(this.segement);


          },
          error: (err:any) => {
            console.error('Erreur lors de la création du champ :', err);
          }
        });
      }

  submit(): void {
  // if (this.fieldForm.invalid) {
  //   this.fieldForm.markAllAsTouched();
  //   return;
  // }

  // const formData = this.fieldForm.value;

  // const payload: any = {
  //   segmentId: formData.segment,
  //   identifiantTiers: formData.identifiantTiers,
  //   derniereNote: formData.derniereNote,
  //   methodologie: formData.methodologie,
  //   utilisateur: formData.utilisateur,
  //   statut: formData.statut,
  //   areas: []
  // };

  // if (this.segement?.areas) {
  //   for (const area of this.segement.areas) {
  //     const areaPayload: any = {
  //       areaId: area.id,
  //       fieldConfigs: []
  //     };

  //     for (const config of area.fieldConfigurations) {
  //       areaPayload.fieldConfigs.push({
  //         fieldId: config.id,
  //       });
  //     }

  //     payload.areas.push(areaPayload);
  //   }
  // }

  // console.log('Payload soumis ✅', payload);

  
 
this.toasterService.success('Notation ajoutée avec succès ✅', 'Succès', {
  status: 'success',
  duration: 3000,
  destroyByClick: true,
  position: NbGlobalPhysicalPosition.TOP_RIGHT,
  preventDuplicates: true
});

 this.fieldForm.reset();


  }

}
<nb-card accent="">
  <nb-card-header class="d-flex flex-row justify-content-between align-items-center">
    <h5 class="title-heading text-uppercase my-auto p-2">
     Notation
    </h5>
    
  </nb-card-header>
  <form [formGroup]="fieldForm" (ngSubmit)="submit()">

     
      <nb-card-body>
        <nb-form-field fullWidth>
          <nb-select
            fullWidth
            formControlName="segment"
            placeholder="Sélectionner un segment"
            [class.invalid]="fieldForm.get('segment')?.invalid && fieldForm.get('segment')?.touched"
            (selectedChange)="onSegementChange($event)">
            <nb-option *ngFor="let type of referentiels$" [value]="type.id">
              {{ type.libelle }}
            </nb-option>
          </nb-select>
        </nb-form-field>
        <small class="error" *ngIf="fieldForm.get('segment')?.invalid && fieldForm.get('segment')?.touched">
          Ce champ est requis.
        </small>
      </nb-card-body>

<nb-card class="main-card">
  <nb-card-header  class="title-heading text-uppercase my-auto p-2" >Informations principales</nb-card-header>
  <nb-card-body>
    <div class="form-grid">
      <div class="form-row">
        <label class="form-label">Identifiant de tiers noté</label>
        <nb-form-field class="input-field">
          <input nbInput fullWidth formControlName="identifiantTiers" placeholder="Ex. 123456" />
        </nb-form-field>
      </div>

      <div class="form-row">
        <label class="form-label">Dernière note</label>
        <nb-form-field class="input-field">
          <input nbInput fullWidth formControlName="derniereNote" placeholder="Ex. 4.5" />
        </nb-form-field>
      </div>

      <div class="form-row">
        <label class="form-label">Méthodologie</label>
        <nb-form-field class="input-field">
          <input nbInput fullWidth formControlName="methodologie" placeholder="Décrire la méthodologie" />
        </nb-form-field>
      </div>

      <div class="form-row">
        <label class="form-label">Utilisateur</label>
        <nb-form-field class="input-field">
          <input nbInput fullWidth formControlName="utilisateur" placeholder="Nom d’utilisateur" />
        </nb-form-field>
      </div>

      <div class="form-row">
        <label class="form-label">Status de la note</label>
        <nb-form-field class="input-field">
          <input nbInput fullWidth formControlName="statut" placeholder="Ex. Validé / Brouillon" />
        </nb-form-field>
      </div>
    </div>
  </nb-card-body>
</nb-card>



<ng-container *ngFor="let area of segement.areas">
  <nb-card class="area-card">
    <nb-card-header>
      <strong>{{ area.libelle }}</strong>
    </nb-card-header>
    <nb-card-body>
      <div
        *ngFor="let config of area.fieldConfigurations"
        class="field-row"
      >
        <div class="field-label">
          <strong>{{ config.libelle }}</strong>
        </div>
        <div class="field-select">
          <nb-form-field fullWidth>
            <nb-select
              fullWidth
              [(ngModel)]="config.risqueValueList"
            >
              <nb-option
                *ngFor="let item of config.risqueValueList"
                [value]="item.listValueItem?.id"
              >
                {{ item.listValueItem?.libelle }}
              </nb-option>
            </nb-select>
          </nb-form-field>
        </div>
      </div>
    </nb-card-body>
  </nb-card>
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
