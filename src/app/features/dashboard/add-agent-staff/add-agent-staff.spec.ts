import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAgentStaff } from './add-agent-staff';

describe('AddAgentStaff', () => {
  let component: AddAgentStaff;
  let fixture: ComponentFixture<AddAgentStaff>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAgentStaff],
    }).compileComponents();

    fixture = TestBed.createComponent(AddAgentStaff);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
