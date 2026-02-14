import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [RouterLink, AsyncPipe, MatButtonModule, MatToolbarModule],
})
export class HeaderComponent {
  private userService = inject(UserService);

  usuario$ = this.userService.retornarUsuario();

  sair() {
    this.userService.logout();
  }
}
