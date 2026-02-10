import { Component, inject, OnInit } from '@angular/core';
import { BannerComponent } from 'src/app/shared/banner/banner.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    BannerComponent,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  formulario!: FormGroup;
  private formBuilder = inject(FormBuilder);

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
}
