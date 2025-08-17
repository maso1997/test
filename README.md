// com/sahambank/fccr/core/entities/file/ProductData.java
package com.sahambank.fccr.core.entities.file;

import com.sahambank.fccr.core.entities.Notation;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "product_data",
       indexes = {
           @Index(name = "idx_pd_rct_client", columnList = "rct_identifier_client"),
           @Index(name = "idx_pd_collect_month", columnList = "collect_month")
       })
public class ProductData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="rct_identifier_client", nullable = false, length = 100)
    private String rctIdentifierClient;

    @Column(name="customer_localization", length = 100)
    private String customerLocalization;

    @Column(name="local_identifier_client", length = 100)
    private String localIdentifierClient;

    @Column(name="local_database_name", length = 100)
    private String localDatabaseName;

    @Column(name="product_code", length = 100)
    private String productCode;

    @Column(name="product_type", length = 100)
    private String productType;

    @Column(name="issuing_application_code", length = 100)
    private String issuingApplicationCode;

    @Column(name="booking_entity_code", length = 100)
    private String bookingEntityCode;

    // format YYYY-MM
    @Column(name="collect_month", length = 7)
    private String collectMonth;

    @OneToMany(mappedBy = "productData", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Notation> notations = new ArrayList<>();

    public Long getId() { return id; }
    public String getRctIdentifierClient() { return rctIdentifierClient; }
    public void setRctIdentifierClient(String rctIdentifierClient) { this.rctIdentifierClient = rctIdentifierClient; }
    public String getCustomerLocalization() { return customerLocalization; }
    public void setCustomerLocalization(String customerLocalization) { this.customerLocalization = customerLocalization; }
    public String getLocalIdentifierClient() { return localIdentifierClient; }
    public void setLocalIdentifierClient(String localIdentifierClient) { this.localIdentifierClient = localIdentifierClient; }
    public String getLocalDatabaseName() { return localDatabaseName; }
    public void setLocalDatabaseName(String localDatabaseName) { this.localDatabaseName = localDatabaseName; }
    public String getProductCode() { return productCode; }
    public void setProductCode(String productCode) { this.productCode = productCode; }
    public String getProductType() { return productType; }
    public void setProductType(String productType) { this.productType = productType; }
    public String getIssuingApplicationCode() { return issuingApplicationCode; }
    public void setIssuingApplicationCode(String issuingApplicationCode) { this.issuingApplicationCode = issuingApplicationCode; }
    public String getBookingEntityCode() { return bookingEntityCode; }
    public void setBookingEntityCode(String bookingEntityCode) { this.bookingEntityCode = bookingEntityCode; }
    public String getCollectMonth() { return collectMonth; }
    public void setCollectMonth(String collectMonth) { this.collectMonth = collectMonth; }
    public List<Notation> getNotations() { return notations; }
    public void setNotations(List<Notation> notations) { this.notations = notations; }
}
// com/sahambank/fccr/core/entities/Item.java
package com.sahambank.fccr.core.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "item",
       indexes = { @Index(name = "uk_item_code", columnList = "code", unique = true) })
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="code", nullable = false, length = 100, unique = true)
    private String code;

    @Column(name="libelle", length = 255)
    private String libelle;

    public Long getId() { return id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getLibelle() { return libelle; }
    public void setLibelle(String libelle) { this.libelle = libelle; }
}
// com/sahambank/fccr/core/entities/Notation.java
package com.sahambank.fccr.core.entities;

import com.sahambank.fccr.core.entities.file.ProductData;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "notation",
       indexes = {
           @Index(name="idx_notation_client_code", columnList = "client_code"),
           @Index(name="idx_notation_segment_code", columnList = "segment_code")
       })
public class Notation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="segment_code", nullable = false, length = 100)
    private String segmentCode;

    @Column(name="created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "notation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<NotationFieldValue> fieldValues = new ArrayList<>();

    @Column(name="client_code", length = 100)
    private String clientCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_data_id")
    private ProductData productData;

    public Long getId() { return id; }
    public String getSegmentCode() { return segmentCode; }
    public void setSegmentCode(String segmentCode) { this.segmentCode = segmentCode; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public List<NotationFieldValue> getFieldValues() { return fieldValues; }
    public void setFieldValues(List<NotationFieldValue> fieldValues) { this.fieldValues = fieldValues; }
    public String getClientCode() { return clientCode; }
    public void setClientCode(String clientCode) { this.clientCode = clientCode; }
    public ProductData getProductData() { return productData; }
    public void setProductData(ProductData productData) { this.productData = productData; }
}
// com/sahambank/fccr/core/entities/NotationFieldValue.java
package com.sahambank.fccr.core.entities;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "notation_field_value",
       indexes = { @Index(name="idx_nfv_field_code", columnList = "field_code") })
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

    @Column(name = "fonction")
    private Boolean fonction;

    @Column(name = "fonctiontype", length = 100)
    private String fonctiontype;

    @OneToMany(mappedBy = "notationFieldValue", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RisqueEntry> risqueValueList = new ArrayList<>();

    public Long getId() { return id; }
    public Notation getNotation() { return notation; }
    public void setNotation(Notation notation) { this.notation = notation; }
    public Long getFieldConfigurationId() { return fieldConfigurationId; }
    public void setFieldConfigurationId(Long fieldConfigurationId) { this.fieldConfigurationId = fieldConfigurationId; }
    public String getFieldCode() { return fieldCode; }
    public void setFieldCode(String fieldCode) { this.fieldCode = fieldCode; }
    public Boolean getFonction() { return fonction; }
    public void setFonction(Boolean fonction) { this.fonction = fonction; }
    public String getFonctiontype() { return fonctiontype; }
    public void setFonctiontype(String fonctiontype) { this.fonctiontype = fonctiontype; }
    public List<RisqueEntry> getRisqueValueList() { return risqueValueList; }
    public void setRisqueValueList(List<RisqueEntry> risqueValueList) { this.risqueValueList = risqueValueList; }
}
// com/sahambank/fccr/core/entities/RisqueEntry.java
package com.sahambank.fccr.core.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "risque_entry",
       indexes = {
           @Index(name="idx_re_list_item", columnList = "list_value_item_id"),
           @Index(name="idx_re_risque_item", columnList = "risque_value_item_id")
       })
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

    public Long getId() { return id; }
    public Item getListValueItem() { return listValueItem; }
    public void setListValueItem(Item listValueItem) { this.listValueItem = listValueItem; }
    public Item getRisqueValueItem() { return risqueValueItem; }
    public void setRisqueValueItem(Item risqueValueItem) { this.risqueValueItem = risqueValueItem; }
    public NotationFieldValue getNotationFieldValue() { return notationFieldValue; }
    public void setNotationFieldValue(NotationFieldValue notationFieldValue) { this.notationFieldValue = notationFieldValue; }
}
// com/sahambank/fccr/core/dto/ItemDto.java
package com.sahambank.fccr.core.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ItemDto {
    private String code;
    private String libelle;
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getLibelle() { return libelle; }
    public void setLibelle(String libelle) { this.libelle = libelle; }
}
// com/sahambank/fccr/core/dto/RisqueEntryDto.java
package com.sahambank.fccr.core.dto;

public class RisqueEntryDto {
    private ItemDto listValueItem;
    private ItemDto risqueValueItem;
    public ItemDto getListValueItem() { return listValueItem; }
    public void setListValueItem(ItemDto listValueItem) { this.listValueItem = listValueItem; }
    public ItemDto getRisqueValueItem() { return risqueValueItem; }
    public void setRisqueValueItem(ItemDto risqueValueItem) { this.risqueValueItem = risqueValueItem; }
}
// com/sahambank/fccr/core/dto/FiledValueDto.java
package com.sahambank.fccr.core.dto;

import java.util.List;

public class FiledValueDto {
    private Long id;
    private String code;
    private Boolean fonction;
    private String fonctionType;
    private List<RisqueEntryDto> risqueValueList;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public Boolean getFonction() { return fonction; }
    public void setFonction(Boolean fonction) { this.fonction = fonction; }
    public String getFonctionType() { return fonctionType; }
    public void setFonctionType(String fonctionType) { this.fonctionType = fonctionType; }
    public List<RisqueEntryDto> getRisqueValueList() { return risqueValueList; }
    public void setRisqueValueList(List<RisqueEntryDto> risqueValueList) { this.risqueValueList = risqueValueList; }
}
// com/sahambank/fccr/core/dto/segment/SegmentSaveDto.java
package com.sahambank.fccr.core.dto.segment;

public class SegmentSaveDto {
    private String code;
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
}
// com/sahambank/fccr/core/dto/NotationDto.java
package com.sahambank.fccr.core.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sahambank.fccr.core.dto.segment.SegmentSaveDto;
import java.util.List;

public class NotationDto {
    @JsonProperty("SEGMENT")
    private SegmentSaveDto SEGMENT;
    private List<FiledValueDto> fieldConfigurations;
    private String clientCode;

    public SegmentSaveDto getSEGMENT() { return SEGMENT; }
    public void setSEGMENT(SegmentSaveDto SEGMENT) { this.SEGMENT = SEGMENT; }
    public List<FiledValueDto> getFieldConfigurations() { return fieldConfigurations; }
    public void setFieldConfigurations(List<FiledValueDto> fieldConfigurations) { this.fieldConfigurations = fieldConfigurations; }
    public String getClientCode() { return clientCode; }
    public void setClientCode(String clientCode) { this.clientCode = clientCode; }
}
// com/sahambank/fccr/core/repository/ProductDataRepository.java
package com.sahambank.fccr.core.repository;

import com.sahambank.fccr.core.entities.file.ProductData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

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
// com/sahambank/fccr/core/repository/NotationRepository.java
package com.sahambank.fccr.core.repository;

import com.sahambank.fccr.core.entities.Notation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotationRepository extends JpaRepository<Notation, Long> {
}
// com/sahambank/fccr/core/repository/RisqueEntryRepository.java
package com.sahambank.fccr.core.repository;

import com.sahambank.fccr.core.entities.RisqueEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

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
}
// com/sahambank/fccr/core/service/NotationService.java
package com.sahambank.fccr.core.service;

import com.sahambank.fccr.core.dto.NotationDto;
import com.sahambank.fccr.core.dto.ItemDto;
import java.util.List;

public interface NotationService {
    Long save(NotationDto dto);

    // Retourne couples uniques (listValueItem, risqueValueItem) par client et optionnellement produit
    List<RiskPairDto> getUniqueRisks(String clientCode, String productCode);

    class RiskPairDto {
        private ItemDto listValueItem;
        private ItemDto risqueValueItem;

        public RiskPairDto(ItemDto listValueItem, ItemDto risqueValueItem) {
            this.listValueItem = listValueItem;
            this.risqueValueItem = risqueValueItem;
        }

        public ItemDto getListValueItem() { return listValueItem; }
        public ItemDto getRisqueValueItem() { return risqueValueItem; }
    }
}
// com/sahambank/fccr/core/service/Impl/NotationServiceImpl.java
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
import com.sahambank.fccr.core.repository.RisqueEntryRepository;
import com.sahambank.fccr.core.service.NotationService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.util.*;

@Service
public class NotationServiceImpl implements NotationService {

    private final NotationRepository notationRepository;
    private final ItemRepository itemRepository;
    private final ProductDataRepository productDataRepository;
    private final RisqueEntryRepository risqueEntryRepository;

    public NotationServiceImpl(NotationRepository notationRepository,
                               ItemRepository itemRepository,
                               ProductDataRepository productDataRepository,
                               RisqueEntryRepository risqueEntryRepository) {
        this.notationRepository = notationRepository;
        this.itemRepository = itemRepository;
        this.productDataRepository = productDataRepository;
        this.risqueEntryRepository = risqueEntryRepository;
    }

    private static boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }

    private ProductData resolveProductData(String clientCode) {
        String currentMonth = YearMonth.now().toString(); // YYYY-MM
        return productDataRepository
                .findByRctIdentifierClientAndCollectMonth(clientCode, currentMonth)
                .or(() -> productDataRepository.findTopByRctIdentifierClientOrderByCollectMonthDesc(clientCode))
                .orElseThrow(() -> new IllegalArgumentException(
                        "Aucun ProductData trouvé pour le client " + clientCode + " (mois courant ou plus récent)"));
    }

    @Transactional
    @Override
    public Long save(NotationDto dto) {
        if (dto == null) throw new IllegalArgumentException("NotationDto is required");
        if (dto.getSEGMENT() == null || isBlank(dto.getSEGMENT().getCode()))
            throw new IllegalArgumentException("SEGMENT and SEGMENT.code are required");
        if (isBlank(dto.getClientCode()))
            throw new IllegalArgumentException("clientCode is required");

        ProductData productData = resolveProductData(dto.getClientCode());

        Notation notation = new Notation();
        notation.setSegmentCode(dto.getSEGMENT().getCode());
        notation.setClientCode(dto.getClientCode());
        notation.setProductData(productData);

        List<NotationFieldValue> fieldValues = new ArrayList<>();
        Set<String> seenPairs = new HashSet<>(); // dédoublonnage intra-payload

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

                        String listCode = r.getListValueItem() != null ? r.getListValueItem().getCode() : null;
                        String riskCode = r.getRisqueValueItem() != null ? r.getRisqueValueItem().getCode() : null;
                        String key = (listCode == null ? "" : listCode) + "|" + (riskCode == null ? "" : riskCode);

                        if (seenPairs.contains(key)) continue;
                        seenPairs.add(key);

                        RisqueEntry emb = new RisqueEntry();

                        if (r.getListValueItem() != null && !isBlank(r.getListValueItem().getCode())) {
                            Item listItem = resolveItemByCodeOrCreate(r.getListValueItem().getCode(), r.getListValueItem().getLibelle());
                            emb.setListValueItem(listItem);
                        }
                        if (r.getRisqueValueItem() != null && !isBlank(r.getRisqueValueItem().getCode())) {
                            Item risqueItem = resolveItemByCodeOrCreate(r.getRisqueValueItem().getCode(), r.getRisqueValueItem().getLibelle());
                            emb.setRisqueValueItem(risqueItem);
                        }

                        emb.setNotationFieldValue(fv); // lien propriétaire ManyToOne
                        risqueEntries.add(emb);
                    }
                }

                fv.setRisqueValueList(risqueEntries);
                fieldValues.add(fv);
            }
        }

        notation.setFieldValues(fieldValues);
        productData.getNotations().add(notation);

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
                if (list != null) { listDto.setCode(list.getCode()); listDto.setLibelle(list.getLibelle()); }

                ItemDto riskDto = new ItemDto();
                if (risk != null) { riskDto.setCode(risk.getCode()); riskDto.setLibelle(risk.getLibelle()); }

                unique.put(key, new RiskPairDto(listDto, riskDto));
            }
        }
        return new ArrayList<>(unique.values());
    }
}
// com/sahambank/fccr/core/service/Impl/ProductImportStrategy.java
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
        if (!StringUtils.hasText(line)) return;

        ProductData incoming = objectMapper.readValue(line, ProductData.class);
        if (!StringUtils.hasText(incoming.getRctIdentifierClient())) {
            throw new IllegalArgumentException("rctIdentifierClient manquant dans la ligne : " + line);
        }

        ProductData product = repository
                .findByRctIdentifierClientAndCollectMonth(incoming.getRctIdentifierClient(), incoming.getCollectMonth())
                .map(existing -> {
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
                .orElse(incoming);

        repository.save(product);
    }
}
// com/sahambank/fccr/core/service/FileImportStrategy.java
package com.sahambank.fccr.core.service;

import java.io.IOException;

public interface FileImportStrategy {
    String getType();
    void processLine(String line) throws IOException;
}
alter table risque_entry
add constraint uk_risque_entry_field_triplet unique (field_value_id, list_value_item_id, risque_value_item_id);
