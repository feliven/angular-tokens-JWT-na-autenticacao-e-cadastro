import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { PessoaUsuaria } from '../types/type';

@Injectable({
  providedIn: 'root',
})
export class CadastroService {
  cadastroForm!: FormGroup;
  private enderecoAPI: string = environment.apiUrl;
  private http = inject(HttpClient);

  getCadastro(): FormGroup {
    return this.cadastroForm;
  }

  setCadastro(form: FormGroup): void {
    this.cadastroForm = form;
  }

  postCadastro() {
    const dadosCadastro: PessoaUsuaria = {
      nome: this.cadastroForm.get('nome')?.value,
      nascimento: this.cadastroForm
        .get('dataNascimento')
        ?.value.toISOString()
        .split('T')[0],
      cpf: this.cadastroForm.get('cpf')?.value,
      telefone: this.cadastroForm.get('telefone')?.value,
      email: this.cadastroForm.get('email')?.value,
      senha: this.cadastroForm.get('senha')?.value,
      genero: this.cadastroForm.get('genero')?.value.valor,
      cidade: this.cadastroForm.get('cidade')?.value,
      estado: this.cadastroForm.get('estado')?.value,
    };

    const endereco = this.enderecoAPI + '/auth/cadastro';

    this.http.post(endereco, dadosCadastro).subscribe((res) => {
      console.log('resposta da API para cadastro:', res);
    });
  }

  patchCadastro() {
    //
  }
}
