import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterTicketComponent } from './tickets';

describe('Tickets', () => {
  let component: RegisterTicketComponent;
  let fixture: ComponentFixture<RegisterTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterTicketComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterTicketComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
