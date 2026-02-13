import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';

import { UnidadeFederativaService } from 'src/app/core/services/unidade-federativa.service';
import { UnidadeFederativa } from 'src/app/core/types/type';
import { ContainerComponent } from '../container/container.component';
import { FormularioService } from 'src/app/core/services/formulario.service';
import { FormValidations } from 'src/app/core/validators/form-validators';

@Component({
  selector: 'app-form-base',
  imports: [
    ContainerComponent,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatSelectModule,
    MatDatepickerModule,
    MatIconModule,
    MatNativeDateModule,
    MatDividerModule,
  ],
  templateUrl: './form-base.component.html',
  styleUrl: './form-base.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormBaseComponent implements OnInit {
  titulo = input('');
  nomeBotao = input('');
  meuPerfil = input(true);
  submitClicado = output<void>();
  deslogarClicado = output<void>();

  formBase!: FormGroup;
  private formBuilder = inject(FormBuilder);
  private ufService = inject(UnidadeFederativaService);
  private formularioService = inject(FormularioService);

  generos = [
    { nome: 'Feminino', valor: 'feminino' },
    { nome: 'Masculino', valor: 'masculino' },
    { nome: 'Não informar', valor: 'naoInformar' },
  ];
  generoControl = new FormControl(this.generos[0], Validators.required);

  estadoControl = new FormControl<UnidadeFederativa | null>(
    null,
    Validators.required,
  );
  listaEstados: UnidadeFederativa[] = [];

  ngOnInit(): void {
    this.formBase = this.formBuilder.group({
      nome: ['drerewe', Validators.required],
      dataNascimento: [
        new Date('1990-1-2').toISOString().split('T')[0],
        Validators.required,
      ],
      genero: this.generoControl,
      cpf: ['3213123', Validators.required],
      telefone: ['26887667', Validators.required],
      cidade: ['dfsfds', Validators.required],
      estado: this.estadoControl,
      email: ['a@b', [Validators.required, Validators.email]],
      senha: ['111', [Validators.required, Validators.minLength(3)]],
      confirmarEmail: [
        'a@c',
        [
          Validators.required,
          Validators.email,
          FormValidations.ehIgual('email'),
        ],
      ],
      confirmarSenha: [
        '222',
        [
          Validators.required,
          Validators.minLength(3),
          FormValidations.ehIgual('senha'),
        ],
      ],
    });

    this.formularioService.setCadastro(this.formBase);

    this.ufService.listarEstados().subscribe({
      next: (estados) => {
        estados.forEach((estado) => this.listaEstados.push(estado));
        this.estadoControl.setValue(this.listaEstados[5]);
      },
      error: (erro) => {
        console.error('Erro', erro);
      },
    });
  }

  printFormBase() {
    this.formBase.valueChanges.subscribe((form) => {
      console.log(form);
    });
  }

  onSubmit() {
    this.submitClicado.emit();
  }

  onDeslogar() {
    this.deslogarClicado.emit();
  }
}
