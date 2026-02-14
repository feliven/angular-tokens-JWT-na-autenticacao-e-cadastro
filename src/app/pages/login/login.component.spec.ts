import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';

import { LoginComponent } from './login.component';
import { AutenticacaoService } from '../../core/services/autenticacao.service';

fdescribe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let authServiceSpy: jasmine.SpyObj<AutenticacaoService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AutenticacaoService', [
      'autenticar',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    authServiceSpy.autenticar.and.returnValue(
      of(new HttpResponse({ status: 200, body: { access_token: 'token' } })),
    );

    await TestBed.configureTestingModule({
      imports: [LoginComponent, NoopAnimationsModule],
      providers: [
        { provide: AutenticacaoService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form with email and senha controls', () => {
    expect(component.loginForm).toBeTruthy();
    expect(component.loginForm.contains('email')).toBeTrue();
    expect(component.loginForm.contains('senha')).toBeTrue();
  });

  it('should keep form invalid when empty', () => {
    component.loginForm.setValue({ email: '', senha: '' });

    expect(component.loginForm.invalid).toBeTrue();
  });

  it('should validate email required and email format', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('');
    expect(emailControl?.hasError('required')).toBeTrue();

    emailControl?.setValue('email-invalido');
    expect(emailControl?.hasError('email')).toBeTrue();

    emailControl?.setValue('usuario@teste.com');
    expect(emailControl?.valid).toBeTrue();
  });

  it('should validate senha required and minlength', () => {
    const senhaControl = component.loginForm.get('senha');
    senhaControl?.setValue('');
    expect(senhaControl?.hasError('required')).toBeTrue();

    senhaControl?.setValue('12');
    expect(senhaControl?.hasError('minlength')).toBeTrue();

    senhaControl?.setValue('123');
    expect(senhaControl?.valid).toBeTrue();
  });

  it('should disable submit button when form is invalid', () => {
    component.loginForm.setValue({ email: '', senha: '' });
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.debugElement.query(
      By.css('button[mat-flat-button]'),
    ).nativeElement;

    expect(button.disabled).toBeTrue();
  });

  it('should show email required error when touched and empty', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('');
    emailControl?.markAsTouched();
    fixture.detectChanges();

    const errors = fixture.debugElement.queryAll(By.css('mat-error'));
    const hasMessage = errors.some((e) =>
      (e.nativeElement.textContent as string).includes('E-mail é obrigatório.'),
    );

    expect(hasMessage).toBeTrue();
  });

  it('should call autenticar with form values on login()', () => {
    component.loginForm.setValue({
      email: 'usuario@teste.com',
      senha: '123456',
    });

    component.login();

    expect(authServiceSpy.autenticar).toHaveBeenCalledWith(
      'usuario@teste.com',
      '123456',
    );
  });

  it('should navigate to /perfil when login succeeds', () => {
    component.loginForm.setValue({
      email: 'usuario@teste.com',
      senha: '123456',
    });

    component.login();

    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/perfil');
  });

  it('should not navigate when login fails', () => {
    authServiceSpy.autenticar.and.returnValue(
      throwError(() => new Error('Falha de autenticação')),
    );

    component.loginForm.setValue({
      email: 'usuario@teste.com',
      senha: 'senha-invalida',
    });

    component.login();

    expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should not call autenticar when form is invalid (bug catch!)', () => {
    component.loginForm.setValue({ email: '', senha: '' });

    component.login();

    expect(authServiceSpy.autenticar).not.toHaveBeenCalled();
  });
});
