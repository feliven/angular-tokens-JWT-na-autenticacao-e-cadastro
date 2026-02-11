import { Component } from '@angular/core';
import { BannerComponent } from 'src/app/shared/banner/banner.component';
import { FormBaseComponent } from 'src/app/shared/form-base/form-base.component';

@Component({
  selector: 'app-cadastro',
  imports: [BannerComponent, FormBaseComponent],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss',
})
export class CadastroComponent {
  cadastrar() {
    console.log('cadastro realizado');
  }
}
