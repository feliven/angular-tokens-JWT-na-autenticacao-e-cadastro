import { TestBed } from '@angular/core/testing';
import { TokenService } from './token.service';

fdescribe('TokenService', () => {
  let service: TokenService;
  const tokenKey = 'token';
  const mockToken = 'dummy-token';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TokenService],
    });
    service = TestBed.inject(TokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('salvarToken', () => {
    it('should save the token to localStorage', () => {
      const setItemSpy = spyOn(localStorage, 'setItem');
      service.salvarToken(mockToken);
      expect(setItemSpy).toHaveBeenCalledWith(tokenKey, mockToken);
    });

    it('should log error when localStorage.setItem fails', () => {
      const consoleSpy = spyOn(console, 'error');
      spyOn(localStorage, 'setItem').and.throwError('Error');
      service.salvarToken(mockToken);
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('retornarToken', () => {
    it('should return the token from localStorage if it exists', () => {
      spyOn(localStorage, 'getItem').and.returnValue(mockToken);
      const result = service.retornarToken();
      expect(result).toBe(mockToken);
    });

    it('should return an empty string if token does not exist', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      const result = service.retornarToken();
      expect(result).toBe('');
    });
  });

  describe('excluirToken', () => {
    it('should remove the token from localStorage', () => {
      const removeItemSpy = spyOn(localStorage, 'removeItem');
      service.excluirToken();
      expect(removeItemSpy).toHaveBeenCalledWith(tokenKey);
    });

    it('should log error when localStorage.removeItem fails', () => {
      const consoleSpy = spyOn(console, 'error');
      spyOn(localStorage, 'removeItem').and.throwError('Error');
      service.excluirToken();
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('possuiToken', () => {
    it('should return true if token exists', () => {
      spyOn(localStorage, 'getItem').and.returnValue(mockToken);
      expect(service.possuiToken()).toBeTrue();
    });

    it('should return false if token does not exist', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      expect(service.possuiToken()).toBeFalse();
    });
  });
});
