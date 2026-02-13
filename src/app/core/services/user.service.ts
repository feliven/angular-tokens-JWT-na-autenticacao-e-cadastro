import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

import { TokenService } from './token.service';
import { CadastroForm } from '../types/type';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private tokenService = inject(TokenService);

  private userSubject = new BehaviorSubject<CadastroForm | null>(null);

  constructor() {
    if (this.tokenService.possuiToken()) {
      this.decodificarJWT();
    }
  }

  decodificarJWT(): void {
    const token = this.tokenService.retornarToken();
    console.log('token JWT:', token);
    const usuario = jwtDecode(token) as CadastroForm;
    console.log('usuário:', usuario);
    this.userSubject.next(usuario);
  }

  retornarUsuario(): Observable<CadastroForm | null> {
    return this.userSubject.asObservable();
  }

  salvarToken(token: string): void {
    this.tokenService.salvarToken(token);
    this.decodificarJWT();
  }

  estaLogado(): boolean {
    return this.tokenService.possuiToken();
  }

  logout(): void {
    this.tokenService.excluirToken();
    this.userSubject.next(null);
  }
}
