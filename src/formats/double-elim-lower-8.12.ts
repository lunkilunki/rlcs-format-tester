import { Format } from '../interfaces/format';
import { AbstractResult } from '../interfaces/abstract-result';
import { Team } from '../interfaces/team';
import { WinComputer } from '../win-calculator/win-computer';

export class DoubleElimLower8_12 implements Format {
  public readonly result: DoubleElimLower8_12.Result;

  constructor(private readonly teams: DoubleElimLower8_12.Params, private readonly computer: WinComputer) {
    if (this.teams.R1_4.length !== 4) throw new Error('DoubleElimLowerStart must have 4 R1_4');
    if (this.teams.R5_8.length !== 4) throw new Error('DoubleElimLowerStart must have 4 R5_8');
    if (this.teams.R9_12.length !== 4) throw new Error('DoubleElimLowerStart must have 4 R9_12');
    // // teams are assumed to be sorted by descending seed

    const upperSemis = {
      _1: this.computer.compute(this.teams.R1_4[0], this.teams.R1_4[3]),
      _2: this.computer.compute(this.teams.R1_4[1], this.teams.R1_4[2]),
    };

    const upperFinals = this.computer.compute(upperSemis._1.winner, upperSemis._2.winner);

    const lower1 = {
      _1: this.computer.compute(this.teams.R5_8[1], this.teams.R9_12[0]),
      _2: this.computer.compute(this.teams.R5_8[2], this.teams.R9_12[3]),
      _3: this.computer.compute(this.teams.R5_8[0], this.teams.R9_12[1]),
      _4: this.computer.compute(this.teams.R5_8[3], this.teams.R9_12[2]),
    };

    const lower2 = {
      _1: this.computer.compute(lower1._1.winner, lower1._2.winner),
      _2: this.computer.compute(lower1._3.winner, lower1._4.winner),
    };

    const lowerQuarters = {
      _1: this.computer.compute(lower2._1.winner, upperSemis._1.loser),
      _2: this.computer.compute(lower2._2.winner, upperSemis._2.loser),
    };

    const lowerSemis = this.computer.compute(lowerQuarters._1.winner, lowerQuarters._2.winner);
    const lowerFinals = this.computer.compute(lowerSemis.winner, upperFinals.loser);
    const grandFinalsResult = this.runFinals(upperFinals.winner, lowerFinals.winner);

    this.result = {
      R9_12: [lower1._1.loser, lower1._2.loser, lower1._3.loser, lower1._4.loser],
      R7_8: [lower2._1.loser, lower2._2.loser],
      R5_6: [lowerQuarters._1.loser, lowerQuarters._2.loser],
      R4: [lowerSemis.loser],
      R3: [lowerFinals.loser],
      R2: [grandFinalsResult.loser],
      R1: [grandFinalsResult.winner],
    };
  }

  public toString(): string {
    return 'DoubleElimLower8Start';
  }

  private runFinals(upperTeam: Team, lowerTeam: Team) {
    const r1 = this.computer.compute(upperTeam, lowerTeam);
    if (r1.winner === upperTeam) {
      return {
        winner: r1.winner,
        loser: r1.loser,
      };
    } else {
      return this.computer.compute(upperTeam, lowerTeam);
    }
  }
}

export namespace DoubleElimLower8_12 {
  export interface Params {
    readonly R1_4: Team[];
    readonly R5_8: Team[];
    readonly R9_12: Team[];
  }

  export interface Result extends AbstractResult {
    readonly R1: Team[];
    readonly R2: Team[];
    readonly R3: Team[];
    readonly R4: Team[];
    readonly R5_6: Team[];
    readonly R7_8: Team[];
    readonly R9_12: Team[];
  }
  export const UPPER_MATCHES = [
    [1, 4],
    [2, 3],
  ];
}
