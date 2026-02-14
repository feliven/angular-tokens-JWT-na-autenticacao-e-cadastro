import { TestBed } from '@angular/core/testing';
import { FormBuscaService } from './form-busca.service';
import { MatDialog } from '@angular/material/dialog';
import { MatChipSelectionChange } from '@angular/material/chips';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

fdescribe('FormBuscaService', () => {
  let service: FormBuscaService;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(() => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    TestBed.configureTestingModule({
      providers: [
        FormBuscaService,
        { provide: MatDialog, useValue: dialogSpy },
      ],
    });
    service = TestBed.inject(FormBuscaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    const form = service.formBusca;
    expect(form.get('somenteIda')?.value).toBeFalse();
    expect(form.get('adultos')?.value).toBe(3);
    expect(form.get('tipo')?.value).toBe('Executiva');
  });

  describe('getDescricaoPassageiros', () => {
    it('should return correct description for default values', () => {
      // Default: 3 adults, 0 children, 1 baby
      expect(service.getDescricaoPassageiros()).toBe('3 adultos, 1 bebê');
    });

    it('should return correct description for single adult', () => {
      service.formBusca.patchValue({
        adultos: 1,
        criancas: 0,
        bebes: 0,
      });
      expect(service.getDescricaoPassageiros()).toBe('1 adulto');
    });

    it('should return correct description for multiple types', () => {
      service.formBusca.patchValue({
        adultos: 2,
        criancas: 2,
        bebes: 0,
      });
      expect(service.getDescricaoPassageiros()).toBe('2 adultos, 2 crianças');
    });

    it('should return correct description for plural babies', () => {
      service.formBusca.patchValue({
        adultos: 1,
        criancas: 0,
        bebes: 2,
      });
      expect(service.getDescricaoPassageiros()).toBe('1 adulto, 2 bebês');
    });
  });

  describe('trocarOrigemDestino', () => {
    it('should swap origin and destination', () => {
      service.formBusca.patchValue({
        origem: 'São Paulo',
        destino: 'Rio de Janeiro',
      });

      service.trocarOrigemDestino();

      expect(service.formBusca.get('origem')?.value).toBe('Rio de Janeiro');
      expect(service.formBusca.get('destino')?.value).toBe('São Paulo');
    });
  });

  describe('alterarTipo', () => {
    it('should update type when chip is selected', () => {
      const mockEvent = { selected: true } as MatChipSelectionChange;
      service.alterarTipo(mockEvent, 'Econômica');
      expect(service.formBusca.get('tipo')?.value).toBe('Econômica');
    });

    it('should not update type when chip is deselected', () => {
      service.formBusca.patchValue({ tipo: 'Executiva' });
      const mockEvent = { selected: false } as MatChipSelectionChange;
      service.alterarTipo(mockEvent, 'Econômica');
      expect(service.formBusca.get('tipo')?.value).toBe('Executiva');
    });
  });

  describe('openDialog', () => {
    it('should open dialog with ModalComponent', () => {
      service.openDialog();
      expect(dialogSpy.open).toHaveBeenCalledWith(ModalComponent, {
        width: '50%',
      });
    });
  });

  describe('obterControle', () => {
    it('should return the control if it exists', () => {
      const control = service.obterControle('origem');
      expect(control).toBeTruthy();
    });

    it('should throw error if control does not exist', () => {
      expect(() => service.obterControle('naoExiste')).toThrowError();
    });
  });
});
