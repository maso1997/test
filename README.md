package com.votreprojet.fccrbff.controllers;

import com.votreprojet.fccrbff.clients.FccrCoreClient;
// Importez ici tous les DTOs dont vous avez besoin depuis votre package dto
import com.votreprojet.fccrbff.dto.*; 

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api") // Le préfixe de base pour tous les appels venant du frontend
public class ReferentielBffController {

    @Autowired
    private FccrCoreClient client;

    // =================================================================
    // ==                     SEGMENTS                                ==
    // =================================================================
    @GetMapping("/segments")
    public ResponseEntity<List<SegmentDTO>> findSegments() {
        return ResponseEntity.ok(client.findSegments());
    }

    @PostMapping("/segments")
    public ResponseEntity<SegmentDTO> createSegment(@RequestBody SegmentDTO dto) {
        return ResponseEntity.ok(client.createSegment(dto));
    }

    @PutMapping("/segments/{id}")
    public ResponseEntity<SegmentDTO> updateSegment(@PathVariable Long id, @RequestBody SegmentDTO dto) {
        return ResponseEntity.ok(client.updateSegment(id, dto));
    }

    @DeleteMapping("/segments/{id}")
    public ResponseEntity<Void> deleteSegment(@PathVariable Long id) {
        client.deleteSegment(id);
        return ResponseEntity.noContent().build();
    }


    // =================================================================
    // ==                      AREAS                                  ==
    // =================================================================
    @GetMapping("/areas")
    public ResponseEntity<List<AreaDTO>> findAreas() {
        return ResponseEntity.ok(client.findAreas());
    }
    
    @PostMapping("/areas")
    public ResponseEntity<AreaDTO> createArea(@RequestBody AreaDTO dto) {
        return ResponseEntity.ok(client.createArea(dto));
    }

    @PutMapping("/areas/{id}")
    public ResponseEntity<AreaDTO> updateArea(@PathVariable Long id, @RequestBody AreaDTO dto) {
        return ResponseEntity.ok(client.updateArea(id, dto));
    }

    @DeleteMapping("/areas/{id}")
    public ResponseEntity<Void> deleteArea(@PathVariable Long id) {
        client.deleteArea(id);
        return ResponseEntity.noContent().build();
    }


    // =================================================================
    // ==                     LIST VALUES                             ==
    // =================================================================
    @GetMapping("/list-values")
    public ResponseEntity<List<ListValueDTO>> findListValues() {
        return ResponseEntity.ok(client.findListValues());
    }
    
    @PostMapping("/list-values")
    public ResponseEntity<ListValueDTO> createListValue(@RequestBody ListValueDTO dto) {
        return ResponseEntity.ok(client.createListValue(dto));
    }

    @PutMapping("/list-values/{id}")
    public ResponseEntity<ListValueDTO> updateListValue(@PathVariable Long id, @RequestBody ListValueDTO dto) {
        return ResponseEntity.ok(client.updateListValue(id, dto));
    }

    @DeleteMapping("/list-values/{id}")
    public ResponseEntity<Void> deleteListValue(@PathVariable Long id) {
        client.deleteListValue(id);
        return ResponseEntity.noContent().build();
    }


    // =================================================================
    // ==                  LIST VALUE ITEMS                           ==
    // =================================================================
    @GetMapping("/list-value-items")
    public ResponseEntity<List<ListValueItemDTO>> findListValueItems() {
        return ResponseEntity.ok(client.findListValueItems());
    }

    // Implémentez POST, PUT, DELETE pour ListValueItem...


    // =================================================================
    // ==                  RISQUE VALUE LISTS                         ==
    // =================================================================
    @GetMapping("/risque-value-lists")
    public ResponseEntity<List<RisqueValueListDTO>> findRisqueValueLists() {
        return ResponseEntity.ok(client.findRisqueValueLists());
    }

    // Implémentez POST, PUT, DELETE pour RisqueValueList...


    // =================================================================
    // ==                  RISQUE VALUE ITEMS                         ==
    // =================================================================
    @GetMapping("/risque-value-items")
    public ResponseEntity<List<RisqueValueItemDTO>> findRisqueValueItems() {
        return ResponseEntity.ok(client.findRisqueValueItems());
    }

    // Implémentez POST, PUT, DELETE pour RisqueValueItem...


    // =================================================================
    // ==                 FIELD CONFIGURATIONS                        ==
    // =================================================================
    @GetMapping("/field-configurations")
    public ResponseEntity<List<FieldConfigurationDTO>> findFieldConfigurations() {
        return ResponseEntity.ok(client.findFieldConfigurations());
    }
    
    @PostMapping("/field-configurations")
    public ResponseEntity<FieldConfigurationDTO> createFieldConfiguration(@RequestBody FieldConfigurationDTO dto) {
        return ResponseEntity.ok(client.createFieldConfiguration(dto));
    }

    @PutMapping("/field-configurations/{id}")
    public ResponseEntity<FieldConfigurationDTO> updateFieldConfiguration(@PathVariable Long id, @RequestBody FieldConfigurationDTO dto) {
        return ResponseEntity.ok(client.updateFieldConfiguration(id, dto));
    }

    @DeleteMapping("/field-configurations/{id}")
    public ResponseEntity<Void> deleteFieldConfiguration(@PathVariable Long id) {
        client.deleteFieldConfiguration(id);
        return ResponseEntity.noContent().build();
    }


    // =================================================================
    // ==              VALUE ITEM / RISQUE ITEM (Associations)        ==
    // =================================================================
    @GetMapping("/value-item-risque-items")
    public ResponseEntity<List<ValueItemRisqueItemDTO>> findValueItemRisqueItems() {
        return ResponseEntity.ok(client.findValueItemRisqueItems());
    }

    // La logique POST, PUT, DELETE pour une table de jointure peut être plus complexe
    // mais vous pouvez suivre le même modèle si elle est gérée comme une entité simple.

}
///////////////////////////////////////////////////////////////////////////////////

// Dans votre fichier FccrCoreClient.java

// ... méthodes existantes pour Segments, etc.

// --- Endpoints pour Areas ---
@GetMapping("/api/areas")
List<AreaDTO> findAreas();

@PostMapping("/api/areas")
AreaDTO createArea(@RequestBody AreaDTO areaDTO);

@PutMapping("/api/areas/{id}")
AreaDTO updateArea(@PathVariable("id") Long id, @RequestBody AreaDTO areaDTO);

@DeleteMapping("/api/areas/{id}")
void deleteArea(@PathVariable("id") Long id);


// --- Endpoints pour List Value Items ---
@GetMapping("/api/list-value-items")
List<ListValueItemDTO> findListValueItems();

// Ajoutez toutes les autres signatures de la même manière...
