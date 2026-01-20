import { Component } from '@angular/core';
import { ContainerComponent } from '../container/container.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [ContainerComponent, MatButtonModule],
})
export class FooterComponent {}
