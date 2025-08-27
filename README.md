
public interface ItemRepository extends JpaRepository<Item, Long> {
    Optional<Item> findByCode(String code);
}
package com.sahambank.fccr.core.repository;

import com.sahambank.fccr.core.entities.Notation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotationRepository extends JpaRepository<Notation, Long> {}
public interface ProductDataRepository extends JpaRepository<ProductData, Long> {
    Optional<ProductData> findFirstByRctIdentifierClient(String rctIdentifierClient);

    Optional<ProductData> findByRctIdentifierClientAndCollectMonth(String rctIdentifierClient, String collectMonth);

    Optional<ProductData> findTopByRctIdentifierClientOrderByCollectMonthDesc(String rctIdentifierClient);

    @Query("""
           select p from ProductData p
           where p.rctIdentifierClient = :clientCode
             and p.collectMonth >= :sinceMonth
           order by p.collectMonth desc
           """)
    List<ProductData> findAllSinceMonth(String clientCode, String sinceMonth);

}
package com.sahambank.fccr.core.repository;

import com.sahambank.fccr.core.entities.RisqueEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RisqueEntryRepository extends JpaRepository<RisqueEntry, Long> {
    @Query("""
           select re from RisqueEntry re
           join re.notationFieldValue fv
           join fv.notation n
           join n.productData pd
           where n.clientCode = :clientCode
             and (:productCode is null or pd.productCode = :productCode)
           """)
    List<RisqueEntry> findByClientAndProduct(@Param("clientCode") String clientCode,
                                             @Param("productCode") String productCode);
    @Query("""
           select re from RisqueEntry re
           join re.notationFieldValue fv
           join fv.notation n
           join n.productData pd
           where n.clientCode = :rctIdentifierClient
           """)
    List<RisqueEntry> findFirstByRctIdentifierClient(String rctIdentifierClient);

}
package com.sahambank.fccr.core.mapper;
import com.sahambank.fccr.core.dto.RisqueEntryDto;
import com.sahambank.fccr.core.dto.User.PortalUserDTO;
import com.sahambank.fccr.core.dto.User.RoleDTO;
import com.sahambank.fccr.core.entities.PortalUser;
import com.sahambank.fccr.core.entities.RisqueEntry;
import com.sahambank.fccr.core.entities.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValueCheckStrategy;

import java.util.List;

@Mapper(componentModel = "spring", nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
public interface RisqueEntryMapper {
    RisqueEntryDto fromRisqueEntryToDTO(RisqueEntry risqueEntry);

}
package com.sahambank.fccr.core.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sahambank.fccr.core.dto.segment.SegmentSaveDto;

import java.util.List;

public class NotationDto {
    @JsonProperty("SEGMENT")
    private SegmentSaveDto SEGMENT;
    private List<FiledValueDto> fieldConfigurations;
    private String clientCode;


    public SegmentSaveDto getSEGMENT() {
        return SEGMENT;
    }

    public void setSEGMENT(SegmentSaveDto SEGMENT) {
        this.SEGMENT = SEGMENT;
    }

    public List<FiledValueDto> getFieldConfigurations() {
        return fieldConfigurations;
    }

    public void setFieldConfigurations(List<FiledValueDto> fieldConfigurations) {
        this.fieldConfigurations = fieldConfigurations;

    }

    public String getClientCode() {
        return clientCode;
    }

    public void setClientCode(String clientCode) {
        this.clientCode = clientCode;
    }
}
package com.sahambank.fccr.core.entities.file;

import com.sahambank.fccr.core.entities.Notation;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class ProductData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String rctIdentifierClient;
    private String customerLocalization;
    private String localIdentifierClient;
    private String localDatabaseName;
    private String productCode;
    private String productType;
    private String issuingApplicationCode;
    private String bookingEntityCode;
    private String collectMonth;
    @OneToMany(mappedBy = "productData", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Notation> notations = new ArrayList<>();


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRctIdentifierClient() {
        return rctIdentifierClient;
    }

    public void setRctIdentifierClient(String rctIdentifierClient) {
        this.rctIdentifierClient = rctIdentifierClient;
    }

    public String getCustomerLocalization() {
        return customerLocalization;
    }

    public void setCustomerLocalization(String customerLocalization) {
        this.customerLocalization = customerLocalization;
    }

    public String getLocalIdentifierClient() {
        return localIdentifierClient;
    }

    public void setLocalIdentifierClient(String localIdentifierClient) {
        this.localIdentifierClient = localIdentifierClient;
    }

    public String getLocalDatabaseName() {
        return localDatabaseName;
    }

    public void setLocalDatabaseName(String localDatabaseName) {
        this.localDatabaseName = localDatabaseName;
    }

    public String getProductCode() {
        return productCode;
    }

    public void setProductCode(String productCode) {
        this.productCode = productCode;
    }

    public String getProductType() {
        return productType;
    }

    public void setProductType(String productType) {
        this.productType = productType;
    }

    public String getIssuingApplicationCode() {
        return issuingApplicationCode;
    }

    public void setIssuingApplicationCode(String issuingApplicationCode) {
        this.issuingApplicationCode = issuingApplicationCode;
    }

    public String getBookingEntityCode() {
        return bookingEntityCode;
    }

    public void setBookingEntityCode(String bookingEntityCode) {
        this.bookingEntityCode = bookingEntityCode;
    }

    public String getCollectMonth() {
        return collectMonth;
    }

    public void setCollectMonth(String collectMonth) {
        this.collectMonth = collectMonth;
    }


    public List<Notation> getNotations() {
        return notations;
    }

    public void setNotations(List<Notation> notations) {
        this.notations = notations;
    }
}
package com.sahambank.fccr.core.entities;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "notation_field_value")
public class NotationFieldValue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "notation_id", nullable = false)
    @JsonBackReference
    private Notation notation;

    @Column(name = "field_configuration_id", nullable = false)
    private Long fieldConfigurationId;

    @Column(name = "field_code", nullable = false, length = 255)
    private String fieldCode;

    @Column(name = "fonction", nullable = true)
    private Boolean fonction;

    @Column(name = "fonctiontype", length = 100)
    private String fonctiontype;

    @OneToMany(mappedBy = "notationFieldValue", cascade = CascadeType.PERSIST)
    private List<RisqueEntry> risqueValueList;


    public NotationFieldValue() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Notation getNotation() {
        return notation;
    }

    public void setNotation(Notation notation) {
        this.notation = notation;
    }

    public Long getFieldConfigurationId() {
        return fieldConfigurationId;
    }

    public void setFieldConfigurationId(Long fieldConfigurationId) {
        this.fieldConfigurationId = fieldConfigurationId;
    }

    public String getFieldCode() {
        return fieldCode;
    }

    public void setFieldCode(String fieldCode) {
        this.fieldCode = fieldCode;
    }

    public Boolean getFonction() {
        return fonction;
    }

    public void setFonction(Boolean fonction) {
        this.fonction = fonction;
    }

    public String getFonctiontype() {
        return fonctiontype;
    }

    public void setFonctiontype(String fonctiontype) {
        this.fonctiontype = fonctiontype;
    }

    public List<RisqueEntry> getRisqueValueList() {
        return risqueValueList;
    }

    public void setRisqueValueList(List<RisqueEntry> risqueValueList) {
        this.risqueValueList = risqueValueList;
    }

}
package com.sahambank.fccr.core.entities;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;


@Entity
@Table(name = "risque_entry")
public class RisqueEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "list_value_item_id")
    private Item listValueItem;

    @ManyToOne
    @JoinColumn(name = "risque_value_item_id")
    private Item risqueValueItem;
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "field_value_id", nullable = false)
    private NotationFieldValue notationFieldValue;
    public RisqueEntry() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Item getListValueItem() {
        return listValueItem;
    }

    public void setListValueItem(Item listValueItem) {
        this.listValueItem = listValueItem;
    }

    public Item getRisqueValueItem() {
        return risqueValueItem;
    }

    public void setRisqueValueItem(Item risqueValueItem) {
        this.risqueValueItem = risqueValueItem;
    }

    public NotationFieldValue getNotationFieldValue() {
        return notationFieldValue;
    }

    public void setNotationFieldValue(NotationFieldValue notationFieldValue) {
        this.notationFieldValue = notationFieldValue;
    }
}


package com.sahambank.fccr.core.dto;

public class RisqueEntryDto {
    private ItemDto listValueItem;
    private ItemDto risqueValueItem;

    public ItemDto getListValueItem() {
        return listValueItem;
    }

    public void setListValueItem(ItemDto listValueItem) {
        this.listValueItem = listValueItem;
    }

    public ItemDto getRisqueValueItem() {
        return risqueValueItem;
    }

    public void setRisqueValueItem(ItemDto risqueValueItem) {
        this.risqueValueItem = risqueValueItem;
    }
}
package com.sahambank.fccr.core.service;

import com.sahambank.fccr.core.dto.ItemDto;
import com.sahambank.fccr.core.dto.NotationDto;
import com.sahambank.fccr.core.entities.Item;
import com.sahambank.fccr.core.entities.file.ProductData;

import java.util.List;
import java.util.Map;

public interface NotationService {
    Long save(NotationDto dto);

    Map<String, Item> mapToListValue(String s);

    List<RiskPairDto> getUniqueRisks(String clientCode, String productCode);

    class RiskPairDto {
        private ItemDto listValueItem;
        private ItemDto risqueValueItem;

        public RiskPairDto(ItemDto listValueItem, ItemDto risqueValueItem) {
            this.listValueItem = listValueItem;
            this.risqueValueItem = risqueValueItem;
        }

        public ItemDto getListValueItem() {
            return listValueItem;
        }

        public ItemDto getRisqueValueItem() {
            return risqueValueItem;
        }
    }
}

package com.sahambank.fccr.core.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.sahambank.fccr.core.entities.file.ProductData;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Entity
@Table(name = "notation")
public class Notation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(name = "segment_code", nullable = false, length = 100)
    private String segmentCode;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "notation", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<NotationFieldValue> fieldValues = new ArrayList<>();

    private String clientCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_data_id")
    private ProductData productData;
    public Notation() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSegmentCode() {
        return segmentCode;
    }

    public void setSegmentCode(String segmentCode) {
        this.segmentCode = segmentCode;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<NotationFieldValue> getFieldValues() {
        return fieldValues;
    }

    public void setFieldValues(List<NotationFieldValue> fieldValues) {
        this.fieldValues = fieldValues;
    }

    public ProductData getProductData() {
        return productData;
    }

    public void setProductData(ProductData productData) {
        this.productData = productData;
    }

    public String getClientCode() {
        return clientCode;
    }

    public void setClientCode(String clientCode) {
        this.clientCode = clientCode;
    }
}

package com.sahambank.fccr.core.entities;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "notation_field_value")
public class NotationFieldValue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "notation_id", nullable = false)
    @JsonBackReference
    private Notation notation;

    @Column(name = "field_configuration_id", nullable = false)
    private Long fieldConfigurationId;

    @Column(name = "field_code", nullable = false, length = 255)
    private String fieldCode;

    @Column(name = "fonction", nullable = true)
    private Boolean fonction;

    @Column(name = "fonctiontype", length = 100)
    private String fonctiontype;

    @OneToMany(mappedBy = "notationFieldValue", cascade = CascadeType.PERSIST)
    private List<RisqueEntry> risqueValueList;


    public NotationFieldValue() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Notation getNotation() {
        return notation;
    }

    public void setNotation(Notation notation) {
        this.notation = notation;
    }

    public Long getFieldConfigurationId() {
        return fieldConfigurationId;
    }

    public void setFieldConfigurationId(Long fieldConfigurationId) {
        this.fieldConfigurationId = fieldConfigurationId;
    }

    public String getFieldCode() {
        return fieldCode;
    }

    public void setFieldCode(String fieldCode) {
        this.fieldCode = fieldCode;
    }

    public Boolean getFonction() {
        return fonction;
    }

    public void setFonction(Boolean fonction) {
        this.fonction = fonction;
    }

    public String getFonctiontype() {
        return fonctiontype;
    }

    public void setFonctiontype(String fonctiontype) {
        this.fonctiontype = fonctiontype;
    }

    public List<RisqueEntry> getRisqueValueList() {
        return risqueValueList;
    }

    public void setRisqueValueList(List<RisqueEntry> risqueValueList) {
        this.risqueValueList = risqueValueList;
    }

}
package com.sahambank.fccr.core.entities;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;


@Entity
@Table(name = "risque_entry")
public class RisqueEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "list_value_item_id")
    private Item listValueItem;

    @ManyToOne
    @JoinColumn(name = "risque_value_item_id")
    private Item risqueValueItem;
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "field_value_id", nullable = false)
    private NotationFieldValue notationFieldValue;
    public RisqueEntry() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Item getListValueItem() {
        return listValueItem;
    }

    public void setListValueItem(Item listValueItem) {
        this.listValueItem = listValueItem;
    }

    public Item getRisqueValueItem() {
        return risqueValueItem;
    }

    public void setRisqueValueItem(Item risqueValueItem) {
        this.risqueValueItem = risqueValueItem;
    }

    public NotationFieldValue getNotationFieldValue() {
        return notationFieldValue;
    }

    public void setNotationFieldValue(NotationFieldValue notationFieldValue) {
        this.notationFieldValue = notationFieldValue;
    }
}


package com.sahambank.fccr.core.service.Impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sahambank.fccr.core.entities.file.ProductData;
import com.sahambank.fccr.core.repository.ProductDataRepository;
import com.sahambank.fccr.core.service.FileImportStrategy;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.io.IOException;

@Component
public class ProductImportStrategy implements FileImportStrategy {

    private final ProductDataRepository repository;
    private final ObjectMapper objectMapper;

    public ProductImportStrategy(ProductDataRepository repository, ObjectMapper objectMapper) {
        this.repository = repository;
        this.objectMapper = objectMapper;
    }

    @Override
    public String getType() {
        return "product";
    }

    @Override
    public void processLine(String line) throws IOException {
        if (!StringUtils.hasText(line)) {
            return;
        }

        ProductData incoming = objectMapper.readValue(line, ProductData.class);

        if (!StringUtils.hasText(incoming.getRctIdentifierClient())) {
            throw new IllegalArgumentException("rctIdentifierClient manquant dans la ligne : " + line);
        }

        ProductData product = repository
                .findFirstByRctIdentifierClient(incoming.getRctIdentifierClient())
                .map(existing -> {
                    // Mise à jour des champs
                    existing.setCustomerLocalization(incoming.getCustomerLocalization());
                    existing.setLocalIdentifierClient(incoming.getLocalIdentifierClient());
                    existing.setLocalDatabaseName(incoming.getLocalDatabaseName());
                    existing.setProductCode(incoming.getProductCode());
                    existing.setProductType(incoming.getProductType());
                    existing.setIssuingApplicationCode(incoming.getIssuingApplicationCode());
                    existing.setBookingEntityCode(incoming.getBookingEntityCode());
                    existing.setCollectMonth(incoming.getCollectMonth());
                    return existing;
                })
                .orElse(incoming); // Nouveau si pas trouvé

        repository.save(product);
    }


}
<nb-card accent="primary">
  <nb-card-header class="d-flex flex-row justify-content-between align-items-center">
 <h5 class="title-animation title-heading text-uppercase my-auto p-2"> 
      Notation
    </h5>
    
  </nb-card-header>
  <form [formGroup]="fieldForm" (ngSubmit)="submit()">
    <nb-card-body>
      <nb-form-field fullWidth>
        <nb-select fullWidth formControlName="segment" placeholder="Sélectionner un segment"
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
<div style="display: flex; align-items: center; ">
  <label style="min-width: 200px; margin: 20px;"> <strong> code client </strong> </label>
  <nb-form-field fullWidth style="flex: 1;">
    <input nbInput fullWidth formControlName="clientCode" placeholder=" Saisie Code client" />
  </nb-form-field>
</div>
<small class="error" *ngIf="fieldForm.get('clientCode')?.invalid && fieldForm.get('clientCode')?.touched">
  Ce champ est requis.
</small>


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
                <input nbInput fullWidth [formControlName]="'field_' + config.id" placeholder="Saisir texte" />
              </nb-form-field>
              <!-- DATE -->
              <ng-container *ngIf="true">
                <nb-form-field fullWidth *ngSwitchCase="'date'">
                  <input nbInput fullWidth placeholder="Sélectionner une date" [formControlName]="'field_' + config.id"
                    [nbDatepicker]="picker" />
                  <nb-datepicker #picker format="dd/MM/yyyy"></nb-datepicker>
                </nb-form-field>
              </ng-container>
              <!-- SELECT -->
              <nb-form-field fullWidth *ngSwitchCase="'select'">
                <nb-select fullWidth [formControlName]="'field_' + config.id" placeholder="Sélectionner…" multiple>
                  <nb-option *ngFor="let opt of config.risqueValueList" [value]="opt.risqueValueItem.id">
                    {{ opt.listValueItem.libelle }}
                  </nb-option>
                </nb-select>
              </nb-form-field>

              <!-- BOOLEAN -->
              <nb-form-field fullWidth *ngSwitchCase="'boolean'">
                <nb-select fullWidth [formControlName]="'field_' + config.id">
                  <nb-option [value]="true">Oui</nb-option>
                  <nb-option [value]="false">Non</nb-option>
                </nb-select>
              </nb-form-field>
            </ng-container>
          </div>
        </nb-card-body>
      </nb-card>
    </ng-container>
    <nb-card class="">
      <nb-card-body class="actions">
        <button nbButton status="primary" type="submit">
          <nb-icon icon="checkmark-outline"></nb-icon>
          Valider
        </button>

      </nb-card-body>
    </nb-card>



  </form>
</nb-card>
<!-- <pre>{{ fieldForm.value | json }}</pre> -->
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbToastrService, NbGlobalPhysicalPosition } from '@nebular/theme';
import { GestionReferentielsService } from '../../gestion-referentiel/services/gestion-referentiels.service';
import { Referentiel } from 'src/app/core/models/Referentiel';
import { ReferentielTypes } from '../../traitement-demande/model/fieldConfig';
import { NotationService } from '../notation.service';
import { SegmentDtoVues } from '../model/segementDtoVue';
import { FiledValueDto, NotationDto, SegmentSaveDTO } from '../model/NotationsDto';

@Component({
  standalone: false,
  selector: 'app-add-notation',
  templateUrl: './add-notation.component.html',
  styleUrls: ['./add-notation.component.scss'],
})
export class AddNotationComponent implements OnInit {
  fieldForm!: FormGroup;
  selectedRef = 'segments';
  referentiels$!: Referentiel[];
  referentielTypes: ReferentielTypes[] = [];
  segement: SegmentDtoVues = {} as SegmentDtoVues;

  constructor(
    private fb: FormBuilder,
    private toasterService: NbToastrService,
    private serviceRef: GestionReferentielsService,
    private notationService: NotationService
  ) {
    this.referentielTypes = [
      { value: 'segments', label: 'Segment', hasExpression: false },
      { value: 'areas', label: 'Area', hasExpression: false },
      { value: 'listValues', label: 'List Value', hasExpression: true },
      { value: 'listValueItems', label: 'List Value Item', hasExpression: false },
      { value: 'risqueValueLists', label: 'Risque Value', hasExpression: false },
      { value: 'risqueValueItems', label: 'Risque Value Item', hasExpression: false },
    ];

    this.fieldForm = this.fb.group({
      segment: ['', Validators.required],
      clientCode: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.serviceRef.getReferentiel(this.selectedRef).subscribe((data) => {
      this.referentiels$ = data;
    });
  }

  onSegementChange(event: any) {
    const selectedId = event?.id || event;
    const clientCodeValue = this.fieldForm.get('clientCode')?.value || '';

    this.notationService.getSegmentById(selectedId).subscribe({
      next: (response) => {
        this.segement = response;
        console.log('Segment chargé ', this.segement);

        this.fieldForm = this.fb.group({
          segment: [selectedId, Validators.required],
          clientCode: [clientCodeValue, Validators.required],
        });

        for (const area of this.segement.areas) {
          for (const config of area.fieldConfigurations) {
            const controlName = `field_${config.id}`;
            let initialValue: any;
            switch (config.type) {
              case 'select':
                initialValue = [];
                break;
              case 'boolean':
              case 'date':
                initialValue = null;
                break;
              default:
                initialValue = '';
            }
            this.fieldForm.addControl(
              controlName,
              this.fb.control(initialValue, Validators.required)
            );
          }
        }
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du segment :', err);
      },
    });
  }

  submit(): void {
    if (this.fieldForm.invalid) {
      this.toasterService.danger(
        'Veuillez remplir tous les champs obligatoires.',
        'Formulaire incomplet',
        {
          status: 'danger',
          duration: 4000,
          destroyByClick: true,
          position: NbGlobalPhysicalPosition.TOP_RIGHT,
          preventDuplicates: true,
        }
      );
      this.fieldForm.markAllAsTouched();
      return;
    }

    const formValues = this.fieldForm.value;

    const segmentSave: SegmentSaveDTO = {
      id: this.segement.id,
      code: this.segement.code,
      libelle: this.segement.libelle,
    };

    const payload: NotationDto = {
      SEGMENT: segmentSave,
      fieldConfigurations: [],
      clientCode: formValues.clientCode, 
    };

    for (const area of this.segement.areas) {
      for (const config of area.fieldConfigurations) {
        const controlName = `field_${config.id}`;
        const value = formValues[controlName];

        const fieldDto: FiledValueDto = {
          id: config.id,
          code: config.code,
          fonction: config.fonction,
          fonctionType: config.fonctionType,
          risqueValueList: [],
        };

        // SELECT MULTIPLE
        if (config.type === 'select' && Array.isArray(value)) {
          for (const selectedId of value) {
            const entry = config.risqueValueList.find(
              (r) => r.risqueValueItem.id === selectedId
            );
            if (entry) {
              fieldDto.risqueValueList.push({
                listValueItem: entry.listValueItem,
                risqueValueItem: entry.risqueValueItem,
              });
            }
          }
        }

        
        // BOOLEAN, TEXT, DATE
        else if (value !== null && value !== undefined && value !== '') {
          fieldDto.risqueValueList.push({
            risqueValueItem: {
              code: String(value),
              libelle: String(value),
            },
          });
        }

        payload.fieldConfigurations.push(fieldDto);
      }
    }

    console.log('Payload envoyé au back ', payload);

    this.notationService.saveNotation(payload).subscribe({
      next: () => {
        this.toasterService.success('Notation ajoutée avec succès ', 'Succès', {
          status: 'success',
          duration: 3000,
          destroyByClick: true,
          position: NbGlobalPhysicalPosition.TOP_RIGHT,
          preventDuplicates: true,
        });
        this.fieldForm.reset();
      },
      error: (err) => {
        console.error("Erreur lors de l'envoi de la notation :", err);
        this.toasterService.danger("Échec de l'ajout de la notation ", 'Erreur', {
          status: 'danger',
          duration: 3000,
          destroyByClick: true,
          position: NbGlobalPhysicalPosition.TOP_RIGHT,
          preventDuplicates: true,
        });
      },
    });
  }
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////:::
///////////////////////////////////
@Service
public class NotationServiceImpl implements NotationService {

    private final NotationRepository notationRepository;
    private final ItemRepository itemRepository;
    private final ProductDataRepository productDataRepository;
    private final RisqueEntryRepository risqueEntryRepository;
    private final RisqueEntryMapper risqueEntryMapper;

    public NotationServiceImpl(NotationRepository notationRepository,
                               ItemRepository itemRepository,
                               ProductDataRepository productDataRepository,
                               RisqueEntryRepository risqueEntryRepository,
                               RisqueEntryMapper risqueEntryMapper) {
        this.notationRepository = notationRepository;
        this.itemRepository = itemRepository;
        this.productDataRepository = productDataRepository;
        this.risqueEntryRepository = risqueEntryRepository;
        this.risqueEntryMapper = risqueEntryMapper;
    }

    private static boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }

    // Ne jette plus d’exception : renvoie Optional pour permettre le fallback
    private Optional<ProductData> resolveOptionalProductData(String clientCode) {
        String currentMonth = YearMonth.now().toString(); // YYYY-MM
        return productDataRepository
                .findByRctIdentifierClientAndCollectMonth(clientCode, currentMonth)
                .or(() -> productDataRepository.findTopByRctIdentifierClientOrderByCollectMonthDesc(clientCode));
    }

    // Charge l’historique ProductData sur 12 mois (si disponible), puis récupère les risques liés au client
    // et mappe en DTO. On garde ça simple côté requêtes.
    private List<RisqueEntryDto> loadBackendRiskDtosForClientLast12Months(String clientCode) {
        String sinceMonth = YearMonth.now().minusMonths(11).toString();
        List<ProductData> historiques = productDataRepository.findAllSinceMonth(clientCode, sinceMonth);
        if (historiques == null || historiques.isEmpty()) {
            return Collections.emptyList();
        }
        // La requête findFirstByRctIdentifierClient renvoie les risques du client (nom mal choisi)
        // On les mappe une seule fois pour éviter les doublons par itérations.
        List<RisqueEntry> risques = risqueEntryRepository.findFirstByRctIdentifierClient(clientCode);
        if (risques == null || risques.isEmpty()) {
            return Collections.emptyList();
        }
        return risques.stream()
                .map(risqueEntryMapper::fromRisqueEntryToDTO)
                .filter(Objects::nonNull)
                .toList();
    }

    // Clé de dédoublonnage
    private String keyOf(RisqueEntryDto r) {
        String listCode = (r.getListValueItem() != null && r.getListValueItem().getCode() != null)
                ? r.getListValueItem().getCode() : "";
        String riskCode = (r.getRisqueValueItem() != null && r.getRisqueValueItem().getCode() != null)
                ? r.getRisqueValueItem().getCode() : "";
        return listCode + "|" + riskCode;
    }

    // Fusion sans doublons. Priorité "back" (données produit) par défaut, puis "front".
    private List<RisqueEntryDto> mergeFrontBackDistinct(List<RisqueEntryDto> front, List<RisqueEntryDto> back) {
        Map<String, RisqueEntryDto> unique = new LinkedHashMap<>();
        if (back != null) {
            for (RisqueEntryDto r : back) {
                if (r != null) unique.put(keyOf(r), r);
            }
        }
        if (front != null) {
            for (RisqueEntryDto r : front) {
                if (r != null) unique.putIfAbsent(keyOf(r), r);
            }
        }
        return new ArrayList<>(unique.values());
    }

    // Transforme les DTOs en entités RisqueEntry et relie au fieldValue
    private List<RisqueEntry> mapToEntities(List<RisqueEntryDto> dtos, NotationFieldValue fv) {
        if (dtos == null) return Collections.emptyList();
        return dtos.stream().map(r -> {
            RisqueEntry emb = new RisqueEntry();
            if (r.getListValueItem() != null && !isBlank(r.getListValueItem().getCode())) {
                emb.setListValueItem(resolveItemByCodeOrCreate(r.getListValueItem().getCode(), r.getListValueItem().getLibelle()));
            }
            if (r.getRisqueValueItem() != null && !isBlank(r.getRisqueValueItem().getCode())) {
                emb.setRisqueValueItem(resolveItemByCodeOrCreate(r.getRisqueValueItem().getCode(), r.getRisqueValueItem().getLibelle()));
            }
            emb.setNotationFieldValue(fv);
            return emb;
        }).collect(Collectors.toList());
    }

    private Item resolveItemByCodeOrCreate(String code, String libelle) {
        return itemRepository.findByCode(code).orElseGet(() -> {
            Item item = new Item();
            item.setCode(code);
            item.setLibelle(libelle);
            return itemRepository.save(item);
        });
    }

    @Transactional
    @Override
    public Long save(NotationDto dto) {
        if (dto == null) throw new IllegalArgumentException("NotationDto is required");
        if (dto.getSEGMENT() == null || isBlank(dto.getSEGMENT().getCode()))
            throw new IllegalArgumentException("SEGMENT and SEGMENT.code are required");
        if (isBlank(dto.getClientCode()))
            throw new IllegalArgumentException("clientCode is required");

        // On n’échoue plus si ProductData absent
        Optional<ProductData> productDataOpt = resolveOptionalProductData(dto.getClientCode());

        Notation notation = new Notation();
        notation.setSegmentCode(dto.getSEGMENT().getCode());
        notation.setClientCode(dto.getClientCode());
        notation.setProductData(productDataOpt.orElse(null)); // rattache si disponible, sinon null

        List<NotationFieldValue> fieldValues = new ArrayList<>();

        if (dto.getFieldConfigurations() != null) {
            // Pré-chargement des risques back (réutilisé pour tous les champs "Produit")
            List<RisqueEntryDto> backendDtosCache = null;

            for (FiledValueDto f : dto.getFieldConfigurations()) {
                if (f == null) continue;

                NotationFieldValue fv = new NotationFieldValue();
                fv.setFieldConfigurationId(f.getId());
                fv.setFieldCode(f.getCode());
                fv.setFonction(f.getFonction());
                fv.setFonctiontype(f.getFonctionType());
                fv.setNotation(notation);

                List<RisqueEntry> risqueEntries;

                boolean isProduitFn = Boolean.TRUE.equals(f.getFonction())
                        && "Produit".equalsIgnoreCase(f.getFonctionType());

                if (isProduitFn) {
                    if (backendDtosCache == null) {
                        backendDtosCache = loadBackendRiskDtosForClientLast12Months(dto.getClientCode());
                    }
                    List<RisqueEntryDto> frontDtos = (f.getRisqueValueList() != null) ? f.getRisqueValueList() : Collections.emptyList();
                    List<RisqueEntryDto> fusion = mergeFrontBackDistinct(frontDtos, backendDtosCache);
                    risqueEntries = mapToEntities(fusion, fv);

                } else {
                    // Cas normal: on prend le front, en dédoublonnant
                    List<RisqueEntryDto> frontDtos = (f.getRisqueValueList() != null) ? f.getRisqueValueList() : Collections.emptyList();
                    // Dédoublonne via Map
                    Map<String, RisqueEntryDto> unique = new LinkedHashMap<>();
                    for (RisqueEntryDto r : frontDtos) {
                        if (r != null) unique.put(keyOf(r), r);
                    }
                    risqueEntries = mapToEntities(new ArrayList<>(unique.values()), fv);
                }

                fv.setRisqueValueList(risqueEntries);
                fieldValues.add(fv);
            }
        }

        notation.setFieldValues(fieldValues);

        // Si ProductData présent, rattacher la notation pour cohérence objet (optionnel)
        productDataOpt.ifPresent(pd -> pd.getNotations().add(notation));

        // Cascade vers FieldValues et RisqueEntries
        notationRepository.save(notation);

        return notation.getId();
    }

    @Override
    public Map<String, Item> mapToListValue(String clientCode) {
        Map<String, Item> resultMap = new HashMap<>();
        Optional<ProductData> productDataOpt = productDataRepository.findFirstByRctIdentifierClient(clientCode);
        if (productDataOpt.isEmpty()) {
            return resultMap;
        }
        ProductData productData = productDataOpt.get();
        // Attention: cette méthode réduit à un seul Item par client; si besoin, retourner une liste
        for (Notation n : productData.getNotations()) {
            for (NotationFieldValue fv : n.getFieldValues()) {
                for (RisqueEntry re : fv.getRisqueValueList()) {
                    resultMap.put(productData.getRctIdentifierClient(), re.getRisqueValueItem());
                }
            }
        }
        return resultMap;
    }

    @Override
    public List<RiskPairDto> getUniqueRisks(String clientCode, String productCode) {
        List<RisqueEntry> entries = risqueEntryRepository.findByClientAndProduct(clientCode, productCode);
        Map<String, RiskPairDto> unique = new LinkedHashMap<>();
        for (RisqueEntry e : entries) {
            Item list = e.getListValueItem();
            Item risk = e.getRisqueValueItem();

            String listCode = list != null ? list.getCode() : "";
            String riskCode = risk != null ? risk.getCode() : "";
            String key = listCode + "|" + riskCode;

            if (!unique.containsKey(key)) {
                ItemDto listDto = new ItemDto();
                if (list != null) {
                    listDto.setCode(list.getCode());
                    listDto.setLibelle(list.getLibelle());
                }
                ItemDto riskDto = new ItemDto();
                if (risk != null) {
                    riskDto.setCode(risk.getCode());
                    riskDto.setLibelle(risk.getLibelle());
                }
                unique.put(key, new RiskPairDto(listDto, riskDto));
            }
        }
        return new ArrayList<>(unique.values());
    }
}






