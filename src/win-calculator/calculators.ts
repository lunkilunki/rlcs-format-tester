import { Team } from '../interfaces/team';
import { Calculator } from './win-computer';

export namespace Calculators {
  export const random: Calculator = {
    toString() {
      return 'random (always 50%)';
    },
    calculate() {
      return 50;
    },
  };

  export const linearFactory = (base: number, offset: number): Calculator => {
    return {
      toString() {
        return `${base}+${offset}*diff (min=${this.calculate(1)}, max=${this.calculate(15)})`;
      },
      calculate(diff: number) {
        const r = base + offset * diff;
        return r > 100 ? 100 : r;
      },
    };
  };

  export const dumb: Calculator = {
    toString() {
      return 'dumb (higher seed always win';
    },
    calculate(diff: number) {
      return 100;
    },
  };
}
