import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskPageComponent } from './risk-page.component';

describe('RiskPageComponent', () => {
  let component: RiskPageComponent;
  let fixture: ComponentFixture<RiskPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RiskPageComponent]
    });
    fixture = TestBed.createComponent(RiskPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
