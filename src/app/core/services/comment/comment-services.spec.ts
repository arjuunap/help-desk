import { TestBed } from '@angular/core/testing';

import { CommentServices } from './comment-services';

describe('CommentServices', () => {
  let service: CommentServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
