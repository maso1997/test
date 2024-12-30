import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { RiskListComponent } from './components/risks/risk-list/risk-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReportComponent } from './components/report/report.component';
import { RiskService } from './services/risk.service';
import { TableFilterComponent } from './components/table-filter/table-filter.component';
import { ValidationGridComponent } from './components/validation-grid/validation-grid.component';
import { ProductValidationGridComponent } from './components/product-validation-grid/product-validation-grid.component';
@NgModule({
  declarations: [
    AppComponent,
    ProductFormComponent,
    RiskListComponent,
    ReportComponent,
    TableFilterComponent,
    ValidationGridComponent,
    ProductValidationGridComponent,
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
    
  ],
  providers: [RiskService],
  bootstrap: [AppComponent]
})
export class AppModule { }
