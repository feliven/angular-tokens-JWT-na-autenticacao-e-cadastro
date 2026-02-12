import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export class Inimigo {
  nome = '';
  poder = 0;
  saude = 0;

  constructor(nomeInimigo: string, poderInimigo: number, saudeInimigo: number) {
    this.nome = nomeInimigo;
    this.poder = poderInimigo;
    this.saude = saudeInimigo;
  }

  atacar(inimigo: Inimigo) {
    if (this.saude <= 0) return;

    inimigo.saude -= this.poder;

    if (inimigo.saude < 0) {
      inimigo.saude = 0;
    }

    console.log(this.nome, 'atacou', inimigo.nome);
    console.log(inimigo.nome, 'está com', inimigo.saude, 'de saúde');
    if (inimigo.saude <= 0) {
      console.log(inimigo.nome, 'foi derrotado!');
    }
  }
}

export function testeClasseInimigo() {
  const monstro = new Inimigo('monstro', 9, 50);
  const zumbi = new Inimigo('zumbi', 6, 20);

  while (monstro.saude > 0 && zumbi.saude > 0) {
    monstro.atacar(zumbi);
    zumbi.atacar(monstro);
  }
}

testeClasseInimigo();

// experimentando factory

type InimigoFn = {
  nome: string;
  poder: number;
  saude: number;
};

export function inimigoFactory() {
  return {
    criar(
      nomeInformado: string,
      poderInformado: number,
      saudeInformado: number,
    ) {
      let inimigo: InimigoFn = {
        nome: nomeInformado,
        poder: poderInformado,
        saude: saudeInformado,
      };

      return inimigo;
    },

    atacar(esteInimigo: InimigoFn, outroInimigo: InimigoFn) {
      if (esteInimigo.saude <= 0) return;

      outroInimigo.saude -= esteInimigo.poder;

      if (outroInimigo.saude < 0) {
        outroInimigo.saude = 0;
      }

      console.log(esteInimigo.nome, 'atacou', outroInimigo.nome);
      console.log(
        outroInimigo.nome,
        'está com',
        outroInimigo.saude,
        'de saúde',
      );
      if (outroInimigo.saude <= 0) {
        console.log(outroInimigo.nome, 'foi derrotado!');
      }
    },
  };
}

let mago = inimigoFactory().criar('mago', 12, 50);
let bruxa = inimigoFactory().criar('bruxa', 25, 20);

while (mago.saude > 0 && bruxa.saude > 0) {
  inimigoFactory().atacar(mago, bruxa);
  inimigoFactory().atacar(bruxa, mago);
}

// com factory, função fica com sintaxe classe.funcao(variavel)(outravariavel)

class CopiaFormValidations {
  ehIgual(outroCampo: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valorCampo = control.value;
      const valorOutroCampo = control.root.get(outroCampo)?.value;

      if (valorCampo !== valorOutroCampo) {
        return { ehIgual: false };
      } else {
        return null;
      }
    };
  }

  exemploFactory(variavel: string): Function {
    return (intermediario: AbstractControl): boolean => {
      const outraVariavel = intermediario.value;
      return variavel === outraVariavel;
    };
  }
}

const ctrl = new FormControl();
const formval = new CopiaFormValidations();

const validatorfn = formval.ehIgual('x');

const validator = validatorfn(ctrl);
const validator2 = formval.ehIgual('x')(ctrl);
