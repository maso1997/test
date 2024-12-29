import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationGridComponent } from './validation-grid.component';

describe('ValidationGridComponent', () => {
  let component: ValidationGridComponent;
  let fixture: ComponentFixture<ValidationGridComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ValidationGridComponent]
    });
    fixture = TestBed.createComponent(ValidationGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
