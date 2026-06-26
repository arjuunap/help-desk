import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Kb } from './kb';

describe('Kb', () => {
  let component: Kb;
  let fixture: ComponentFixture<Kb>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Kb],
    }).compileComponents();

    fixture = TestBed.createComponent(Kb);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
