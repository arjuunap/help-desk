import { TestBed } from '@angular/core/testing';

import { AgentServices } from './agent-services';

describe('AgentServices', () => {
  let service: AgentServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
