import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export class ClasseInimigo {
  nome = '';
  poder = 0;
  saude = 0;

  constructor(nomeInimigo: string, poderInimigo: number, saudeInimigo: number) {
    this.nome = nomeInimigo;
    this.poder = poderInimigo;
    this.saude = saudeInimigo;
  }

  atacar(inimigo: ClasseInimigo) {
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
  const monstro = new ClasseInimigo('monstro', 9, 50);
  const zumbi = new ClasseInimigo('zumbi', 6, 20);

  while (monstro.saude > 0 && zumbi.saude > 0) {
    monstro.atacar(zumbi);
    zumbi.atacar(monstro);
  }
}

testeClasseInimigo();

// experimentando factory

type Inimigo = {
  nome: string;
  poder: number;
  saude: number;
};

export function inimigoFactory(
  nomeInformado: string,
  poderInformado: number,
  saudeInformado: number,
): Inimigo & { atacar(outroInimigo: Inimigo): void } {
  return {
    nome: nomeInformado,
    poder: poderInformado,
    saude: saudeInformado,

    atacar(outroInimigo: Inimigo) {
      if (this.saude <= 0) return;

      outroInimigo.saude -= this.poder;

      if (outroInimigo.saude < 0) {
        outroInimigo.saude = 0;
      }

      console.log(this.nome, 'atacou', outroInimigo.nome);
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

let mago = inimigoFactory('mago', 12, 50);
let bruxa = inimigoFactory('bruxa', 25, 20);

while (mago.saude > 0 && bruxa.saude > 0) {
  mago.atacar(bruxa);
  bruxa.atacar(mago);
}

// Define the factory function for creating enemy objects
function enemyFactory(
  type: string,
  health: number,
  attackPower: number,
  speed: number,
) {
  return {
    type: type,
    health: health,
    attackPower: attackPower,
    speed: speed,
    attack() {
      console.log(`${this.type} attacks with ${this.attackPower} power!`);
    },
    move() {
      console.log(`${this.type} moves at a speed of ${this.speed}.`);
    },
  };
}

// Create different types of enemies using the factory function
let goblin = enemyFactory('Goblin', 50, 10, 5);
let skeleton = enemyFactory('Skeleton', 70, 15, 4);
let troll = enemyFactory('Troll', 100, 20, 3);

// Interact with the created enemies
goblin.attack();
skeleton.move();
troll.attack();

//Output
// Goblin attacks with 10 power!
// Skeleton moves at a speed of 4.
// Troll attacks with 20 power!

// com factory, função fica com sintaxe classe.funcao(variavel)(outravariavel)

class CopiaFormValidations {
  conferirSeEIgual(outroCampo: string): ValidatorFn {
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

const variavel = 'teste';
const outraVariavel = new FormControl();
const validacao = new CopiaFormValidations();

const funcaoValidacao = validacao.conferirSeEIgual(variavel);

const respostaValidator = funcaoValidacao(outraVariavel);
const respostaValidator2 = validacao.conferirSeEIgual(variavel)(outraVariavel);
