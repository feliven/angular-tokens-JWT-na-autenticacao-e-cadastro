import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CadastroService } from 'src/app/core/services/cadastro.service';
import { TokenService } from 'src/app/core/services/token.service';
import { UserService } from 'src/app/core/services/user.service';
import { PessoaUsuaria, UnidadeFederativa } from 'src/app/core/types/type';
import { BannerComponent } from 'src/app/shared/banner/banner.component';
import { FormBaseComponent } from 'src/app/shared/form-base/form-base.component';

@Component({
  selector: 'app-perfil',
  imports: [BannerComponent, FormBaseComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss',
})
export class PerfilComponent implements OnInit, AfterViewInit {
  @ViewChild(FormBaseComponent) formBase!: FormBaseComponent;

  dadosCadastro!: PessoaUsuaria;
  token = '';
  nome = '';
  tituloPerfil = 'Boas-vindas, ';
  nomeBotaoPerfil = 'Atualizar perfil';
  form!: FormGroup;

  private userService = inject(UserService);
  private cadastroService = inject(CadastroService);
  private tokenService = inject(TokenService);
  private router = inject(Router);

  ngOnInit(): void {
    this.token = this.tokenService.retornarToken();
  }

  ngAfterViewInit(): void {
    this.recuperarDadosPerfil();
  }

  recuperarDadosPerfil() {
    if (!this.userService.estaLogado()) return;

    this.form = this.cadastroService.cadastroForm;

    this.cadastroService.getCadastro(this.token).subscribe((cadastro) => {
      this.dadosCadastro = cadastro;
      this.nome = this.dadosCadastro.nome;

      if (this.form) {
        this.form.patchValue(this.mapCadastroToForm(cadastro));
      }

      console.log('this.form', this.form);
    });
  }

  private mapCadastroToForm(cadastro: PessoaUsuaria) {
    // Find the matching genero object
    const generoEncontrado = this.formBase.generos.find(
      (g: any) => g.valor === cadastro.genero,
    );

    // Find the matching estado object from listaEstados
    const estadoEncontrado = this.formBase.listaEstados.find(
      (e: UnidadeFederativa) =>
        e.id === cadastro.estado?.id || e.nome === cadastro.estado?.nome,
    );

    return {
      nome: cadastro.nome,
      dataNascimento: cadastro.nascimento,
      cpf: cadastro.cpf,
      telefone: cadastro.telefone,
      email: cadastro.email,
      confirmarEmail: '',
      senha: '',
      confirmarSenha: '',
      genero: generoEncontrado,
      cidade: cadastro.cidade,
      estado: estadoEncontrado || null,
    };
  }

  atualizar() {
    if (!this.userService.estaLogado()) return;

    this.dadosCadastro = this.cadastroService.dadosFormCadastro;

    this.cadastroService
      .patchCadastro(this.dadosCadastro, this.token)
      .subscribe((cadastro) => {
        this.dadosCadastro = cadastro;
        this.nome = this.dadosCadastro.nome;
        console.log('resposta da API para patch no cadastro:', cadastro);
      });
  }

  deslogar() {
    this.userService.logout();
    console.log('estaLogado():', this.userService.estaLogado());
    this.router.navigate(['/']);
  }
}
