import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RisqueEvaluationComponent } from './risque-evaluation.component';

describe('RisqueEvaluationComponent', () => {
  let component: RisqueEvaluationComponent;
  let fixture: ComponentFixture<RisqueEvaluationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RisqueEvaluationComponent]
    });
    fixture = TestBed.createComponent(RisqueEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
