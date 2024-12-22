import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskListComponent } from './risk-list.component';

describe('RiskListComponent', () => {
  let component: RiskListComponent;
  let fixture: ComponentFixture<RiskListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RiskListComponent]
    });
    fixture = TestBed.createComponent(RiskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
