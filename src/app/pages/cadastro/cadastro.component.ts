import { Component, inject } from '@angular/core';

import { BannerComponent } from 'src/app/shared/banner/banner.component';
import { FormBaseComponent } from 'src/app/shared/form-base/form-base.component';
import { FormularioService } from 'src/app/core/services/formulario.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cadastro',
  imports: [BannerComponent, FormBaseComponent],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss',
})
export class CadastroComponent {
  private formularioService = inject(FormularioService);
  formularioSalvo = new FormGroup({});

  constructor() {}

  cadastrar() {
    const cadastroForm: FormGroup = this.formularioService.getCadastro();
    this.formularioService.setCadastro(cadastroForm);
    this.formularioService.postCadastro();
  }
}
