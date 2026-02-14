import { HttpClient } from '@angular/common/http';
import { AfterViewInit, inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { PessoaUsuaria } from '../types/type';

@Injectable({
  providedIn: 'root',
})
export class CadastroService implements AfterViewInit {
  cadastroForm!: FormGroup;
  dadosFormCadastro!: PessoaUsuaria;
  private enderecoAPI: string = environment.apiUrl;
  private http = inject(HttpClient);

  ngAfterViewInit(): void {
    this.dadosFormCadastro = {
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
  }

  returnCadastro(): FormGroup {
    return this.cadastroForm;
  }

  setCadastro(form: FormGroup): void {
    this.cadastroForm = form;
  }

  postCadastro() {
    const dadosCadastro: PessoaUsuaria = this.dadosFormCadastro;

    const endereco = this.enderecoAPI + '/auth/cadastro';

    this.http.post<PessoaUsuaria>(endereco, dadosCadastro).subscribe((res) => {
      console.log('resposta da API para post no cadastro:', res);
    });
  }

  getCadastro() {
    const endereco = this.enderecoAPI + '/auth/perfil';

    return this.http.get<PessoaUsuaria>(endereco);
  }

  patchCadastro(usuario: PessoaUsuaria) {
    const endereco = this.enderecoAPI + '/auth/perfil';

    return this.http.patch<PessoaUsuaria>(endereco, usuario);
  }
}
