import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UnidadeFederativa } from '../types/type';

@Injectable({
  providedIn: 'root',
})
export class UnidadeFederativaService {
  private apiUrl: string = environment.apiUrl;
  private cache$?: Observable<UnidadeFederativa[]>;

  constructor(private http: HttpClient) {}

  listarEstados(): Observable<UnidadeFederativa[]> {
    if (!this.cache$) {
      this.cache$ = this.requestEstados().pipe(shareReplay(1));
    }

    return this.cache$;
  }

  salvarEstados(
    listaEstados: UnidadeFederativa[],
  ): Observable<UnidadeFederativa[]> {
    return this.listarEstados().pipe(
      // Use an Observer object ({ next: ... }) instead of a bare function
      tap({
        next: (estados) => {
          // estados.forEach((estado) => listaEstados.push(estado));

          // Tip: You can also use the spread operator to push all items at once
          listaEstados.push(...estados);
        },
      }),
    );
  }

  private requestEstados(): Observable<UnidadeFederativa[]> {
    return this.http.get<UnidadeFederativa[]>(`${this.apiUrl}/estados`);
  }
}
