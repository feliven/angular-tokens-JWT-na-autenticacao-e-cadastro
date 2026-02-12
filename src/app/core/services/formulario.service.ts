import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormularioService {
  cadastroForm: FormGroup = new FormGroup({});

  getCadastro(): FormGroup {
    return this.cadastroForm;
  }

  setCadastro(form: FormGroup): void {
    this.cadastroForm = form;
  }
}
