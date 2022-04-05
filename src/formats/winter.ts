import { Format } from '../interfaces/format';
import { AbstractResult } from '../interfaces/abstract-result';
import { Team } from '../interfaces/team';
import { WinComputer } from '../win-calculator/win-computer';
import { DoubleElimLower8_12 } from './double-elim-lower-8.12';
import { RoundRobinGroups16 } from '../formats/round-robin-groups.16';

export class Winter implements Format {
  public readonly results: any;
  public groupResults: RoundRobinGroups16.Result;
  public doubleElimResults: DoubleElimLower8_12.Result;
  public result: WinterAlt.Result;

  // // teams are assumed to be sorted by descending seed
  constructor(private readonly teams: Team[], private readonly computer: WinComputer) {
    if (this.teams.length !== 16) throw new Error('Winter format must have 16 teams');

    this.groupResults = new RoundRobinGroups16(this.teams, this.computer).result;
    this.doubleElimResults = new DoubleElimLower8_12(this.groupResults, this.computer).result;

    this.result = {
      R13_16: this.groupResults.R13_16,
      ...this.doubleElimResults,
    };
  }

  public toString(): string {
    return 'Winter';
  }
}

export namespace WinterAlt {
  export interface Result
    extends Pick<RoundRobinGroups16.Result, 'R13_16'>,
      DoubleElimLower8_12.Result,
      AbstractResult {}
}
