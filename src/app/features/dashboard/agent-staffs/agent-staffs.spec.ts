import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentStaffs } from './agent-staffs';

describe('AgentStaffs', () => {
  let component: AgentStaffs;
  let fixture: ComponentFixture<AgentStaffs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentStaffs],
    }).compileComponents();

    fixture = TestBed.createComponent(AgentStaffs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
