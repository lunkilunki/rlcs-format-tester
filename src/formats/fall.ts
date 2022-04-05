import { Format } from '../interfaces/format';
import { AbstractResult } from '../interfaces/abstract-result';
import { Team } from '../interfaces/team';
import { WinComputer } from '../win-calculator/win-computer';
import { SingleElim8 } from './single-elim.8';
import { Swiss16 } from './swiss.16';

export class Fall implements Format {
  public readonly swissResults: Swiss16.Result;
  public readonly singleElimResults: SingleElim8.Result;
  public readonly result: Fall.Result;

  // // teams are assumed to be sorted by descending seed
  constructor(private readonly teams: Team[], private readonly computer: WinComputer) {
    if (this.teams.length !== 16) throw new Error('Fall format must have 16 teams');

    this.swissResults = new Swiss16(this.teams, this.computer).result;
    this.singleElimResults = new SingleElim8(
      [...this.swissResults.R1_2, ...this.swissResults.R3_5, ...this.swissResults.R6_8],
      this.computer,
    ).result;

    this.result = {
      ...this.singleElimResults,
      R9_11: this.swissResults.R9_11,
      R12_14: this.swissResults.R12_14,
      R15_16: this.swissResults.R15_16,
    };
  }

  public toString(): string {
    return 'Fall';
  }
}

export namespace Fall {
  export interface Result
    extends Pick<Swiss16.Result, 'R15_16' | 'R12_14' | 'R9_11'>,
      SingleElim8.Result,
      AbstractResult {}
}
