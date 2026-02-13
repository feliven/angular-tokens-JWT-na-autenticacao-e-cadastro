import { Component, inject, OnInit } from '@angular/core';
import { FormularioService } from 'src/app/core/services/formulario.service';
import { UserService } from 'src/app/core/services/user.service';
import { BannerComponent } from 'src/app/shared/banner/banner.component';
import { FormBaseComponent } from 'src/app/shared/form-base/form-base.component';

@Component({
  selector: 'app-perfil',
  imports: [BannerComponent, FormBaseComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss',
})
export class PerfilComponent implements OnInit {
  tituloPerfil = 'Boas-vindas!';
  nomeBotaoPerfil = 'Atualizar perfil';
  private userService = inject(UserService);
  private formularioService = inject(FormularioService);

  ngOnInit(): void {
    this.recuperarDadosPerfil();
  }

  recuperarDadosPerfil() {
    if (this.userService.estaLogado()) {
      this.userService.retornarUsuario().subscribe();
    }
  }

  atualizar() {
    this.formularioService.patchCadastro();
  }

  deslogar() {
    this.userService.logout();
  }
}
