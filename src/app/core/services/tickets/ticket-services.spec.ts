import { TestBed } from '@angular/core/testing';

import { TicketServices } from './ticket-services';

describe('TicketServices', () => {
  let service: TicketServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
