import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { PessoaUsuaria } from '../types/type';

fdescribe('UserService', () => {
  let service: UserService;
  // token store shared by mock TokenService
  let mockTokenStore: string | null;
  // token used for tests (decodes to id=1, username=john, email=john@example.com)
  const tokenForJohn =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
    'eyJpZCI6MSwidXNlcm5hbWUiOiJqb2huIiwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIn0.' +
    'signature';

  // Mock TokenService with shared tokenStore
  const tokenServiceMock = {
    possuiToken: () => !!mockTokenStore,
    retornarToken: () => mockTokenStore as string,
    salvarToken: (t: string) => {
      mockTokenStore = t;
    },
    excluirToken: () => {
      mockTokenStore = null;
    },
  } as unknown as TokenService;

  // Mock Router with spy
  const routerMock = {
    navigate: jasmine.createSpy('navigate'),
  } as unknown as Router;

  // Helper to (re)initialize TestBed and create the service instance
  function setupTestBed() {
    TestBed.configureTestingModule({
      providers: [
        { provide: TokenService, useValue: tokenServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });
    service = TestBed.inject(UserService);
  }

  beforeEach(() => {
    mockTokenStore = null;
    (routerMock.navigate as jasmine.Spy).calls.reset?.();
  });

  it('should be created', () => {
    setupTestBed();
    expect(service).toBeTruthy();
  });

  it('should decode and set user when a token exists at construction', () => {
    mockTokenStore = tokenForJohn;
    setupTestBed();

    let lastUser: any = null;
    service.retornarUsuario().subscribe((u) => (lastUser = u));

    expect(lastUser).toEqual(
      jasmine.objectContaining({
        id: 1,
        username: 'john',
        email: 'john@example.com',
      } as any),
    );
  });

  it('salvarToken should save token and decode it', () => {
    setupTestBed();

    let lastUser: any = null;
    service.retornarUsuario().subscribe((u) => (lastUser = u));

    // Save a new token; this should trigger decoding and update user subject
    service.salvarToken(tokenForJohn);

    expect(mockTokenStore).toBe(tokenForJohn);
    expect(lastUser).toEqual(
      jasmine.objectContaining({
        id: 1,
        username: 'john',
        email: 'john@example.com',
      } as any),
    );
  });

  it('estaLogado should reflect token presence', () => {
    // Initially no token
    setupTestBed();
    expect(service.estaLogado()).toBe(false);

    // Now simulate a token being present and re-create the service
    mockTokenStore = tokenForJohn;
    (TestBed as any).resetTestingModule();
    setupTestBed();
    expect(service.estaLogado()).toBe(true);
  });

  it('logout should clear token, reset user and navigate to login', () => {
    mockTokenStore = tokenForJohn;
    setupTestBed();

    let currentUser: any = null;
    service.retornarUsuario().subscribe((u) => (currentUser = u));

    service.logout();

    expect(mockTokenStore).toBeNull();
    expect(currentUser).toBeNull();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});
