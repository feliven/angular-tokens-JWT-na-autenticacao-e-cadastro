import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { Depoimento } from 'src/app/core/types/type';

@Component({
  selector: 'app-card-depoimento',
  templateUrl: './card-depoimento.component.html',
  styleUrls: ['./card-depoimento.component.scss'],
  imports: [MatCardModule],
})
export class CardDepoimentoComponent {
  @Input() depoimento!: Depoimento;
}
