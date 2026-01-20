import { Component, Input } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { Promocao } from 'src/app/core/types/type';

@Component({
  selector: 'app-card-busca',
  templateUrl: './card-busca.component.html',
  styleUrls: ['./card-busca.component.scss'],
  imports: [MatCardModule, MatButtonModule],
})
export class CardBuscaComponent {
  @Input() promocao!: Promocao;
}
