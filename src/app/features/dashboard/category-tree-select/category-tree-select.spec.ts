import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryTreeSelect } from './category-tree-select';

describe('CategoryTreeSelect', () => {
  let component: CategoryTreeSelect;
  let fixture: ComponentFixture<CategoryTreeSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryTreeSelect],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryTreeSelect);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
