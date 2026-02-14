import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { CadastroService } from 'src/app/core/services/cadastro.service';
import { UnidadeFederativaService } from 'src/app/core/services/unidade-federativa.service';
import { UserService } from 'src/app/core/services/user.service';
import {
  Genero,
  PessoaUsuaria,
  UnidadeFederativa,
} from 'src/app/core/types/type';
import { FormBaseComponent } from 'src/app/shared/form-base/form-base.component';

import { PerfilComponent } from './perfil.component';

fdescribe('PerfilComponent', () => {
  let component: PerfilComponent;
  let fixture: ComponentFixture<PerfilComponent>;

  let cadastroServiceSpy: jasmine.SpyObj<CadastroService> & {
    cadastroForm: FormGroup;
  };
  let ufServiceSpy: jasmine.SpyObj<UnidadeFederativaService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const estadosMock: UnidadeFederativa[] = [
    { id: 1, nome: 'Sao Paulo', sigla: 'SP' },
    { id: 2, nome: 'Rio de Janeiro', sigla: 'RJ' },
  ];

  const cadastroMock: PessoaUsuaria = {
    nome: 'Maria',
    nascimento: '1990-01-01',
    cpf: '12345678900',
    telefone: '11999999999',
    email: 'maria@exemplo.com',
    senha: '123456',
    genero: Genero.FEMININO,
    cidade: 'Sao Paulo',
    estado: { id: 1, nome: 'Sao Paulo', sigla: 'SP' },
  };

  function criarFormularioValido(): FormGroup {
    return new FormGroup({
      nome: new FormControl(cadastroMock.nome, Validators.required),
      nascimento: new FormControl(cadastroMock.nascimento, Validators.required),
      cpf: new FormControl(cadastroMock.cpf, Validators.required),
      telefone: new FormControl(cadastroMock.telefone, Validators.required),
      email: new FormControl(cadastroMock.email, Validators.required),
      senha: new FormControl(cadastroMock.senha, Validators.required),
      genero: new FormControl(cadastroMock.genero, Validators.required),
      cidade: new FormControl(cadastroMock.cidade, Validators.required),
      estado: new FormControl(cadastroMock.estado, Validators.required),
      confirmarEmail: new FormControl(''),
      confirmarSenha: new FormControl(''),
    });
  }

  //

  beforeEach(async () => {
    cadastroServiceSpy = jasmine.createSpyObj<CadastroService>(
      'CadastroService',
      ['getCadastro', 'patchCadastro', 'setCadastro'],
    ) as jasmine.SpyObj<CadastroService> & { cadastroForm: FormGroup };

    cadastroServiceSpy.cadastroForm = criarFormularioValido();
    cadastroServiceSpy.getCadastro.and.returnValue(of(cadastroMock));
    cadastroServiceSpy.patchCadastro.and.returnValue(of(cadastroMock));
    cadastroServiceSpy.setCadastro.and.callFake((form) => {
      cadastroServiceSpy.cadastroForm = form;
    });

    ufServiceSpy = jasmine.createSpyObj<UnidadeFederativaService>(
      'UnidadeFederativaService',
      ['salvarEstados'],
    );
    ufServiceSpy.salvarEstados.and.callFake((lista) => {
      if (lista.length === 0) {
        lista.push(...estadosMock);
      }
      return of(estadosMock);
    });

    userServiceSpy = jasmine.createSpyObj<UserService>('UserService', [
      'logout',
    ]);

    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [PerfilComponent, NoopAnimationsModule],
      providers: [
        { provide: CadastroService, useValue: cadastroServiceSpy },
        { provide: UnidadeFederativaService, useValue: ufServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('deve chamar carregarDadosPerfil no ngAfterViewInit', () => {
    spyOn(component, 'carregarDadosPerfil');

    fixture.detectChanges();

    expect(component.carregarDadosPerfil).toHaveBeenCalled();
  });

  it('deve carregar estados e depois carregar dados do formulario', () => {
    const carregarDadosParaFormSpy = spyOn<any>(
      component,
      'carregarDadosParaForm',
    ).and.callThrough();

    fixture.detectChanges();

    expect(ufServiceSpy.salvarEstados).toHaveBeenCalledWith(
      component.listaEstados,
    );
    expect(component.listaEstados.length).toBe(2);
    expect(carregarDadosParaFormSpy).toHaveBeenCalled();
  });

  it('deve logar erro quando falhar ao carregar estados', () => {
    const erro = new Error('falha ao carregar estados');
    ufServiceSpy.salvarEstados.and.returnValue(throwError(() => erro));
    const consoleErrorSpy = spyOn(console, 'error');

    fixture.detectChanges();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Erro ao carregar estados',
      erro,
    );
  });

  it('nao deve atualizar quando formulario estiver invalido', () => {
    fixture.detectChanges();
    cadastroServiceSpy.cadastroForm.get('nome')?.setValue('');

    component.atualizar();

    expect(cadastroServiceSpy.patchCadastro).not.toHaveBeenCalled();
  });

  it('deve atualizar perfil e refletir nome no componente', () => {
    fixture.detectChanges();
    cadastroServiceSpy.patchCadastro.and.returnValue(
      of({ ...cadastroMock, nome: 'Maria Atualizada' }),
    );

    cadastroServiceSpy.cadastroForm.patchValue({
      senha: '123',
      confirmarSenha: '123',
      confirmarEmail: cadastroMock.email,
    });
    component.atualizar();

    expect(cadastroServiceSpy.patchCadastro).toHaveBeenCalled();
    expect(component.nome).toBe('Maria Atualizada');
  });

  it('deve logar erro quando falhar ao atualizar perfil', () => {
    fixture.detectChanges();
    const erro = new Error('falha ao atualizar');
    cadastroServiceSpy.patchCadastro.and.returnValue(throwError(() => erro));
    const consoleErrorSpy = spyOn(console, 'error');

    cadastroServiceSpy.cadastroForm.patchValue({
      senha: '123',
      confirmarSenha: '123',
      confirmarEmail: cadastroMock.email,
    });
    component.atualizar();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Erro ao atualizar', erro);
  });

  it('deve carregar cadastro no formulario e mapear estado ja carregado', () => {
    fixture.detectChanges();

    expect(cadastroServiceSpy.getCadastro).toHaveBeenCalled();
    expect(cadastroServiceSpy.cadastroForm.get('nome')?.value).toBe('Maria');
    expect(cadastroServiceSpy.cadastroForm.get('estado')?.value).toEqual(
      estadosMock[0],
    );
    expect(component.nome).toBe('Maria');
  });

  it('deve manter estado do cadastro quando nao encontrar estado na lista', () => {
    ufServiceSpy.salvarEstados.and.callFake((lista) => {
      lista.push({ id: 99, nome: 'Outro', sigla: 'OT' });
      return of(lista);
    });

    fixture.detectChanges();

    expect(cadastroServiceSpy.cadastroForm.get('estado')?.value).toEqual(
      cadastroMock.estado,
    );
  });

  it('deve logar erro quando falhar ao carregar cadastro', () => {
    const erro = new Error('falha ao carregar cadastro');
    cadastroServiceSpy.getCadastro.and.returnValue(throwError(() => erro));
    const consoleErrorSpy = spyOn(console, 'error');

    fixture.detectChanges();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Erro ao carregar perfil',
      erro,
    );
  });

  it('deve deslogar usuario', () => {
    component.deslogar();

    expect(userServiceSpy.logout).toHaveBeenCalled();
  });

  describe('DOM interactions', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('deve exibir o banner com atributos corretos', () => {
      const banner = fixture.debugElement.query(By.css('app-banner'));
      expect(banner).toBeTruthy();
      expect(banner.attributes['src']).toBe(
        '/assets/imagens/banner-perfil.png',
      );
      expect(banner.attributes['alt']).toBe('banner login');
    });

    it('deve exibir o form-base com inputs corretos', () => {
      // Trigger change detection again to update bindings after async data load
      fixture.detectChanges();

      const formBaseEl = fixture.debugElement.query(
        By.directive(FormBaseComponent),
      );
      expect(formBaseEl).toBeTruthy();

      const formBaseInstance =
        formBaseEl.componentInstance as FormBaseComponent;
      expect(formBaseInstance.titulo()).toBe('Boas-vindas, Maria');
      expect(formBaseInstance.nomeBotao()).toBe('Atualizar perfil');
      expect(formBaseInstance.meuPerfil()).toBeTrue();
    });

    it('deve chamar atualizar() quando form-base emitir submitClicado', () => {
      spyOn(component, 'atualizar');
      const formBaseEl = fixture.debugElement.query(
        By.directive(FormBaseComponent),
      );
      const formBaseInstance =
        formBaseEl.componentInstance as FormBaseComponent;

      formBaseInstance.submitClicado.emit();

      expect(component.atualizar).toHaveBeenCalled();
    });

    it('deve chamar deslogar() quando form-base emitir deslogarClicado', () => {
      spyOn(component, 'deslogar');
      const formBaseEl = fixture.debugElement.query(
        By.directive(FormBaseComponent),
      );
      const formBaseInstance =
        formBaseEl.componentInstance as FormBaseComponent;

      formBaseInstance.deslogarClicado.emit();

      expect(component.deslogar).toHaveBeenCalled();
    });

    it('deve chamar editar() quando form-base emitir editarClicado', () => {
      spyOn(component, 'editar');
      const formBaseEl = fixture.debugElement.query(
        By.directive(FormBaseComponent),
      );
      const formBaseInstance =
        formBaseEl.componentInstance as FormBaseComponent;

      formBaseInstance.editarClicado.emit();

      expect(component.editar).toHaveBeenCalled();
    });
  });
});
