import { AbstractResult } from '../interfaces/abstract-result';
import { Format } from '../interfaces/format';
import { EliminatoryResult } from '../interfaces/results';
import { Team } from '../interfaces/team';
import { WinComputer } from '../win-calculator/win-computer';
import { SingleElim8 } from './single-elim.8';

export class GSL implements Format {
  public readonly result: GSL.Result;
  public readonly groupsResult: EliminatoryResult[];

  constructor(private readonly teams: Team[], private readonly computer: WinComputer) {
    if (this.teams.length !== 16) throw new Error('GSL must have 16 teams');
    // teams are assumed to be sorted by descending seed

    this.groupsResult = [
      this.runGroup(GSL.GROUPS.A.map((seed) => this.teams[seed - 1])),
      this.runGroup(GSL.GROUPS.B.map((seed) => this.teams[seed - 1])),
      this.runGroup(GSL.GROUPS.C.map((seed) => this.teams[seed - 1])),
      this.runGroup(GSL.GROUPS.D.map((seed) => this.teams[seed - 1])),
    ];

    const singleElimResult = new SingleElim8(
      [...this.groupsResult.map((g) => g.qualified[0]), ...this.groupsResult.map((g) => g.qualified[1])],
      this.computer,
    ).result;

    this.result = {
      ...singleElimResult,
      R9_12: this.groupsResult.map((g) => g.eliminated[0]),
      R13_16: this.groupsResult.map((g) => g.eliminated[1]),
    };
  }

  public toString(): string {
    return 'GSL';
  }

  private runGroup(teams: Team[]): EliminatoryResult {
    const firstRound = {
      _1: this.computer.compute(teams[0], teams[3]),
      _2: this.computer.compute(teams[1], teams[2]),
    };

    const winnerRound = this.computer.compute(firstRound._1.winner, firstRound._2.winner);
    const loserRound = this.computer.compute(firstRound._1.loser, firstRound._2.loser);
    const finalRound = this.computer.compute(winnerRound.loser, loserRound.winner);

    return {
      qualified: [winnerRound.winner, finalRound.winner],
      eliminated: [finalRound.loser, loserRound.loser],
    };
  }
}

export namespace GSL {
  export interface Result extends AbstractResult {
    R1: Team[];
    R2: Team[];
    R3_4: Team[];
    R5_8: Team[];
    R9_12: Team[];
    R13_16: Team[];
  }

  export const GROUPS = {
    A: [1, 8, 10, 15],
    B: [2, 7, 9, 16],
    C: [3, 6, 12, 13],
    D: [4, 5, 11, 14],
  };
}
