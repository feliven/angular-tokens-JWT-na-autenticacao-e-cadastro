import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';

import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { FormBuscaService } from 'src/app/core/services/form-busca.service';
import { CardComponent } from '../card/card.component';
import { DropdownUfComponent } from './dropdown-uf/dropdown-uf.component';

@Component({
  selector: 'app-form-busca',
  templateUrl: './form-busca.component.html',
  styleUrls: ['./form-busca.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    MatButtonToggleModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    DropdownUfComponent,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
  ],
})
export class FormBuscaComponent {
  constructor(public formBuscaService: FormBuscaService) {}

  buscar() {
    console.log(this.formBuscaService.formBusca.value);
  }
}
