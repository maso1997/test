
besoin ::::: 'ai cree fonction si cette fonction est coche je doit a prendre on consideration l'elment choisi dans la liste exemple caqlcule produit je doit prendre le risque de cette de chaque value iteme choisit et je l'ajoute avec un exele que je veux te fournit je veux le merger avec les de l'exel prend le plus eleve de les derniere 12 mois quand je fait le save de cette objet parce que ce n'est pas fonctionne on s'abmit att je te donne le code pour mieu comprendre ok



public class Segment {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(nullable = false, length = 100, unique = true)
        private String code ;

        @Column(nullable = false, length = 255)
        private String libelle;

        @OneToMany(
            mappedBy = "segment",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
        )
        private List<Area> areas = new ArrayList<>();


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
      private Long id;
    private String code;
    private String libelle;
    private List<RisqueItemWeightDto> weights;

    
public class RisqueItemWeightDto {
        private Long id;
        private int weightL;
        private int weightMl;
        private int weightMh;
        private Long risqueValueItemDtoId;
        private Long fieldConfigDtoId;
        private Long areaId;

// mapper

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
                if(config.getRisqueValueList().getId()!= null){
                    fieldDto.setRisqueValueId(config.getRisqueValueList().getId());

                }else{
                    fieldDto.setRisqueValueId(null);

                }
                fieldDto.setSearchable(config.isSearchable());

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
                            RisqueValueItem risqueEntity = item.getRisqueValueItem();

                            RisqueValueItemVueDto risqueItemDto = new RisqueValueItemVueDto();
                            risqueItemDto.setId(risqueEntity.getId());
                            risqueItemDto.setCode(risqueEntity.getCode());
                            risqueItemDto.setLibelle(risqueEntity.getLibelle());

                            // Poids : liste de RisqueItemWeightDto
                            List<RisqueItemWeightDto> poidsDtos = new ArrayList<>();
                            if (risqueEntity.getWeights() != null) {
                                for (RisqueItemWeight poids : risqueEntity.getWeights()) {
                                    RisqueItemWeightDto poidsDto = new RisqueItemWeightDto();
                                    poidsDto.setId(poids.getId());
                                    poidsDto.setWeightL(poids.getWeightL());
                                    poidsDto.setWeightMl(poids.getWeightMl());
                                    poidsDto.setWeightMh(poids.getWeightMh());
                                    poidsDto.setAreaId(poids.getArea() != null ? poids.getArea().getId() : null);
                                    poidsDto.setFieldConfigDtoId(poids.getFieldConfiguration() != null ? poids.getFieldConfiguration().getId() : null);
                                    poidsDto.setRisqueValueItemDtoId(risqueEntity.getId());

                                    poidsDtos.add(poidsDto);
                                }
                            }
                            risqueItemDto.setWeights(poidsDtos);
                            itemDto.setRisqueValueItem(risqueItemDto);
                        }

                        risqueDtos.add(itemDto);
                        fieldDto.setRisqueValueList(risqueDtos);

                    }
                }

                fieldDtos.add(fieldDto);
            }

            areaDto.setFieldConfigurations(fieldDtos);
            areasDtoList.add(areaDto);
        }

        dto.setAreas(areasDtoList);
        return dto;
    }
/// service




package com.sahambank.fccr.core.service.Impl;

import com.sahambank.fccr.core.dto.searchSegments.SegmentsDto;
import com.sahambank.fccr.core.dto.segment.SegmentCreateDTO;
import com.sahambank.fccr.core.dto.segment.SegmentDTO;
import com.sahambank.fccr.core.dto.segment.SegmentDtoVues;
import com.sahambank.fccr.core.entities.Area;
import com.sahambank.fccr.core.entities.Segment;
import com.sahambank.fccr.core.exception.ResourceNotFoundException;
import com.sahambank.fccr.core.mapper.SegmentMapper;
import com.sahambank.fccr.core.repository.AreaRepository;
import com.sahambank.fccr.core.repository.SegmentRepository;
import com.sahambank.fccr.core.service.ISegmentService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SegmentServiceImpl implements ISegmentService {

    private final SegmentRepository segmentRepository;
    private final AreaRepository areaRepository;
    private final SegmentMapper segmentMapper;

    public SegmentServiceImpl(SegmentRepository segmentRepository, AreaRepository areaRepository, SegmentMapper segmentMapper) {
        this.segmentRepository = segmentRepository;
        this.areaRepository = areaRepository;
        this.segmentMapper = segmentMapper;
    }


    public List<SegmentDTO> findAll() {
        return segmentRepository.findAll().stream()
                .map(segmentMapper::toDto)
                .collect(Collectors.toList());
    }

    public SegmentDtoVues findById(Long id) {
        Segment segment = segmentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Segment introuvable pour id=" + id));
        return segmentMapper.toDtoVue(segment);
    }

    public SegmentCreateDTO create(SegmentCreateDTO dto) {
        Optional<Segment>segment = segmentRepository.findByCode(dto.getCode());
        if(segment.isPresent()){
            throw new ResourceNotFoundException("rrr");
        }
        return segmentMapper.toCreateDto(segmentRepository.save(segmentMapper.toEntityCreate(dto)));
    }

    public SegmentCreateDTO update(Long id, SegmentCreateDTO dto) {
        Segment existing = segmentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Segment introuvable pour id=" + id));
        existing.setCode(dto.getCode());
        existing.setLibelle(dto.getLibelle());
        Segment updated = segmentRepository.save(existing);
        return segmentMapper.toCreateDto(updated);
    }

    public void delete(Long id) {
        if (!segmentRepository.existsById(id)) {
            throw new RuntimeException("Impossible de supprimer : Segment introuvable pour id=" + id);
        }
        segmentRepository.deleteById(id);
    }

    private Segment getSegmentArea(SegmentDTO segmentDTO , Segment segment){

        List<Area>areas = new ArrayList<>();
        segmentDTO.getAreasId().forEach(areaId -> {
            Optional<Area> area = areaRepository.findById(areaId);
            if(area.isPresent()){
                areas.add(area.get());
            }else {
                throw  new ResourceNotFoundException("this area does not exist");
            }

        });
        segment.setAreas(areas);
        return segment;
    }
    @Override
    public List<SegmentsDto> searchAll() {
        return segmentRepository.findAll().stream()
                .map(segmentMapper::toSearchDto)
                .collect(Collectors.toList());
    }
}




//filed config //

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

public class FieldConfigurationSearchDto {

    private Long id;
    private String code;
    private String libelle;
    private String type;
    private ListSearchValueDto listValueDTO;
    private RisqueValueListSearchDTO risqueValueListDTO;
    private String expression;

//public class FieldConfigVueDto {
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

package com.sahambank.fccr.core.service.Impl;

import com.sahambank.fccr.core.entities.*;
import com.sahambank.fccr.core.mapper.AreaMapper;
import com.sahambank.fccr.core.mapper.FieldConfigurationMapper;
import com.sahambank.fccr.core.mapper.ListValueMapper;
import com.sahambank.fccr.core.mapper.RisqueValueListMapper;
import com.sahambank.fccr.core.dto.FieldConfig.FieldConfigurationDTO;
import com.sahambank.fccr.core.repository.AreaRepository;
import com.sahambank.fccr.core.repository.FieldConfigurationRepository;
import com.sahambank.fccr.core.repository.ListValueRepository;
import com.sahambank.fccr.core.repository.RisqueValueListRepository;
import com.sahambank.fccr.core.dto.FieldConfigurationCreateDTO;
import com.sahambank.fccr.core.repository.*;
import com.sahambank.fccr.core.service.IFieldConfigurationService;
import io.fabric8.kubernetes.client.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FieldConfigurationServiceImpl implements IFieldConfigurationService {

    private final FieldConfigurationRepository repository;
    private final FieldConfigurationMapper mapper;
    private final ListValueMapper listValueMapper;
    private final ListValueRepository listValueRepository;
    private final ValueItemRisqueItemRepository valueItemRisqueItemRepository;
    private final ListValueItemRepository listValueItemRepository;
    private final RisqueValueItemRepository risqueValueItemRepository;
    private final RisqueValueListRepository risqueValueListRepository;
    private final RisqueValueListMapper risqueValueListMapper;
    private final AreaMapper areaMapper;
    private final AreaRepository areaRepository;

    public FieldConfigurationServiceImpl(FieldConfigurationRepository repository, FieldConfigurationMapper mapper,
                                         ListValueMapper listValueMapper, ListValueRepository listValueRepository, ValueItemRisqueItemRepository valueItemRisqueItemRepository, ListValueItemRepository listValueItemRepository, RisqueValueItemRepository risqueValueItemRepository, RisqueValueListRepository risqueValueListRepository, RisqueValueListMapper risqueValueListMapper, AreaMapper areaMapper, AreaRepository areaRepository) {
        this.repository = repository;
        this.mapper = mapper;
        this.listValueMapper = listValueMapper;
        this.listValueRepository = listValueRepository;
        this.valueItemRisqueItemRepository = valueItemRisqueItemRepository;
        this.listValueItemRepository = listValueItemRepository;
        this.risqueValueItemRepository = risqueValueItemRepository;
        this.risqueValueListRepository = risqueValueListRepository;
        this.risqueValueListMapper = risqueValueListMapper;
        this.areaMapper = areaMapper;
        this.areaRepository = areaRepository;
    }

    public List<FieldConfigurationDTO> findAll() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }


    public FieldConfigurationDTO findById(Long id) {
        FieldConfiguration entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("FieldConfiguration introuvable pour id=" + id));
        return mapper.toDto(entity);
    }
    @Transactional
    public FieldConfigurationDTO create(FieldConfigurationCreateDTO dto) {
        FieldConfiguration field = mapper.toEntityCreate(dto);
        FieldConfiguration saved = repository.save(getField(dto, field));
        return mapper.toDto(saved);
    }


    private List<ValueItemRisqueItem> typeFields(FieldConfigurationCreateDTO dto,FieldConfiguration fieldConfiguration){
        List<ValueItemRisqueItem> valueItemRisqueItems = new ArrayList<>();
        dto.getRisqueItemsValues().forEach(typeField -> {
            Optional<ListValueItem> listValueItem = listValueItemRepository.findById(typeField.getValueItemId());
            Optional<RisqueValueItem> risqueValueList = risqueValueItemRepository.findById(typeField.getRiskId());
            ValueItemRisqueItem valueItemRisqueItem = new ValueItemRisqueItem();
            valueItemRisqueItem.setListValueItem(listValueItem.get());
            valueItemRisqueItem.setRisqueValueItem(risqueValueList.get());
            valueItemRisqueItem.setFieldConfiguration(fieldConfiguration);
            valueItemRisqueItems.add(valueItemRisqueItem);

        });
        return valueItemRisqueItems;
    }

    private FieldConfiguration getField(FieldConfigurationCreateDTO dto, FieldConfiguration fieldConfiguration) {
       if(dto.getValueId() != null){
        Optional<ListValue> values = listValueRepository.findById(dto.getValueId());
        if (values.isPresent()) {
            fieldConfiguration.setValueList(values.get());
        } else {
            throw new ResourceNotFoundException("value does not exist");
        }

        Optional<RisqueValueList> risque = risqueValueListRepository.findById(dto.getRisqueValueId());
        if (risque.isPresent()) {
            fieldConfiguration.setRisqueValueList(risque.get());
        } else {
            throw new ResourceNotFoundException("risque does not exist");
        }

        fieldConfiguration.setValueItemRisqueItem( typeFields(dto,fieldConfiguration));
       }else {
           fieldConfiguration.setCustomBloc(dto.getCustomBloc());

       }
        return fieldConfiguration;
    }

    public FieldConfigurationDTO update(Long id, FieldConfigurationCreateDTO dto) {
        FieldConfiguration existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("FieldConfiguration introuvable pour id=" + id));

        existing.setCode(dto.getCode());
        existing.setLibelle(dto.getLibelle());
        existing.setType(dto.getType());
        getField(dto, existing);

        FieldConfiguration updated = repository.save(existing);
        return mapper.toDto(updated);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Suppression impossible : FieldConfiguration introuvable pour id=" + id);
        }
        repository.deleteById(id);
    }
    @Override
    public List<FieldConfigurationDTO> searchAll(List<Long> areaIds) {
        if (areaIds == null || areaIds.isEmpty()) {
            throw new IllegalArgumentException("Liste des areas vide.");
        }

        List<FieldConfiguration> configs = repository.findByAreaIds(areaIds);
        return configs.stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

}

// front notation .////


<nb-card accent="danger">
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

    <ng-container *ngFor="let area of segement.areas">
      <nb-card class="area-card">
        <nb-card-header accent="danger"  class="areatit">
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
                <input fullWidth nbInput [formControlName]="'value' " placeholder="Saisir texte" />
              </nb-form-field>

              <nb-form-field fullWidth *ngSwitchCase="'date'">
                <input nbInput fullWidth placeholder="Sélectionner une date" formControlName="value"
                  [nbDatepicker]="picker" />

                <nb-datepicker #picker></nb-datepicker>
              </nb-form-field>


              <!-- SELECT -->
              <nb-form-field fullWidth *ngSwitchCase="'select'">
                <nb-select  fullWidth [formControlName]="'value'" placeholder="Sélectionner…" multiple>
                  <nb-option fullWidth *ngFor="let opt of config.risqueValueList" [value]="opt.risqueValueItem.id">
                    {{ opt.listValueItem.libelle }}
                  </nb-option>
                </nb-select>
              </nb-form-field>

              <!-- BOOLEAN -->
              <nb-form-field fullWidth *ngSwitchCase="'boolean'">
                <nb-select fullWidth [formControlName]="'value'">
                  <nb-option fullWidth [value]="true">Oui</nb-option>
                  <nb-option fullWidth [value]="false">Non</nb-option>
                </nb-select>
              </nb-form-field>

            </ng-container>

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
 

}
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

// champs ////



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
            Fonction
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
    if (type === 'text') {
      this.fieldForm.get('valueId')?.clearValidators();
      this.fieldForm.get('risqueValueId')?.clearValidators();
      this.fieldForm.get('risqueItemsValues')?.clearValidators();
      //this.fieldForm.get('customBloc')?.setValidators(Validators.required);
    } else if(type ==="select") {
      this.fieldForm.get('valueId')?.setValidators(Validators.required);
      this.fieldForm.get('risqueValueId')?.setValidators(Validators.required);
      this.fieldForm.get('risqueItemsValues')?.setValidators(Validators.required);
      this.fieldForm.get('customBloc')?.clearValidators();
    }else if(type ==="date") {
      this.fieldForm.get('valueId')?.clearValidators();
      this.fieldForm.get('risqueValueId')?.clearValidators();
      this.fieldForm.get('risqueItemsValues')?.clearValidators();
      this.fieldForm.get('customBloc')?.clearValidators();
      //this.fieldForm.get('dateBloc')?.setValidators(Validators.required);

    }
    else  {
      this.fieldForm.get('valueId')?.clearValidators();
      this.fieldForm.get('risqueValueId')?.clearValidators();
      this.fieldForm.get('risqueItemsValues')?.clearValidators();
      this.fieldForm.get('customBloc')?.clearValidators();
      this.fieldForm.get('dateBloc')?.clearValidators();
      //this.fieldForm.get('selectBoolean')?.setValidators(Validators.required);

    }
    Object.values(this.fieldForm.controls).forEach(ctrl => ctrl.updateValueAndValidity());
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



export interface ListValueItemDTO {
  id: number;
  code: string;
  libelle: string;
  valueId:number


}
export interface RisqueValueItemDTO {
  id: number | string;
  code: string;
  libelle: string;
}
export interface FieldConfigurationDTO {
  id: number;
  code: string;
  libelle: string;
  type: string;
  valueId: number;
  expression: string;
  areasId: Set<number>;
  risqueValueId: number;
  areaId:number[]
}


////service utilise dans champs////

import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiResponse, AreaDTO, AreaSearchDTO, FieldConfigurationDTO, SegmentDTO} from "../model/fieldConfig";

@Injectable({
  providedIn: 'root'
})
export class AreaServiceService {

  private readonly API: string = `${environment.api.url}`;
  constructor(private http: HttpClient) {
  }
  public getAreas(id:number): Observable<Array<AreaDTO>> {
    return this.http.get<Array<AreaDTO>>(this.API + "areas/search/" + id)
  }
  getFields(): Observable<FieldConfigurationDTO[]> {
    return this.http.get<FieldConfigurationDTO[]>(`${this.API}field-configurations`);
  }

 /* getFields(ids: number[]): Observable<FieldConfigurationDTO[]> {
    const params = new HttpParams().set('ids', ids.join(','));
    return this.http.get<FieldConfigurationDTO[]>(`${this.API}fields/search`, { params });
  }*/


  saveAreaFields(payload: { fieldConfigurationIds: number[]; areaId: number | null }):Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.API + 'areas/associate-fields', payload);
  }
}



////service////



import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AreaDTO, FieldConfigurationDTO, ListValueDTO, ListValueItemDTO, RisqueValueItemDTO, RisqueValueListDTO } from '../traitement-demande/model/fieldConfig';
import { environment } from 'src/environments/environment';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TraitementsService {

  private apiUrl = environment.api.url

  constructor(private http: HttpClient) {}

getAllValues(): Observable<ListValueDTO[]> {
    return this.http.get<ListValueDTO[]>(this.apiUrl+"list-values");
  }

getValueItemSearch(dto: ListValueDTO): Observable<ListValueItemDTO[]> {
    return this.http.post<ListValueItemDTO[]>(this.apiUrl+"list-value-items/search", dto);
  }

  getAllRisque(): Observable<RisqueValueItemDTO[]> {
    return this.http.get<RisqueValueItemDTO[]>(this.apiUrl+"risque-value-lists");
  }

    getAllRisqueSearch(dto: RisqueValueItemDTO): Observable<RisqueValueItemDTO[]> {
    return this.http.post<RisqueValueItemDTO[]>(this.apiUrl+"risque-value-items/search",dto);
    }

    createConfig(dto: any): Observable<any[]> {
    return this.http.post<any[]>(this.apiUrl+"field-configurations",dto);
    }


      getAllAreas(): Observable<AreaDTO[]> {
    return this.http.get<any[]>(this.apiUrl+"areas");
  }



}



////service utilise dans notation////
import { RisqueValueListDTO } from '../../features/traitement-demande/model/fieldConfig';
export interface Referentiel {
  id:number
  code:string
  libelle:string
  expression: string;
  segementId?: number;
  valueId?: number;
  risqueValueListsId?:number;
  risqueValueId?:number;
}
export interface ReferentielTypes{
  value : string;
  label : string;
  hasExpression : boolean;
}

import { AreasVueDto } from "./areaVue";

export interface SegmentDtoVues {
  id: number;
  code: string;
  libelle: string;
  areas: AreasVueDto[];
}
import { FieldConfigVueDto } from "./fieldConfiguration";

export interface AreasVueDto {
  id: number;
  code: string;
  libelle: string;
  fieldConfigurations: FieldConfigVueDto[];
}

import { ValueItemRisqueItemVueDto } from "./valueItemRisqueItemVueDto";

export interface FieldConfigVueDto {
  id: number;
  code: string;
  libelle: string;
  type: string;
  expression: string;
  selected: boolean;
  searchable:boolean;
  customBloc:string;
  dateBloc: Date;
  risqueValueId:number;
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
architecture proposée.

Backend Java (Spring Boot, JPA)

Entités

@Entity
@Table(name = "notations")
public class Notation {
@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "segment_id")
private Segment segment;

private LocalDateTime dateSaisie;
private BigDecimal totalScore;

@OneToMany(mappedBy = "notation", cascade = CascadeType.ALL, orphanRemoval = true)
private List<NotationValue> values = new ArrayList<>();

// getters/setters
}

@Entity
@Table(name = "notation_values")
public class NotationValue {
@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "notation_id")
private Notation notation;

@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "field_configuration_id")
private FieldConfiguration fieldConfiguration;

private String type; // text | date | boolean | select
private String rawValue; // ISO string / boolean as string / text
private BigDecimal score; // score partiel du champ

@OneToMany(mappedBy = "notationValue", cascade = CascadeType.ALL, orphanRemoval = true)
private List<NotationValueSelect> selects = new ArrayList<>();

// getters/setters
}

@Entity
@Table(name = "notation_value_selects")
public class NotationValueSelect {
@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "notation_value_id")
private NotationValue notationValue;

@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "list_value_item_id")
private ListValueItem listValueItem;

@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "risque_value_item_id")
private RisqueValueItem risqueValueItem;

private BigDecimal weightApplied;
private BigDecimal score;

// getters/setters
}

DTOs

public class NotationItemCreateDTO {
private Long fieldConfigurationId;
private String type; // text | date | boolean | select
private String value; // pour text/date/boolean (stringifié)
private List<Long> selectedValueItemIds; // pour select
// getters/setters
}

public class NotationCreateDTO {
private Long segmentId;
private List<NotationItemCreateDTO> items;
// getters/setters
}

public class NotationDTO {
private Long id;
private Long segmentId;
private BigDecimal totalScore;
private LocalDateTime dateSaisie;
// getters/setters
}

Repositories

public interface NotationRepository extends JpaRepository<Notation, Long> {}
public interface NotationValueRepository extends JpaRepository<NotationValue, Long> {}
public interface NotationValueSelectRepository extends JpaRepository<NotationValueSelect, Long> {}

Services (poids + fonction sont mockés pour l’exemple)

@Service
public class WeightService {
public BigDecimal findWeight(FieldConfiguration fc, Long riskId) {
// TODO: récupérer le poids réel depuis la config/BDD
return BigDecimal.ONE; // défaut = 1
}
}

@Service
public class FonctionService {
// Retourne un multiplicateur selon la fonction et data externe (ex: max 12 mois)
public BigDecimal adjustWithFonction(FieldConfiguration fc, Long valueItemId, Long riskId) {
if (!fc.isFonction()) return BigDecimal.ONE;
switch (fc.getFonctionType()) {
case PRODUIT:
// TODO: lire table produit_stats et prendre MAX sur 12 mois
return BigDecimal.valueOf(1.5);
case CASH:
case CONTRACT:
case PAYE:
// TODO: implémenter règles
return BigDecimal.ONE;
default:
return BigDecimal.ONE;
}
}
}

@Service
public class RuleService {
public BigDecimal scoreNonSelect(FieldConfiguration fc, String rawValue) {
// Exemple simple: boolean true = 1, false = 0
if ("boolean".equalsIgnoreCase(fc.getType())) {
return "true".equalsIgnoreCase(rawValue) ? BigDecimal.ONE : BigDecimal.ZERO;
}
return BigDecimal.ZERO;
}
}

@Service
public class NotationService {

private final NotationRepository notationRepo;
private final FieldConfigurationRepository fieldConfigRepo;
private final SegmentRepository segmentRepo;
private final WeightService weightService;
private final FonctionService fonctionService;
private final RuleService ruleService;

public NotationService(NotationRepository notationRepo,
FieldConfigurationRepository fieldConfigRepo,
SegmentRepository segmentRepo,
WeightService weightService,
FonctionService fonctionService,
RuleService ruleService) {
this.notationRepo = notationRepo;
this.fieldConfigRepo = fieldConfigRepo;
this.segmentRepo = segmentRepo;
this.weightService = weightService;
this.fonctionService = fonctionService;
this.ruleService = ruleService;
}

@Transactional
public NotationDTO save(NotationCreateDTO dto) {
Segment segment = segmentRepo.findById(dto.getSegmentId())
.orElseThrow(() -> new RuntimeException("Segment introuvable"));

text
Notation notation = new Notation();
notation.setSegment(segment);
notation.setDateSaisie(LocalDateTime.now());

BigDecimal total = BigDecimal.ZERO;

for (NotationItemCreateDTO it : dto.getItems()) {
  FieldConfiguration fc = fieldConfigRepo.findById(it.getFieldConfigurationId())
    .orElseThrow(() -> new RuntimeException("FieldConfiguration introuvable: " + it.getFieldConfigurationId()));

  NotationValue nv = new NotationValue();
  nv.setNotation(notation);
  nv.setFieldConfiguration(fc);
  nv.setType(fc.getType());

  BigDecimal scoreField = BigDecimal.ZERO;

  if ("select".equalsIgnoreCase(fc.getType())) {
    if (it.getSelectedValueItemIds() == null || it.getSelectedValueItemIds().isEmpty()) {
      // passer si non obligatoire, sinon throw
      nv.setScore(BigDecimal.ZERO);
    } else {
      // map listValueItem -> risqueValueItem depuis la config
      Map<Long, Long> valueToRisk = fc.getValueItemRisqueItem().stream()
        .collect(Collectors.toMap(m -> m.getListValueItem().getId(), m -> m.getRisqueValueItem().getId()));

      for (Long valueItemId : it.getSelectedValueItemIds()) {
        Long riskId = valueToRisk.get(valueItemId);
        if (riskId == null) throw new RuntimeException("Aucun risque mappé pour item: " + valueItemId);

        BigDecimal poids = weightService.findWeight(fc, riskId);
        BigDecimal func = fonctionService.adjustWithFonction(fc, valueItemId, riskId);
        BigDecimal itemScore = poids.multiply(func);

        NotationValueSelect nvs = new NotationValueSelect();
        nvs.setNotationValue(nv);
        nvs.setListValueItem(new ListValueItem(valueItemId));
        nvs.setRisqueValueItem(new RisqueValueItem(riskId));
        nvs.setWeightApplied(poids);
        nvs.setScore(itemScore);
        nv.getSelects().add(nvs);

        scoreField = scoreField.add(itemScore);
      }
      nv.setScore(scoreField);
    }
  } else {
    nv.setRawValue(it.getValue());
    scoreField = ruleService.scoreNonSelect(fc, it.getValue());
    nv.setScore(scoreField);
  }

  notation.getValues().add(nv);
  total = total.add(scoreField);
}

notation.setTotalScore(total);
notationRepo.save(notation);

NotationDTO out = new NotationDTO();
out.setId(notation.getId());
out.setSegmentId(segment.getId());
out.setTotalScore(total);
out.setDateSaisie(notation.getDateSaisie());
return out;
}

public NotationDTO getById(Long id) {
Notation n = notationRepo.findById(id).orElseThrow(() -> new RuntimeException("Notation introuvable"));
NotationDTO dto = new NotationDTO();
dto.setId(n.getId());
dto.setSegmentId(n.getSegment().getId());
dto.setTotalScore(n.getTotalScore());
dto.setDateSaisie(n.getDateSaisie());
return dto;
}
}

Contrôleur

@RestController
@RequestMapping("/api/notations")
public class NotationController {

private final NotationService notationService;

public NotationController(NotationService notationService) {
this.notationService = notationService;
}

@PostMapping
public ResponseEntity<NotationDTO> create(@RequestBody NotationCreateDTO dto) {
NotationDTO out = notationService.save(dto);
return ResponseEntity.status(HttpStatus.CREATED).body(out);
}

@GetMapping("/{id}")
public ResponseEntity<NotationDTO> get(@PathVariable Long id) {
return ResponseEntity.ok(notationService.getById(id));
}
}

SQL minimal (PostgreSQL)

CREATE TABLE notations (
id BIGSERIAL PRIMARY KEY,
segment_id BIGINT NOT NULL,
date_saisie TIMESTAMP NOT NULL,
total_score NUMERIC(18,6) NOT NULL DEFAULT 0
);

CREATE TABLE notation_values (
id BIGSERIAL PRIMARY KEY,
notation_id BIGINT NOT NULL REFERENCES notations(id) ON DELETE CASCADE,
field_configuration_id BIGINT NOT NULL,
type VARCHAR(32) NOT NULL,
raw_value TEXT,
score NUMERIC(18,6) NOT NULL DEFAULT 0
);

CREATE TABLE notation_value_selects (
id BIGSERIAL PRIMARY KEY,
notation_value_id BIGINT NOT NULL REFERENCES notation_values(id) ON DELETE CASCADE,
list_value_item_id BIGINT NOT NULL,
risque_value_item_id BIGINT NOT NULL,
weight_applied NUMERIC(18,6),
score NUMERIC(18,6) NOT NULL DEFAULT 0
);

Frontend Angular

Service HTTP

@Injectable({ providedIn: 'root' })
export class NotationService {
constructor(private http: HttpClient) {}
private base = '/api/notations';

create(payload: any) {
return this.http.post(this.base, payload);
}

getById(id: number) {
return this.http.get(${this.base}/${id});
}
}

Construction du payload dans un composant

submit() {
const payload = {
segmentId: this.selectedSegmentId,
items: [] as any[]
};

for (const area of this.segment.areas) {
for (const fc of area.fieldConfigurations) {
const ctrl = this.form.get('f_' + fc.id);
if (fc.type === 'select') {
payload.items.push({
fieldConfigurationId: fc.id,
type: 'select',
selectedValueItemIds: ctrl?.value || []
});
} else if (fc.type === 'boolean') {
payload.items.push({
fieldConfigurationId: fc.id,
type: 'boolean',
value: ctrl?.value === true ? 'true' : 'false'
});
} else if (fc.type === 'date') {
payload.items.push({
fieldConfigurationId: fc.id,
type: 'date',
value: ctrl?.value ? new Date(ctrl.value).toISOString() : null
});
} else {
payload.items.push({
fieldConfigurationId: fc.id,
type: 'text',
value: ctrl?.value ?? ''
});
}
}
}

this.notationService.create(payload).subscribe({
next: (res) => { /* toast success / },
error: (err) => { / afficher message */ }
});
}

Exemple de mapping “valueItem -> risque” côté FieldConfiguration

Hypothèse: FieldConfiguration a une collection valueItemRisqueItem (liste d’objets avec listValueItem et risqueValueItem)

Si vous n’avez pas encore l’entité, vous pouvez créer:

@Entity
@Table(name = "field_valueitem_risqueitem")
public class FieldValueItemRisqueItem {
@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

@ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "field_configuration_id")
private FieldConfiguration fieldConfiguration;

@ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "list_value_item_id")
private ListValueItem listValueItem;

@ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "risque_value_item_id")
private RisqueValueItem risqueValueItem;
}
///////////////////////////////////////////HTHH//////////////////////////////////////////////

Entities (domaine)

Fichier: src/main/java/com/example/domain/Notation.java
@Entity
@Table(name = "notations")
public class Notation {
@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "segment_id", nullable = false)
private Segment segment;

private LocalDateTime dateSaisie;

// totalScore = 0 pour le moment, calculé plus tard
@Column(nullable = false)
private BigDecimal totalScore = BigDecimal.ZERO;

@OneToMany(mappedBy = "notation", cascade = CascadeType.ALL, orphanRemoval = true)
private List<NotationValue> values = new ArrayList<>();

// getters/setters
}

Fichier: src/main/java/com/example/domain/NotationValue.java
@Entity
@Table(name = "notation_values")
public class NotationValue {
@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "notation_id", nullable = false)
private Notation notation;

@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "field_configuration_id", nullable = false)
private FieldConfiguration fieldConfiguration;

// on fige le type au moment de la saisie (utile si la config change)
@Column(nullable = false)
private String type; // text | date | boolean | select

// pour text/date/boolean (stringifié). Pour select, laisser null.
@Column(columnDefinition = "text")
private String rawValue;

// score partiel = 0 pour le moment
@Column(nullable = false)
private BigDecimal score = BigDecimal.ZERO;

@OneToMany(mappedBy = "notationValue", cascade = CascadeType.ALL, orphanRemoval = true)
private List<NotationValueSelect> selects = new ArrayList<>();

// getters/setters
}

Fichier: src/main/java/com/example/domain/NotationValueSelect.java
@Entity
@Table(name = "notation_value_selects")
public class NotationValueSelect {
@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "notation_value_id", nullable = false)
private NotationValue notationValue;

@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "list_value_item_id", nullable = false)
private ListValueItem listValueItem;

// on laisse nul pour le moment; sera rempli lors du calcul
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "risque_value_item_id")
private RisqueValueItem risqueValueItem;

// poids et score à 0 pour le moment
@Column(nullable = false)
private BigDecimal weightApplied = BigDecimal.ZERO;

@Column(nullable = false)
private BigDecimal score = BigDecimal.ZERO;

// getters/setters
}

Remarques:

Segment, FieldConfiguration, ListValueItem, RisqueValueItem: utilise tes classes existantes (ou mets des stubs si besoin).

type est copié depuis FieldConfiguration.getType() au moment du save.

DTOs (entrées/sorties API)

Fichier: src/main/java/com/example/api/dto/NotationItemCreateDTO.java
public class NotationItemCreateDTO {
private Long fieldConfigurationId;
private String type; // text|date|boolean|select (optionnel si tu veux le déduire côté back)
private String value; // text/date/boolean stringifié
private List<Long> selectedValueItemIds; // pour select
// getters/setters
}

Fichier: src/main/java/com/example/api/dto/NotationCreateDTO.java
public class NotationCreateDTO {
private Long segmentId;
private List<NotationItemCreateDTO> items;
// getters/setters
}

Fichier: src/main/java/com/example/api/dto/NotationDTO.java
public class NotationDTO {
private Long id;
private Long segmentId;
private LocalDateTime dateSaisie;
private BigDecimal totalScore; // 0 pour le moment
// getters/setters
}

Repositories

Fichier: src/main/java/com/example/repository/NotationRepository.java
public interface NotationRepository extends JpaRepository<Notation, Long> {}

Fichier: src/main/java/com/example/repository/NotationValueRepository.java
public interface NotationValueRepository extends JpaRepository<NotationValue, Long> {}

Fichier: src/main/java/com/example/repository/NotationValueSelectRepository.java
public interface NotationValueSelectRepository extends JpaRepository<NotationValueSelect, Long> {}

Service (save sans calcul, mais prêt pour ajouter la logique)

Fichier: src/main/java/com/example/service/NotationService.java
@Service
public class NotationService {

private final NotationRepository notationRepo;
private final SegmentRepository segmentRepo;
private final FieldConfigurationRepository fieldConfigRepo;

public NotationService(NotationRepository notationRepo,
SegmentRepository segmentRepo,
FieldConfigurationRepository fieldConfigRepo) {
this.notationRepo = notationRepo;
this.segmentRepo = segmentRepo;
this.fieldConfigRepo = fieldConfigRepo;
}

@Transactional
public NotationDTO save(NotationCreateDTO dto) {
Segment segment = segmentRepo.findById(dto.getSegmentId())
.orElseThrow(() -> new IllegalArgumentException("Segment introuvable: " + dto.getSegmentId()));

text
Notation notation = new Notation();
notation.setSegment(segment);
notation.setDateSaisie(LocalDateTime.now());
notation.setTotalScore(BigDecimal.ZERO); // pas de calcul pour le moment

if (dto.getItems() != null) {
  for (NotationItemCreateDTO it : dto.getItems()) {
    FieldConfiguration fc = fieldConfigRepo.findById(it.getFieldConfigurationId())
      .orElseThrow(() -> new IllegalArgumentException("FieldConfiguration introuvable: " + it.getFieldConfigurationId()));

    NotationValue nv = new NotationValue();
    nv.setNotation(notation);
    nv.setFieldConfiguration(fc);
    nv.setType(fc.getType()); // on fige le type depuis la config
    nv.setScore(BigDecimal.ZERO); // sera calculé plus tard

    if ("select".equalsIgnoreCase(fc.getType())) {
      List<Long> selectedIds = (it.getSelectedValueItemIds() == null) ? List.of() : it.getSelectedValueItemIds();
      for (Long valueItemId : selectedIds) {
        NotationValueSelect nvs = new NotationValueSelect();
        nvs.setNotationValue(nv);
        nvs.setListValueItem(new ListValueItem(valueItemId)); // référence par id
        // risque/poids/score seront calculés plus tard
        nvs.setRisqueValueItem(null);
        nvs.setWeightApplied(BigDecimal.ZERO);
        nvs.setScore(BigDecimal.ZERO);
        nv.getSelects().add(nvs);
      }
    } else {
      // text/date/boolean en string, tel que reçu
      nv.setRawValue(it.getValue());
    }

    notation.getValues().add(nv);
  }
}

notationRepo.save(notation);

NotationDTO out = new NotationDTO();
out.setId(notation.getId());
out.setSegmentId(segment.getId());
out.setDateSaisie(notation.getDateSaisie());
out.setTotalScore(notation.getTotalScore()); // 0
return out;
}

@Transactional(readOnly = true)
public NotationDTO getById(Long id) {
Notation n = notationRepo.findById(id)
.orElseThrow(() -> new NoSuchElementException("Notation introuvable: " + id));

text
NotationDTO dto = new NotationDTO();
dto.setId(n.getId());
dto.setSegmentId(n.getSegment().getId());
dto.setDateSaisie(n.getDateSaisie());
dto.setTotalScore(n.getTotalScore());
return dto;
}
}

Controller

Fichier: src/main/java/com/example/api/NotationController.java
@RestController
@RequestMapping("/api/notations")
public class NotationController {

private final NotationService service;

public NotationController(NotationService service) {
this.service = service;
}

@PostMapping
public ResponseEntity<NotationDTO> create(@RequestBody NotationCreateDTO dto) {
NotationDTO out = service.save(dto);
return ResponseEntity.status(HttpStatus.CREATED).body(out);
}

@GetMapping("/{id}")
public ResponseEntity<NotationDTO> get(@PathVariable Long id) {
return ResponseEntity.ok(service.getById(id));
}
}

SQL (PostgreSQL)

Fichier: db/migration/V1__create_notation_tables.sql
CREATE TABLE notations (
id BIGSERIAL PRIMARY KEY,
segment_id BIGINT NOT NULL,
date_saisie TIMESTAMP NOT NULL,
total_score NUMERIC(18,6) NOT NULL DEFAULT 0
);

CREATE TABLE notation_values (
id BIGSERIAL PRIMARY KEY,
notation_id BIGINT NOT NULL REFERENCES notations(id) ON DELETE CASCADE,
field_configuration_id BIGINT NOT NULL,
type VARCHAR(32) NOT NULL,
raw_value TEXT,
score NUMERIC(18,6) NOT NULL DEFAULT 0
);

CREATE TABLE notation_value_selects (
id BIGSERIAL PRIMARY KEY,
notation_value_id BIGINT NOT NULL REFERENCES notation_values(id) ON DELETE CASCADE,
list_value_item_id BIGINT NOT NULL,
risque_value_item_id BIGINT NULL,
weight_applied NUMERIC(18,6) NOT NULL DEFAULT 0,
score NUMERIC(18,6) NOT NULL DEFAULT 0
);

Frontend: payload (exemple)

Fichier: src/app/services/notation.service.ts
@Injectable({ providedIn: 'root' })
export class NotationService {
private base = '/api/notations';
constructor(private http: HttpClient) {}
create(payload: any) { return this.http.post(this.base, payload); }
getById(id: number) { return this.http.get(${this.base}/${id}); }
}

Fichier: src/app/components/notation-form/notation-form.component.ts (extrait submit)
submit() {
const payload = { segmentId: this.selectedSegmentId, items: [] as any[] };

for (const area of this.segment.areas) {
for (const fc of area.fieldConfigurations) {
const ctrl = this.form.get('f_' + fc.id);
if (fc.type === 'select') {
payload.items.push({
fieldConfigurationId: fc.id,
type: 'select',
selectedValueItemIds: ctrl?.value || []
});
} else if (fc.type === 'boolean') {
payload.items.push({
fieldConfigurationId: fc.id,
type: 'boolean',
value: ctrl?.value === true ? 'true' : 'false'
});
} else if (fc.type === 'date') {
payload.items.push({
fieldConfigurationId: fc.id,
type: 'date',
value: ctrl?.value ? new Date(ctrl.value).toISOString() : null
});
} else {
payload.items.push({
fieldConfigurationId: fc.id,
type: 'text',
value: ctrl?.value ?? ''
});
}
}
}

this.notationService.create(payload).subscribe();
}
