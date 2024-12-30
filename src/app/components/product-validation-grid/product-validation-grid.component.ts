import { Component } from '@angular/core';

interface Product {
  productId: string;
  productName: string;
  secretaryBranch: string;
  typeOfCommittee: string;
  presentationDate: string;
  submissionDate: string;
  proposalStatus: string;
  productTraded: string;
  reputationRisk: string;
  sponsor: string;
  coPresident1: string;
  coPresident2: string;
  numberOfRestrictions: number;
  restrictionTypes: string;
  bookingLocation: string;
  location: string;
  openPreConditions: string;
  openPostConditions: string;
}

@Component({
  selector: 'app-product-validation-grid',
  templateUrl: './product-validation-grid.component.html',
  styleUrls: ['./product-validation-grid.component.scss']
})
export class ProductValidationGridComponent {
  tableColumns = [
    'Product ID',
    'Product Name',
    'Secretary Branch',
    'Type of Committee',
    'Presentation Date',
    'Submission Date',
    'Proposal Status',
    'Product Traded?',
    'Reputation Risk',
    'Sponsor',
    'Co-President 1',
    'Co-President 2',
    'Number of Restrictions',
    'Restriction Types',
    'Booking Location',
    'Location',
    'Open Pre-Conditions',
    'Open Post-Conditions'
  ];

  productKeys: (keyof Product)[] = [
    'productId',
    'productName',
    'secretaryBranch',
    'typeOfCommittee',
    'presentationDate',
    'submissionDate',
    'proposalStatus',
    'productTraded',
    'reputationRisk',
    'sponsor',
    'coPresident1',
    'coPresident2',
    'numberOfRestrictions',
    'restrictionTypes',
    'bookingLocation',
    'location',
    'openPreConditions',
    'openPostConditions'
  ];

  products: Product[] = [
    {
      productId: 'P001',
      productName: 'Product A',
      secretaryBranch: 'Finance',
      typeOfCommittee: 'Audit',
      presentationDate: '2024-12-01',
      submissionDate: '2024-12-02',
      proposalStatus: 'Approved',
      productTraded: 'Yes',
      reputationRisk: 'Low',
      sponsor: 'John Doe',
      coPresident1: 'Jane Smith',
      coPresident2: 'Alice Brown',
      numberOfRestrictions: 3,
      restrictionTypes: 'Type A, Type B',
      bookingLocation: 'Location A',
      location: 'Site 1',
      openPreConditions: 'None',
      openPostConditions: 'Pending'
    },
    {
      productId: 'P002',
      productName: 'Product B',
      secretaryBranch: 'IT',
      typeOfCommittee: 'Technology',
      presentationDate: '2024-12-03',
      submissionDate: '2024-12-04',
      proposalStatus: 'Pending',
      productTraded: 'No',
      reputationRisk: 'Medium',
      sponsor: 'Mike Davis',
      coPresident1: 'Tom White',
      coPresident2: 'Laura Green',
      numberOfRestrictions: 1,
      restrictionTypes: 'Type C',
      bookingLocation: 'Location B',
      location: 'Site 2',
      openPreConditions: 'Condition X',
      openPostConditions: 'Condition Y'
    }
  ];

  filteredProducts: Product[] = [...this.products];

  filters: { [key: string]: string } = this.productKeys.reduce((acc, key) => {
    acc[key] = '';
    return acc;
  }, {} as { [key in keyof Product]: string });

  applyFilters() {
    this.filteredProducts = this.products.filter((product) => {
      return Object.keys(this.filters).every((key) => {
        const filterValue = this.filters[key as keyof Product]?.toLowerCase() || '';
        const productValue = product[key as keyof Product]?.toString().toLowerCase() || '';
        return productValue.includes(filterValue);
      });
    });
  }
}
