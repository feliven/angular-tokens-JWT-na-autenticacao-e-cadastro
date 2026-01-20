import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-botao-controle',
  templateUrl: './botao-controle.component.html',
  styleUrls: ['./botao-controle.component.scss'],
  imports: [CommonModule, MatButtonModule],
})
export class BotaoControleComponent {
  @Input() operacao: 'incrementar' | 'decrementar' = 'incrementar';
  @Input() src = '';
  @Input() alt = '';
}
