import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBaseComponent } from './form-base.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UnidadeFederativaService } from 'src/app/core/services/unidade-federativa.service';
import { CadastroService } from 'src/app/core/services/cadastro.service';
import { of, throwError } from 'rxjs';
import { UnidadeFederativa } from 'src/app/core/types/type';
import { By } from '@angular/platform-browser';

fdescribe('FormBaseComponent', () => {
  let component: FormBaseComponent;
  let fixture: ComponentFixture<FormBaseComponent>;
  let ufServiceSpy: jasmine.SpyObj<UnidadeFederativaService>;
  let cadastroServiceSpy: jasmine.SpyObj<CadastroService>;

  beforeEach(async () => {
    ufServiceSpy = jasmine.createSpyObj('UnidadeFederativaService', [
      'salvarEstados',
    ]);
    cadastroServiceSpy = jasmine.createSpyObj('CadastroService', [
      'setCadastro',
    ]);

    // Mock return value for the service call in ngOnInit
    ufServiceSpy.salvarEstados.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [FormBaseComponent, ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        { provide: UnidadeFederativaService, useValue: ufServiceSpy },
        { provide: CadastroService, useValue: cadastroServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormBaseComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    fixture.detectChanges();
    expect(component.formBase).toBeDefined();
    expect(component.formBase.get('nome')?.value).toBe('drerewe');
    expect(component.formBase.get('email')?.value).toBe('a@b');
  });

  it('should call cadastroService.setCadastro on init', () => {
    fixture.detectChanges();
    expect(cadastroServiceSpy.setCadastro).toHaveBeenCalledWith(
      component.formBase,
    );
  });

  it('should disable aceitarTermos validator when meuPerfil is true', () => {
    fixture.componentRef.setInput('meuPerfil', true);
    fixture.detectChanges();

    const control = component.formBase.get('aceitarTermos');
    control?.setValue(false);
    expect(control?.valid).toBeTrue();
  });

  it('should enable aceitarTermos validator when meuPerfil is false', () => {
    fixture.componentRef.setInput('meuPerfil', false);
    fixture.detectChanges();

    const control = component.formBase.get('aceitarTermos');
    control?.setValue(false);
    expect(control?.valid).toBeFalse();
  });

  it('should emit submitClicado when onSubmit is called', () => {
    spyOn(component.submitClicado, 'emit');
    component.onSubmit();
    expect(component.submitClicado.emit).toHaveBeenCalled();
  });

  it('should emit editarClicado when onEditar is called', () => {
    spyOn(component.editarClicado, 'emit');
    component.onEditar();
    expect(component.editarClicado.emit).toHaveBeenCalled();
  });

  it('should emit deslogarClicado when onDeslogar is called', () => {
    spyOn(component.deslogarClicado, 'emit');
    component.onDeslogar();
    expect(component.deslogarClicado.emit).toHaveBeenCalled();
  });

  it('should set estadoControl if listaEstados has more than 5 elements', () => {
    const mockUfs: UnidadeFederativa[] = Array(10).fill({
      id: 1,
      nome: 'Test',
      sigla: 'TS',
    });
    // In the component, the service is called with this.listaEstados which is empty
    // and the logic depends on that same array being populated by the service (side effect).
    ufServiceSpy.salvarEstados.and.callFake((estados: UnidadeFederativa[]) => {
      mockUfs.forEach((u) => estados.push(u));
      return of(mockUfs);
    });

    fixture.detectChanges();
    expect(component.estadoControl.value).toEqual(mockUfs[5]);
  });

  it('should log error when ufService fails', () => {
    const consoleSpy = spyOn(console, 'error');
    ufServiceSpy.salvarEstados.and.returnValue(
      throwError(() => new Error('API Error')),
    );

    fixture.detectChanges();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Erro ao carregar estados',
      jasmine.any(Error),
    );
  });

  it('should have invalid form when email and confirmarEmail do not match', () => {
    fixture.detectChanges();
    component.formBase.patchValue({
      email: 'test@test.com',
      confirmarEmail: 'different@test.com',
    });
    expect(
      component.formBase.get('confirmarEmail')?.errors?.['ehIgual'],
    ).toBeTrue();
  });

  it('should log form value changes when printFormBase is called', () => {
    const consoleSpy = spyOn(console, 'log');
    fixture.detectChanges();
    component.printFormBase();
    component.formBase.patchValue({ nome: 'Novo Nome' });
    expect(consoleSpy).toHaveBeenCalled();
  });

  describe('DOM interaction', () => {
    it('should display the title passed via input', () => {
      fixture.componentRef.setInput('titulo', 'Meu Título');
      fixture.detectChanges();
      const title = fixture.debugElement.query(
        By.css('mat-card-title'),
      ).nativeElement;
      expect(title.textContent).toContain('Meu Título');
    });

    it('should display the button name passed via input', () => {
      fixture.componentRef.setInput('nomeBotao', 'Salvar');
      fixture.detectChanges();
      const button = fixture.debugElement.query(
        By.css('mat-card-actions button'),
      ).nativeElement;
      expect(button.textContent).toContain('Salvar');
    });

    it('should show logout and edit buttons when meuPerfil is true', () => {
      fixture.componentRef.setInput('meuPerfil', true);
      fixture.detectChanges();

      const buttons = fixture.debugElement.queryAll(
        By.css('a[mat-stroked-button]'),
      );
      const hasLogout = buttons.some((b) =>
        b.nativeElement.textContent.includes('DESLOGAR'),
      );
      const hasEdit = buttons.some((b) =>
        b.nativeElement.textContent.includes('Editar'),
      );

      expect(hasLogout).toBeTrue();
      expect(hasEdit).toBeTrue();
    });

    it('should hide logout and edit buttons when meuPerfil is false', () => {
      fixture.componentRef.setInput('meuPerfil', false);
      fixture.detectChanges();

      const buttons = fixture.debugElement.queryAll(
        By.css('a[mat-stroked-button]'),
      );
      const hasLogout = buttons.some((b) =>
        b.nativeElement.textContent.includes('DESLOGAR'),
      );
      const hasEdit = buttons.some((b) =>
        b.nativeElement.textContent.includes('Editar'),
      );

      expect(hasLogout).toBeFalse();
      expect(hasEdit).toBeFalse();
    });

    it('should show terms checkbox when meuPerfil is false', () => {
      fixture.componentRef.setInput('meuPerfil', false);
      fixture.detectChanges();
      const checkbox = fixture.debugElement.query(
        By.css('mat-checkbox[formControlName="aceitarTermos"]'),
      );
      expect(checkbox).toBeTruthy();
    });

    it('should hide terms checkbox when meuPerfil is true', () => {
      fixture.componentRef.setInput('meuPerfil', true);
      fixture.detectChanges();
      const checkbox = fixture.debugElement.query(
        By.css('mat-checkbox[formControlName="aceitarTermos"]'),
      );
      expect(checkbox).toBeFalsy();
    });

    it('should call onDeslogar when logout button is clicked', () => {
      fixture.componentRef.setInput('meuPerfil', true);
      fixture.detectChanges();
      spyOn(component, 'onDeslogar');

      const buttons = fixture.debugElement.queryAll(
        By.css('a[mat-stroked-button]'),
      );
      const logoutBtn = buttons.find((b) =>
        b.nativeElement.textContent.includes('DESLOGAR'),
      );
      logoutBtn?.nativeElement.click();

      expect(component.onDeslogar).toHaveBeenCalled();
    });

    it('should call onEditar when edit button is clicked', () => {
      fixture.componentRef.setInput('meuPerfil', true);
      fixture.detectChanges();
      spyOn(component, 'onEditar');

      const buttons = fixture.debugElement.queryAll(
        By.css('a[mat-stroked-button]'),
      );
      const editBtn = buttons.find((b) =>
        b.nativeElement.textContent.includes('Editar'),
      );
      editBtn?.nativeElement.click();

      expect(component.onEditar).toHaveBeenCalled();
    });

    it('should show error message for invalid required field', () => {
      fixture.detectChanges();
      const nomeInput = component.formBase.get('nome');
      nomeInput?.setValue('');
      nomeInput?.markAsTouched();
      fixture.detectChanges();

      const error = fixture.debugElement.query(By.css('mat-error'));
      expect(error.nativeElement.textContent).toContain('Nome é obrigatório');
    });

    it('should disable submit button when form is invalid', () => {
      fixture.detectChanges();
      component.formBase.setErrors({ invalid: true });
      fixture.detectChanges();
      const btn = fixture.debugElement.query(
        By.css('mat-card-actions button'),
      ).nativeElement;
      expect(btn.disabled).toBeTrue();
    });

    it('should enable submit button when form is valid', () => {
      fixture.detectChanges();
      // Make form valid
      component.formBase.patchValue({
        genero: 'm',
        estado: { id: 1, nome: 'SP', sigla: 'SP' },
        confirmarEmail: 'a@b',
        confirmarSenha: '111',
        aceitarTermos: true,
      });
      fixture.detectChanges();
      const btn = fixture.debugElement.query(
        By.css('mat-card-actions button'),
      ).nativeElement;
      expect(btn.disabled).toBeFalse();
    });
  });
});
