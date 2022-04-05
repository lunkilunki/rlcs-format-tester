import { Format } from '../interfaces/format';
import { AbstractResult } from '../interfaces/abstract-result';
import { Team } from '../interfaces/team';
import { EliminatoryResult } from '../interfaces/results';
import { MatchesConfig } from '../interfaces/match';
import { WinComputer } from '../win-calculator/win-computer';

export class SingleElim8 implements Format {
  public readonly result: SingleElim8.Result;

  constructor(private readonly teams: Team[], private readonly computer: WinComputer) {
    if (this.teams.length !== 8) throw new Error('SingleElim 8 teams Group must have 8 teams');
    if ([...this.teams.map((t) => t.seed)].length !== 8) throw new Error('team seeds must be distinct');
    // // teams are assumed to be sorted by descending seed

    const elimRO8 = this.runQuarters(this.teams);
    const elimRO4 = this.runSemis(elimRO8.qualified);
    const finals = this.runFinals(elimRO4.qualified);

    this.result = {
      R1: finals.qualified,
      R2: finals.eliminated,
      R3_4: elimRO4.eliminated,
      R5_8: elimRO8.eliminated,
    };
  }

  public toString(): string {
    return 'SingleElim 8 teams';
  }

  private runQuarters(teams: Team[]): EliminatoryResult {
    const result = this.runMatches(SingleElim8.R8, teams);
    return {
      qualified: result.winners,
      eliminated: result.losers,
    };
  }

  private runSemis(teams: Team[]): EliminatoryResult {
    const result = this.runMatches(SingleElim8.R4, teams);
    return {
      qualified: result.winners,
      eliminated: result.losers,
    };
  }

  private runFinals(teams: Team[]): EliminatoryResult {
    const r1 = this.computer.compute(teams[0], teams[1]);
    const r2 = this.computer.compute(teams[0], teams[1]);
    if (r1.winner === r2.winner) {
      const result = this.computer.compute(teams[0], teams[1]);
      return {
        qualified: [result.winner],
        eliminated: [result.loser],
      };
    } else {
      return {
        qualified: [r1.winner],
        eliminated: [r1.loser],
      };
    }
  }

  private runMatches(config: MatchesConfig, teams: Team[]) {
    const winners: Team[] = [];
    const losers: Team[] = [];

    for (const match of config) {
      const result = this.computer.compute(teams[match[0] - 1], teams[match[1] - 1]);
      winners.push(result.winner);
      losers.push(result.loser);
    }
    return { winners, losers };
  }
}

export namespace SingleElim8 {
  export interface Result extends AbstractResult {
    readonly R1: Team[];
    readonly R2: Team[];
    readonly R3_4: Team[];
    readonly R5_8: Team[];
  }

  export const R8: MatchesConfig = [
    [1, 8],
    [4, 5],
    [2, 7],
    [3, 6],
  ];

  export const R4: MatchesConfig = [
    [1, 2],
    [3, 4],
  ];
}
