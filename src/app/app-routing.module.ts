import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductFormComponent } from './product-form/product-form.component';
import { ReportComponent } from './components/report/report.component';
import { ValidationGridComponent } from './components/validation-grid/validation-grid.component'; // Import ValidationGridComponent
import { ProductValidationGridComponent } from './components/product-validation-grid/product-validation-grid.component';
import { ValidationDesRisquesComponent } from './components/validation-des-risques/validation-des-risques.component';
import { StepperComponent } from './components/stepper/stepper.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RisqueEvaluationComponent } from './components/risque-evaluation/risque-evaluation.component';

const routes: Routes = [
  { path: '', redirectTo: 'product-form', pathMatch: 'full' },
  { path: 'product-form', component: ProductFormComponent },
  { path: 'report', component: ReportComponent },
  { path: 'validation-grid', component: ValidationGridComponent },
  { path: 'product-grid', component: ProductValidationGridComponent },
  { path: 'validation-risques', component: ValidationDesRisquesComponent },
  { path: 'stepper', component: StepperComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'risques', component:  RisqueEvaluationComponent},


  // Add the route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
