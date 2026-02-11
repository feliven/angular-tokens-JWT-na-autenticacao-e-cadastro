import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
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

  formBase!: FormGroup;
  private formBuilder = inject(FormBuilder);
  private ufService = inject(UnidadeFederativaService);

  generoControl = new FormControl(null, Validators.required);
  generos = [
    { nome: 'Feminino', valor: 'feminino' },
    { nome: 'Masculino', valor: 'masculino' },
    { nome: 'Não informar', valor: 'naoInformar' },
  ];

  estadoControl = new FormControl<UnidadeFederativa | null>(
    null,
    Validators.required,
  );
  listaEstados: UnidadeFederativa[] = [];

  ngOnInit(): void {
    this.formBase = this.formBuilder.group({
      nome: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      genero: this.generoControl,
      cpf: ['', Validators.required],
      telefone: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: this.estadoControl,
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(3)]],
      confirmarEmail: ['', [Validators.required, Validators.email]],
      confirmarSenha: ['', [Validators.required, Validators.minLength(3)]],
    });

    this.ufService.listarEstados().subscribe({
      next: (estados) => {
        estados.forEach((estado) => this.listaEstados.push(estado));
        console.log(this.listaEstados);
      },
      error: (erro) => {
        console.error('Erro', erro);
      },
    });

    this.printFormBase();
  }

  printFormBase() {
    this.formBase.valueChanges.subscribe((form) => {
      console.log(form);
      console.log(form.dataNascimento.toISOString().split('T')[0]);
    });
  }
}
