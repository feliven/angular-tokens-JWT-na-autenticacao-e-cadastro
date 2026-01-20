import { Component } from '@angular/core';
import { BannerComponent } from 'src/app/shared/banner/banner.component';

@Component({
  selector: 'app-login',
  imports: [BannerComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {}
