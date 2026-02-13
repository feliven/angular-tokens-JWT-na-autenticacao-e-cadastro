import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';

interface AuthResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AutenticacaoService {
  private enderecoAPI: string = environment.apiUrl;

  private http = inject(HttpClient);
  private userService = inject(UserService);

  autenticar(
    email: string,
    senha: string,
  ): Observable<HttpResponse<AuthResponse>> {
    const endereco = this.enderecoAPI + '/auth/login';

    const loginResponse = this.http.post<AuthResponse>(
      endereco,
      { email, senha },
      { observe: 'response' },
    );

    return loginResponse.pipe(
      tap((resposta) => {
        console.log('resposta:', resposta);
        const authToken = resposta.body?.access_token || '';
        console.log('auth token:', authToken);
        this.userService.salvarToken(authToken);
      }),
    );
  }
}
