import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationDesRisquesComponent } from './validation-des-risques.component';

describe('ValidationDesRisquesComponent', () => {
  let component: ValidationDesRisquesComponent;
  let fixture: ComponentFixture<ValidationDesRisquesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ValidationDesRisquesComponent]
    });
    fixture = TestBed.createComponent(ValidationDesRisquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
