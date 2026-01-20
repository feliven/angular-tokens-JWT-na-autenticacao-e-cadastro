import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PromocaoService } from 'src/app/core/services/promocao.service';
import { Promocao } from 'src/app/core/types/type';
import { CardBuscaComponent } from 'src/app/shared/card-busca/card-busca.component';

@Component({
  selector: 'app-promocoes',
  templateUrl: './promocoes.component.html',
  styleUrls: ['./promocoes.component.scss'],
  imports: [CommonModule, CardBuscaComponent],
})
export class PromocoesComponent implements OnInit {
  promocoes!: Promocao[];
  constructor(private service: PromocaoService) {}
  ngOnInit(): void {
    this.service.listar().subscribe((res) => {
      this.promocoes = res;
    });
  }
}
