import { Component, OnInit } from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { PromocaoService } from 'src/app/core/services/promocao.service';
import { BannerComponent } from 'src/app/shared/banner/banner.component';
import { ContainerComponent } from 'src/app/shared/container/container.component';
import { DepoimentosComponent } from './depoimentos/depoimentos.component';
import { PromocoesComponent } from './promocoes/promocoes.component';
import { FormBuscaComponent } from 'src/app/shared/form-busca/form-busca.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    MatInputModule,
    MatFormFieldModule,
    BannerComponent,
    ContainerComponent,
    DepoimentosComponent,
    PromocoesComponent,
    FormBuscaComponent,
  ],
})
export class HomeComponent implements OnInit {
  constructor(private servicoPromocao: PromocaoService) {}
  ngOnInit(): void {
    this.servicoPromocao.listar().subscribe((resposta) => {
      console.log(resposta);
    });
  }
}
