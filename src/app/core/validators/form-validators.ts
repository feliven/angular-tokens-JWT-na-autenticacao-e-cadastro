import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class FormValidations {
  static ehIgual(outroCampo: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valorCampo = control.value;
      const valorOutroCampo = control.root.get(outroCampo)?.value;

      if (valorCampo !== valorOutroCampo) {
        return { ehIgual: true };
      } else {
        return null;
      }
    };
  }
}
