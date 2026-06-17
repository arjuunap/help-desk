import { TestBed } from '@angular/core/testing';

import { SlaPolicyServices } from './sla-policy-services';

describe('SlaPolicyServices', () => {
  let service: SlaPolicyServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SlaPolicyServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
