import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacienteDashboard } from './paciente-dashboard';

describe('PacienteDashboard', () => {
  let component: PacienteDashboard;
  let fixture: ComponentFixture<PacienteDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacienteDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(PacienteDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
