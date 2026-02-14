import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CadastroService } from 'src/app/core/services/cadastro.service';
import { TokenService } from 'src/app/core/services/token.service';
import { UnidadeFederativaService } from 'src/app/core/services/unidade-federativa.service';
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
export class PerfilComponent implements AfterViewInit {
  nome = '';
  tituloPerfil = 'Boas-vindas, ';
  nomeBotaoPerfil = 'Atualizar perfil';
  listaEstados: UnidadeFederativa[] = [];

  private userService = inject(UserService);
  private cadastroService = inject(CadastroService);
  private ufService = inject(UnidadeFederativaService);
  private router = inject(Router);

  ngAfterViewInit(): void {
    // Carrega os dados apenas após a view (e o formBase) estarem prontos
    this.carregarDadosPerfil();
  }

  carregarDadosPerfil(): void {
    // First, load the states
    this.ufService.salvarEstados(this.listaEstados).subscribe({
      complete: () => {
        // Then load the user data
        this.carregarDadosParaForm();
      },
      error: (err) => console.error('Erro ao carregar estados', err),
    });
  }

  atualizar(): void {
    // Pega os valores diretamente do formulário, pois o Service não atualiza automaticamente
    const form = this.cadastroService.cadastroForm;

    if (form?.invalid) return;

    // Prepara o objeto manualmente para garantir dados atualizados

    // const dadosAtualizados: PessoaUsuaria = {
    //   ...form?.getRawValue(),
    // };

    const dadosAtualizados: PessoaUsuaria = {
      nome: form.value.nome,
      nascimento: form.value.nascimento,
      cpf: form.value.cpf,
      telefone: form.value.telefone,
      email: form.value.email,
      senha: form.value.senha,
      genero: form.value.genero,
      cidade: form.value.cidade,
      estado: form.value.estado,
    };

    console.log('dadosAtualizados', dadosAtualizados);

    this.cadastroService.patchCadastro(dadosAtualizados).subscribe({
      next: (cadastro) => {
        this.nome = cadastro.nome;
        console.log('Perfil atualizado com sucesso!');
      },
      error: (err) => console.error('Erro ao atualizar', err),
    });
  }

  editar() {
    //
  }

  deslogar(): void {
    this.userService.logout();
  }

  private carregarDadosParaForm() {
    this.cadastroService.getCadastro().subscribe({
      next: (cadastro) => {
        const estadoSelecionado = this.listaEstados.find(
          (estado) => estado.id === cadastro.estado.id,
        );

        // Mapeia e atualiza o formulário
        this.cadastroService.cadastroForm?.patchValue({
          nome: cadastro.nome,
          nascimento: cadastro.nascimento,
          cpf: cadastro.cpf,
          telefone: cadastro.telefone,
          email: cadastro.email,
          genero: cadastro.genero,
          cidade: cadastro.cidade,
          estado: estadoSelecionado || cadastro.estado,
          confirmarEmail: '',
          senha: '',
          confirmarSenha: '',
        });

        this.nome = cadastro.nome;
      },
      error: (err) => console.error('Erro ao carregar perfil', err),
    });
  }
}
