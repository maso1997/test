import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductFormComponent } from './product-form/product-form.component';
import { RiskListComponent } from './components/risks/risk-list/risk-list.component';
import { ReportComponent } from './components/report/report.component';

const routes: Routes = [{
  
  path: '', redirectTo: 'product-form', pathMatch: 'full' }, 
   {path: 'product-form', component: ProductFormComponent },
   { path: 'risk-list', component: RiskListComponent },
   { path: 'report', component: ReportComponent },




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
