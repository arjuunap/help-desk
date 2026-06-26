import { TestBed } from '@angular/core/testing';

import { KbArticlesService } from './kb-articles-service';

describe('KbArticlesService', () => {
  let service: KbArticlesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KbArticlesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
