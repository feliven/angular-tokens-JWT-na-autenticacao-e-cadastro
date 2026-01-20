import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepoimentoService } from 'src/app/core/services/depoimento.service';
import { Depoimento } from 'src/app/core/types/type';
import { CardDepoimentoComponent } from 'src/app/shared/card-depoimento/card-depoimento.component';

@Component({
  selector: 'app-depoimentos',
  templateUrl: './depoimentos.component.html',
  styleUrls: ['./depoimentos.component.scss'],
  imports: [CommonModule, CardDepoimentoComponent],
})
export class DepoimentosComponent {
  depoimentos: Depoimento[] = [];
  constructor(private service: DepoimentoService) {}
  ngOnInit(): void {
    this.service.listar().subscribe((res) => {
      this.depoimentos = res;
    });
  }
}
