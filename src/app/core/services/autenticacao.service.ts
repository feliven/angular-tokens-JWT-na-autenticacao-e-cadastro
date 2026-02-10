import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AutenticacaoService {
  private enderecoAPI: string = environment.apiUrl;

  private http = inject(HttpClient);

  autenticar(email: string, senha: string): Observable<any> {
    const endereco = this.enderecoAPI + '/auth/login';

    return this.http.post(endereco, { email, senha });
  }
}
