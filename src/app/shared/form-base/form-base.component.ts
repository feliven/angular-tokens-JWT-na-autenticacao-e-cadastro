import { Component, inject, input, OnInit } from '@angular/core';
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
import { UnidadeFederativaService } from 'src/app/core/services/unidade-federativa.service';
import { UnidadeFederativa } from 'src/app/core/types/type';

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
  ],
  templateUrl: './form-base.component.html',
  styleUrl: './form-base.component.scss',
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

  estadoControl = new FormControl<UnidadeFederativa>({
    id: 0,
    nome: '',
    sigla: '',
  });
  listaEstados: UnidadeFederativa[] = [];

  ngOnInit(): void {
    this.formBase = this.formBuilder.group({
      nome: [''],
      dataNascimento: [new Date()],
      genero: [''],
      cpf: [''],
      telefone: [''],
      cidade: [''],
      estado: [''],
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

    this.printGenero();
  }

  printGenero() {
    this.generoControl.valueChanges.subscribe((genero) => {
      const nome = genero?.nome;
      const valor = genero?.valor;

      console.log('nome', nome, 'valor', valor);
    });
  }
}
