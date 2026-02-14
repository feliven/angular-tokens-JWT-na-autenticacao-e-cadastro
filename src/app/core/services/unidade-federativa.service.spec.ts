import { TestBed } from '@angular/core/testing';
import { UnidadeFederativaService } from './unidade-federativa.service';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { UnidadeFederativa } from '../types/type';
import { environment } from 'src/environments/environment';

fdescribe('UnidadeFederativaService', () => {
  let service: UnidadeFederativaService;
  let httpMock: HttpTestingController;

  // Mocked data for estados
  const mockEstados: UnidadeFederativa[] = [
    { id: 1, sigla: 'SP', nome: 'São Paulo' },
    { id: 2, sigla: 'RJ', nome: 'Rio de Janeiro' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UnidadeFederativaService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(UnidadeFederativaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('listarEstados should fetch and cache results', () => {
    // First call - triggers HTTP request
    service.listarEstados().subscribe((res) => {
      expect(res).toEqual(mockEstados);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/estados`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEstados);

    // Second call - should receive cached data without new request
    service.listarEstados().subscribe((cached) => {
      expect(cached).toEqual(mockEstados);
    });

    httpMock.expectNone(`${environment.apiUrl}/estados`);
  });

  it('salvarEstados should push fetched estados into provided list', () => {
    const listaEstados: UnidadeFederativa[] = [];

    service.salvarEstados(listaEstados).subscribe((res) => {
      expect(res).toEqual(mockEstados);
      expect(listaEstados).toEqual(mockEstados);
      expect(listaEstados.length).toBe(2);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/estados`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEstados);
  });
});
