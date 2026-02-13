import { Injectable } from '@angular/core';

const KEY = 'token';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  salvarToken(token: string) {
    try {
      localStorage.setItem(KEY, token);
    } catch (error) {
      console.error(error);
    }
  }

  excluirToken() {
    try {
      localStorage.removeItem(KEY);
    } catch (error) {
      console.error(error);
    }
  }

  retornarToken() {
    return localStorage.getItem(KEY) ?? '';
  }

  possuiToken() {
    return !!this.retornarToken();
  }
}
