import { Format } from '../interfaces/format';
import { AbstractResult } from '../interfaces/abstract-result';
import { Team } from '../interfaces/team';
import { EliminatoryResult, OneGroupResult, ThreeGroupsResult, TwoGroupsResult } from '../interfaces/results';
import { WinComputer } from '../win-calculator/win-computer';
import { MatchesConfig } from '../interfaces/match';

export class Swiss16 implements Format {
  public readonly result: Swiss16.Result;

  constructor(private readonly teams: Team[], private readonly computer: WinComputer) {
    if (this.teams.length !== 16) throw new Error('SwissGroup Group must have 16 teams');
    // // teams are assumed to be sorted by descending seed

    const swissR1 = this.runFirstGroup(this.teams);
    const swissR2 = this.runSecondRound(swissR1);
    const swissR3 = this.runThirdRound(swissR2);
    const swissR4 = this.runFourthRound(swissR3);
    const swissR5 = this.runFifthGroup(swissR4);
    this.result = {
      R1_2: swissR3.qualified,
      R3_5: swissR4.qualified,
      R6_8: swissR5.qualified,
      R9_11: swissR5.eliminated,
      R12_14: swissR4.eliminated,
      R15_16: swissR3.eliminated,
    };
  }

  public toString(): string {
    return 'SwissGroup';
  }

  private runFirstGroup(teams: Team[]): TwoGroupsResult {
    const r = this.runMatches(Swiss16.G16, teams);
    return {
      upper: r.winners,
      lower: r.losers,
    };
  }

  private runSecondRound(r: TwoGroupsResult): ThreeGroupsResult {
    const upperResult = this.runMatches(Swiss16.G8, r.upper);
    const lowerResult = this.runMatches(Swiss16.G8, r.lower);

    return {
      upper: upperResult.winners,
      mid: [...upperResult.losers, ...lowerResult.winners],
      lower: lowerResult.losers,
    };
  }

  private runThirdRound(r: ThreeGroupsResult): TwoGroupsResult & EliminatoryResult {
    const upperResult = this.runMatches(Swiss16.G4, r.upper);
    const midResult = this.runMatches(Swiss16.G8, r.mid);
    const lowerResult = this.runMatches(Swiss16.G4, r.lower);

    return {
      qualified: upperResult.winners,
      upper: [...upperResult.losers, ...midResult.winners],
      lower: [...midResult.losers, ...lowerResult.winners],
      eliminated: lowerResult.losers,
    };
  }

  private runFourthRound(r: TwoGroupsResult): OneGroupResult & EliminatoryResult {
    const upperResult = this.runMatches(Swiss16.G6, r.upper);
    const lowerResult = this.runMatches(Swiss16.G6, r.lower);

    return {
      qualified: upperResult.winners,
      teams: [...upperResult.losers, ...lowerResult.winners],
      eliminated: lowerResult.losers,
    };
  }

  private runFifthGroup(group: OneGroupResult): EliminatoryResult {
    const r = this.runMatches(Swiss16.G6, group.teams);
    return {
      qualified: r.winners,
      eliminated: r.losers,
    };
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

export namespace Swiss16 {
  export interface Result extends AbstractResult {
    readonly R1_2: Team[];
    readonly R3_5: Team[];
    readonly R6_8: Team[];
    readonly R9_11: Team[];
    readonly R12_14: Team[];
    readonly R15_16: Team[];
  }

  export const G16: MatchesConfig = [
    [1, 9],
    [2, 10],
    [3, 11],
    [4, 12],
    [5, 13],
    [6, 14],
    [7, 15],
    [8, 16],
  ];

  export const G8: MatchesConfig = [
    [1, 8],
    [2, 7],
    [3, 6],
    [4, 5],
  ];

  export const G6: MatchesConfig = [
    [1, 6],
    [2, 5],
    [3, 4],
  ];

  export const G4: MatchesConfig = [
    [1, 4],
    [2, 3],
  ];
}
