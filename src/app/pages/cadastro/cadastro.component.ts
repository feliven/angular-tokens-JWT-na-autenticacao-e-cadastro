import { Component, inject } from '@angular/core';

import { BannerComponent } from 'src/app/shared/banner/banner.component';
import { FormBaseComponent } from 'src/app/shared/form-base/form-base.component';
import { CadastroService } from 'src/app/core/services/cadastro.service';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  imports: [BannerComponent, FormBaseComponent],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss',
})
export class CadastroComponent {
  private formularioService = inject(CadastroService);
  tituloCadastro = 'Crie sua conta';
  nomeBotaoCadastro = 'Criar minha conta';

  formularioSalvo = new FormGroup({});
  private router = inject(Router);

  constructor() {}

  cadastrar() {
    const cadastroForm: FormGroup = this.formularioService.getCadastro();
    this.formularioService.setCadastro(cadastroForm);
    this.formularioService.postCadastro();
    this.router.navigate(['/login']);
  }
}
