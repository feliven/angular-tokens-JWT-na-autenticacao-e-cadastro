import { Component, Input, OnInit } from '@angular/core';
import { testeClasseInimigo } from 'src/app/core/validators/teste';

@Component({
  selector: 'app-banner',
  imports: [],
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent implements OnInit {
  @Input() src: string = '';
  @Input() alt: string = '';

  ngOnInit(): void {
    testeClasseInimigo();
  }
}
