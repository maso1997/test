import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-table-filter',
  templateUrl: './table-filter.component.html',
  styleUrls: ['./table-filter.component.scss']
})
export class TableFilterComponent {
  // Objet pour stocker les valeurs des filtres
  filters = {
    name: '',
    description: '',
    type: '',
    responsiblePerson: ''
  };

  // Événement pour émettre les changements de filtre
  @Output() filterChange = new EventEmitter<any>();

  // Méthode appelée chaque fois que les filtres sont modifiés
  onFilterChange() {
    this.filterChange.emit(this.filters);
  }
}
