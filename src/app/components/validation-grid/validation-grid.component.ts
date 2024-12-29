import { Component } from '@angular/core';

@Component({
  selector: 'app-validation-grid',
  templateUrl: './validation-grid.component.html',
  styleUrls: ['./validation-grid.component.scss']
})
export class ValidationGridComponent {
  data = [
    {
      branch: 'Finance',
      approver: 'John Doe',
      opinion: 'Approved',
      conditionId: 'COND001',
      category: 'Category A',
      comments: 'All good',
      responsible: 'Jane Smith',
      targetDate: '4 weeks',
    },
    {
      branch: 'HR',
      approver: 'Anna White',
      opinion: 'Pending',
      conditionId: 'COND002',
      category: 'Category B',
      comments: 'Requires review',
      responsible: 'John Brown',
      targetDate: '2 weeks',
    },
    {
      branch: 'IT',
      approver: 'Mike Brown',
      opinion: 'Rejected',
      conditionId: 'CND003',
      category: 'Technology',
      comments: 'Inadequate risk assessment',
      responsible: 'Sophia Davis',
      targetDate: '3 weeks'
    },
    {
      branch: 'Logistics',
      approver: 'Anna Taylor',
      opinion: 'Approved',
      conditionId: 'CND004',
      category: 'Operations',
      comments: 'Optimize delivery routes',
      responsible: 'Jack Wilson',
      targetDate: '6 weeks'
    },
    {
      branch: 'Marketing',
      approver: 'Olivia Johnson',
      opinion: 'Pending',
      conditionId: 'CND005',
      category: 'Advertising',
      comments: 'Campaign budget allocation',
      responsible: 'William Martin',
      targetDate: '5 weeks'
    },
    {
      branch: 'Sales',
      approver: 'James Anderson',
      opinion: 'Approved',
      conditionId: 'CND006',
      category: 'Retail',
      comments: 'Incentivize top performers',
      responsible: 'Ava Thompson',
      targetDate: '1 week'
    },
    {
      branch: 'R&D',
      approver: 'Sophia Lee',
      opinion: 'Rejected',
      conditionId: 'CND007',
      category: 'Innovation',
      comments: 'Insufficient data analysis',
      responsible: 'Liam White',
      targetDate: '8 weeks'
    },
    {
      branch: 'Procurement',
      approver: 'Benjamin Harris',
      opinion: 'Approved',
      conditionId: 'CND008',
      category: 'Purchasing',
      comments: 'Vendor compliance',
      responsible: 'Isabella King',
      targetDate: '7 weeks'
    },
    {
      branch: 'Admin',
      approver: 'Charlotte Hall',
      opinion: 'Pending',
      conditionId: 'CND009',
      category: 'Management',
      comments: 'Streamline internal workflows',
      responsible: 'Lucas Walker',
      targetDate: '3 weeks'
    },
    {
      branch: 'Legal',
      approver: 'Amelia Scott',
      opinion: 'Approved',
      conditionId: 'CND010',
      category: 'Compliance',
      comments: 'Review contract clauses',
      responsible: 'Mason Young',
      targetDate: '2 weeks'
    }
    // Add more entries as needed
  ];

  filteredData = [...this.data];

  filters = {
    branch: '',
    approver: '',
    opinion: '',
    conditionId: '',
    category: '',
    comments: '',
    responsible: '',
    targetDate: '',
  };

  applyFilters() {
    this.filteredData = this.data.filter((item) => {
      return Object.keys(this.filters).every((key) => {
        const filterValue = this.filters[key as keyof typeof this.filters]?.toLowerCase();
        const itemValue = item[key as keyof typeof item]?.toString().toLowerCase();
        return filterValue ? itemValue.includes(filterValue) : true;
      });
    });
  }
}
