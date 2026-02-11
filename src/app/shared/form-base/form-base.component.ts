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
} from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

import { UnidadeFederativaService } from 'src/app/core/services/unidade-federativa.service';
import { UnidadeFederativa } from 'src/app/core/types/type';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-form-base',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatSelectModule,
    MatDatepickerModule,
    MatIconModule,
  ],
  templateUrl: './form-base.component.html',
  styleUrl: './form-base.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
})
export class FormBaseComponent implements OnInit {
  titulo = input('Crie sua conta');
  nomeBotao = input('Criar minha conta');
  formBase!: FormGroup;
  private formBuilder = inject(FormBuilder);
  private ufService = inject(UnidadeFederativaService);

  generoControl = new FormControl({ nome: '', valor: '' });
  generos = [
    { nome: 'Feminino', valor: 'feminino' },
    { nome: 'Masculino', valor: 'masculino' },
    { nome: 'Não informar', valor: 'naoInformar' },
  ];

  estadoControl = new FormControl<UnidadeFederativa | null>(null);
  listaEstados: UnidadeFederativa[] = [];

  ngOnInit(): void {
    this.formBase = this.formBuilder.group({
      nome: [''],
      dataNascimento: [new Date()],
      genero: this.generoControl,
      cpf: [''],
      telefone: [''],
      cidade: [''],
      estado: this.estadoControl,
      email: [''],
      senha: [''],
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
    this.formBase.valueChanges.subscribe((form) => console.log(form));
  }
}
