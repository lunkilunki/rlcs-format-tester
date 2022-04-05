import { Team } from '../interfaces/team';

export interface Result {
  winner: Team;
  loser: Team;
}
/** the result must represent the probability of the higher seeded team to win, from 0 to 100 */
export interface Calculator {
  calculate(diff: number): number;
  toString(): string;
}

export class WinComputer {
  constructor(public readonly calculator: Calculator) {}

  public compute(team1: Team, team2: Team): Result {
    if (team1.seed < team2.seed) return this.compute(team2, team1);

    const diff = team1.seed - team2.seed;
    const prob = this.calculator.calculate(diff);

    const rand = Math.random();
    if (rand * 100 > prob) {
      return { winner: team1, loser: team2 };
    } else {
      return { winner: team2, loser: team1 };
    }
  }
}
