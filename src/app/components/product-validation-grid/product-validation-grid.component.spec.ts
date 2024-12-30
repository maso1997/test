import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductValidationGridComponent } from './product-validation-grid.component';

describe('ProductValidationGridComponent', () => {
  let component: ProductValidationGridComponent;
  let fixture: ComponentFixture<ProductValidationGridComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductValidationGridComponent]
    });
    fixture = TestBed.createComponent(ProductValidationGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
