import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';

import { FormBuscaService } from 'src/app/core/services/form-busca.service';
import { SeletorPassageiroComponent } from '../seletor-passageiro/seletor-passageiro.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  imports: [
    ReactiveFormsModule,
    SeletorPassageiroComponent,
    MatChipsModule,
    MatButtonModule,
    MatDialogModule,
  ],
})
export class ModalComponent {
  constructor(public formBuscaService: FormBuscaService) {}
}
