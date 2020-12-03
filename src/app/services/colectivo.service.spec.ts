import { TestBed } from '@angular/core/testing';

import { ColectivoService } from './colectivo.service';

describe('ColectivoService', () => {
  let service: ColectivoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColectivoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
