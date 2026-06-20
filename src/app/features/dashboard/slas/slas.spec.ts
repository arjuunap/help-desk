import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Slas } from './slas';

describe('Slas', () => {
  let component: Slas;
  let fixture: ComponentFixture<Slas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Slas],
    }).compileComponents();

    fixture = TestBed.createComponent(Slas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
