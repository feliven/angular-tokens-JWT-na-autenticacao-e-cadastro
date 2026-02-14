import { TestBed } from '@angular/core/testing';
import { CadastroService } from './cadastro.service';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { PessoaUsuaria } from '../types/type';

fdescribe('CadastroService', () => {
  let service: CadastroService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CadastroService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(CadastroService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and return the cadastro form', () => {
    const form = new FormGroup({
      test: new FormControl('value'),
    });
    service.setCadastro(form);
    expect(service.returnCadastro()).toBe(form);
  });

  it('should fetch cadastro (perfil) via GET', () => {
    const mockProfile: PessoaUsuaria = {
      nome: 'Test User',
      email: 'test@example.com',
    } as PessoaUsuaria;

    service.getCadastro().subscribe((profile) => {
      expect(profile).toEqual(mockProfile);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/perfil`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProfile);
  });

  it('should update cadastro (perfil) via PATCH', () => {
    const mockUser: PessoaUsuaria = { nome: 'Updated User' } as PessoaUsuaria;

    service.patchCadastro(mockUser).subscribe((response) => {
      expect(response).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/perfil`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(mockUser);
    req.flush(mockUser);
  });

  it('should post cadastro using data from dadosFormCadastro', () => {
    const mockData: PessoaUsuaria = {
      nome: 'New User',
      email: 'new@example.com',
    } as PessoaUsuaria;
    // Manually setting the property because ngAfterViewInit is not auto-called
    service.dadosFormCadastro = mockData;

    service.postCadastro();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/cadastro`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockData);
    req.flush(mockData);
  });

  it('should populate dadosFormCadastro from form when ngAfterViewInit is called', () => {
    const date = new Date('2000-01-01T12:00:00Z');
    const form = new FormGroup({
      nome: new FormControl('John Doe'),
      dataNascimento: new FormControl(date),
      cpf: new FormControl('12345678900'),
      telefone: new FormControl('123456789'),
      email: new FormControl('john@example.com'),
      senha: new FormControl('password'),
      genero: new FormControl({ valor: 'M' }),
      cidade: new FormControl('City'),
      estado: new FormControl('State'),
    });

    service.setCadastro(form);
    service.ngAfterViewInit();

    expect(service.dadosFormCadastro).toEqual(
      jasmine.objectContaining({
        nome: 'John Doe',
        nascimento: '2000-01-01',
        cpf: '12345678900',
        telefone: '123456789',
        email: 'john@example.com',
        senha: 'password',
        genero: 'M',
        cidade: 'City',
        estado: 'State',
      }),
    );
  });

  it('should log API response after posting cadastro', () => {
    const mockData: PessoaUsuaria = {
      nome: 'Log User',
      nascimento: '2002-02-02',
      cpf: '11122233344',
      telefone: '11999998888',
      email: 'log@example.com',
      senha: '123456',
      genero: null,
      cidade: 'Sao Paulo',
      estado: { id: 1, nome: 'Sao Paulo', sigla: 'SP' },
    };
    const consoleSpy = spyOn(console, 'log');
    service.dadosFormCadastro = mockData;

    service.postCadastro();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/cadastro`);
    req.flush(mockData);
    expect(consoleSpy).toHaveBeenCalledWith(
      'resposta da API para post no cadastro:',
      mockData,
    );
  });

  it('should send undefined body when postCadastro is called before form mapping', () => {
    service.postCadastro();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/cadastro`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBeNull();
    req.flush({});
  });

  it('should throw when dataNascimento is missing in ngAfterViewInit', () => {
    const form = new FormGroup({
      nome: new FormControl('John Doe'),
      dataNascimento: new FormControl(null),
      cpf: new FormControl('12345678900'),
      telefone: new FormControl('123456789'),
      email: new FormControl('john@example.com'),
      senha: new FormControl('password'),
      genero: new FormControl({ valor: 'M' }),
      cidade: new FormControl('City'),
      estado: new FormControl('State'),
    });
    service.setCadastro(form);

    expect(() => service.ngAfterViewInit()).toThrow();
  });

  it('should throw when genero object is missing valor in ngAfterViewInit', () => {
    const form = new FormGroup({
      nome: new FormControl('Jane Doe'),
      dataNascimento: new FormControl(new Date('2001-01-01T12:00:00Z')),
      cpf: new FormControl('12345678900'),
      telefone: new FormControl('123456789'),
      email: new FormControl('jane@example.com'),
      senha: new FormControl('password'),
      genero: new FormControl(null),
      cidade: new FormControl('City'),
      estado: new FormControl('State'),
    });
    service.setCadastro(form);

    expect(() => service.ngAfterViewInit()).toThrow();
  });
});
