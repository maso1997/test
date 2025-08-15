
package com.sahambank.fccr.core.entities;

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
package com.sahambank.fccr.core.entities;


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



package com.sahambank.fccr.core.dto;

import com.sahambank.fccr.core.entities.Notation;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

public class ProductDataDto {


        private String rctIdentifierClient;
        private String customerLocalization;
        private String localIdentifierClient;
        private String localDatabaseName;
        private String productCode;
        private String productType;
        private String issuingApplicationCode;
        private String bookingEntityCode;
        private String collectMonth;
        private List<Notation> notations ;

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
package com.sahambank.fccr.core.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ItemDto {
    private String code;
    private String libelle;

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
}

@JsonIgnoreProperties(ignoreUnknown = true)
public class ItemDto {
    private String code;
    private String libelle;

}
package com.sahambank.fccr.core.service.Impl;

import com.sahambank.fccr.core.dto.FiledValueDto;
import com.sahambank.fccr.core.dto.ItemDto;
import com.sahambank.fccr.core.dto.NotationDto;
import com.sahambank.fccr.core.dto.RisqueEntryDto;
import com.sahambank.fccr.core.entities.Item;
import com.sahambank.fccr.core.entities.Notation;
import com.sahambank.fccr.core.entities.NotationFieldValue;
import com.sahambank.fccr.core.entities.RisqueEntry;
import com.sahambank.fccr.core.entities.file.ProductData;
import com.sahambank.fccr.core.repository.ItemRepository;
import com.sahambank.fccr.core.repository.NotationRepository;
import com.sahambank.fccr.core.repository.ProductDataRepository;
import com.sahambank.fccr.core.service.NotationService;
import jakarta.transaction.Transactional;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class NotationServiceImpl implements NotationService {

    private final NotationRepository notationRepository;
    private final ItemRepository itemRepository;
    private final ProductDataRepository productDataRepository;

    public NotationServiceImpl(NotationRepository notationRepository, ItemRepository itemRepository,
                               ProductDataRepository productDataRepository) {
        this.notationRepository = notationRepository;
        this.itemRepository = itemRepository;
        this.productDataRepository = productDataRepository;
    }

    private static boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }

    @Transactional
    public Long save(NotationDto dto) {
        if (dto == null) throw new IllegalArgumentException("NotationDto is required");
        if (dto.getSEGMENT() == null || isBlank(dto.getSEGMENT().getCode()))
            throw new IllegalArgumentException("SEGMENT and SEGMENT.code are required");

        String monthLimit = YearMonth.now().minusMonths(12).toString(); // format YYYY-MM
        List<ProductData> products = productDataRepository.findAllSinceMonth(dto.getClientCode(), monthLimit);

        if (products.size() < 12) {
            Optional<ProductData> optionalProduct = productDataRepository.findFirstByRctIdentifierClient(dto.getClientCode());
            if (optionalProduct.isPresent()) {
                products = List.of(optionalProduct.get());
            }
        }


        ProductData productData = products.get(0); // ou logique de choix

        Notation notation = new Notation();
        notation.setSegmentCode(dto.getSEGMENT().getCode());
        notation.setClientCode(dto.getClientCode());
        notation.setProductData(productData);
        productData.getNotations().add(notation);

        List<NotationFieldValue> fieldValues = new ArrayList<>();
        if (dto.getFieldConfigurations() != null) {
            for (FiledValueDto f : dto.getFieldConfigurations()) {
                if (f == null) continue;

                NotationFieldValue fv = new NotationFieldValue();
                fv.setFieldConfigurationId(f.getId());
                fv.setFieldCode(f.getCode());
                fv.setFonction(f.getFonction());
                fv.setFonctiontype(f.getFonctionType());
                fv.setNotation(notation);

                List<RisqueEntry> risqueEntries = new ArrayList<>();
                if (f.getRisqueValueList() != null) {
                    for (RisqueEntryDto r : f.getRisqueValueList()) {
                        if (r == null) continue;

                        RisqueEntry emb = new RisqueEntry();
                        if (r.getListValueItem() != null && !isBlank(r.getListValueItem().getCode())) {
                            Item listItem = resolveItemByCodeOrCreate(r.getListValueItem().getCode(), r.getListValueItem().getLibelle());
                            emb.setListValueItem(listItem);
                        }
                        if (r.getRisqueValueItem() != null && !isBlank(r.getRisqueValueItem().getCode())) {
                            Item risqueItem = resolveItemByCodeOrCreate(r.getRisqueValueItem().getCode(), r.getRisqueValueItem().getLibelle());
                            emb.setRisqueValueItem(risqueItem);
                        }
                        emb.setNotationFieldValue(fv);
                        risqueEntries.add(emb);
                    }
                }
                fv.setRisqueValueList(risqueEntries);
                fieldValues.add(fv);
            }
        }

        notation.setFieldValues(fieldValues);
        notationRepository.save(notation);

        return notation.getId();
    }

    private Item resolveItemByCodeOrCreate(String code, String libelle) {
        return itemRepository.findByCode(code).orElseGet(() -> {
            Item item = new Item();
            item.setCode(code);
            item.setLibelle(libelle);
            return itemRepository.save(item);
        });
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
il fait le save mais tableau 

fildvalue-id et listvalueitem id null risque value item id null 

}
je veux fusionner les données venant du front (via NotationDto) avec celles d’un fichier (représentées par ProductData), en liant chaque Notation à son ProductData via le champ rctIdentifierClient. Ensuite, tu veux récupérer les risques associés à chaque produit autrment je veux prend les donner enregistrer par play load du front envoyer au back je fusionne avec un fichier qui vient de la banque chaque moi puis avec code client je cherche le client qui a le meme produit je prend le risque exmple ona client a carte risque low et client a carte risque low j'affiche q'une
