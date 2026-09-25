import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtenderCita } from './atender-cita';

describe('AtenderCita', () => {
  let component: AtenderCita;
  let fixture: ComponentFixture<AtenderCita>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtenderCita],
    }).compileComponents();

    fixture = TestBed.createComponent(AtenderCita);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
