import { TestBed } from '@angular/core/testing';
import { AutenticacaoService } from './autenticacao.service';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';

fdescribe('AutenticacaoService', () => {
  let service: AutenticacaoService;
  let httpMock: HttpTestingController;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    userServiceSpy = jasmine.createSpyObj<UserService>('UserService', [
      'salvarToken',
    ]);

    TestBed.configureTestingModule({
      providers: [
        AutenticacaoService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: UserService, useValue: userServiceSpy },
      ],
    });

    service = TestBed.inject(AutenticacaoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should POST to /auth/login with email and senha', () => {
    const email = 'usuario@teste.com';
    const senha = '123456';

    service.autenticar(email, senha).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email, senha });
    expect(req.request.responseType).toBe('json');
    req.flush({ access_token: 'jwt-token' });
  });

  it('should save token from response body', () => {
    const email = 'usuario@teste.com';
    const senha = '123456';
    const token = 'jwt-token';

    service.autenticar(email, senha).subscribe((response) => {
      expect(response.status).toBe(200);
      expect(response.body?.access_token).toBe(token);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    req.flush({ access_token: token }, { status: 200, statusText: 'OK' });

    expect(userServiceSpy.salvarToken).toHaveBeenCalledWith(token);
    expect(userServiceSpy.salvarToken).toHaveBeenCalledTimes(1);
  });

  it('should save empty string when access_token is missing in response body', () => {
    service.autenticar('usuario@teste.com', '123456').subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    req.flush({});

    expect(userServiceSpy.salvarToken).toHaveBeenCalledWith('');
  });

  it('should not save token when request fails', () => {
    service.autenticar('usuario@teste.com', '123456').subscribe({
      next: fail,
      error: (error) => {
        expect(error.status).toBe(401);
      },
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    req.flush(
      { mensagem: 'Nao autorizado' },
      { status: 401, statusText: 'Unauthorized' },
    );

    expect(userServiceSpy.salvarToken).not.toHaveBeenCalled();
  });

  it('should observe full HTTP response', () => {
    service.autenticar('usuario@teste.com', '123456').subscribe((response) => {
      expect(response.status).toBe(201);
      expect(response.headers.get('X-Test')).toBe('header-value');
      expect(response.body).toEqual({ access_token: 'jwt-token' });
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    req.flush(
      { access_token: 'jwt-token' },
      {
        status: 201,
        statusText: 'Created',
        headers: { 'X-Test': 'header-value' },
      },
    );
  });
});
