import { Format } from '../interfaces/format';
import { AbstractResult } from '../interfaces/abstract-result';
import { Team } from '../interfaces/team';
import { WinComputer } from '../win-calculator/win-computer';
import { MatchesConfig } from '../interfaces/match';

export class DoubleElim16 implements Format {
  public readonly result: DoubleElim16.Result;
  public readonly winnerWentThroughLower: DoubleElim16.UpperRounds | null;
  public readonly seed1WentToLowerInRO16: boolean = false;

  constructor(private readonly teams: Team[], private readonly computer: WinComputer) {
    if (this.teams.length !== 16) throw new Error('double elim 16 must have 16 teams');
    if ([...this.teams.map((t) => t.seed)].length !== 16) throw new Error('team seeds must be distinct');
    // // teams are assumed to be sorted by descending seed

    const uEights = this.runMatches(DoubleElim16.UR16, teams); // 16 teams
    const uQuarters = this.runMatches(DoubleElim16.UR8, uEights.winners); // 8 teams
    const uSemis = this.runMatches(DoubleElim16.UR4, uQuarters.winners); // 4 teams
    const uFinals = this.computer.compute(uSemis.winners[0], uSemis.winners[1]); // 2 teams

    const lr1 = this.runMatches(DoubleElim16.LR8, uEights.losers); // 8 teams
    const lr2 = this.runMatches(DoubleElim16.LR8Merge, [...uQuarters.losers, ...lr1.winners]); // 8 teams
    const lr3 = this.runMatches(DoubleElim16.LR4, lr2.winners); // 4 teams
    const lr4 = this.runMatches(DoubleElim16.LR4Merge, [...uSemis.losers, ...lr3.winners]); // 4 teams
    const lr5 = this.computer.compute(lr4.winners[0], lr4.winners[1]); // 2 teams
    const lr6 = this.computer.compute(uFinals.loser, lr5.winner); // 2 teams

    const grandFinalsResult = this.runFinals(uFinals.winner, lr6.winner);

    this.result = {
      R13_16: lr1.losers,
      R9_12: lr2.losers,
      R7_8: lr3.losers,
      R5_6: lr4.losers,
      R4: [lr5.loser],
      R3: [lr6.loser],
      R2: [grandFinalsResult.loser],
      R1: [grandFinalsResult.winner],
    };

    if (uEights.losers.includes(this.result.R1[0])) {
      this.winnerWentThroughLower = DoubleElim16.UpperRounds.RO16;
    } else if (uQuarters.losers.includes(this.result.R1[0])) {
      this.winnerWentThroughLower = DoubleElim16.UpperRounds.RO8;
    } else if (uSemis.losers.includes(this.result.R1[0])) {
      this.winnerWentThroughLower = DoubleElim16.UpperRounds.RO4;
    } else if (uFinals.loser === this.result.R1[0]) {
      this.winnerWentThroughLower = DoubleElim16.UpperRounds.RO2;
    } else {
      this.winnerWentThroughLower = null;
    }

    if (uEights.losers.includes(this.teams[0])) {
      this.seed1WentToLowerInRO16 = true;
    }
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

export namespace DoubleElim16 {
  export enum UpperRounds {
    RO16,
    RO8,
    RO4,
    RO2,
  }
  export interface Result extends AbstractResult {
    readonly R1: Team[];
    readonly R2: Team[];
    readonly R3: Team[];
    readonly R4: Team[];
    readonly R5_6: Team[];
    readonly R7_8: Team[];
    readonly R9_12: Team[];
    readonly R13_16: Team[];
  }

  export const UR16: MatchesConfig = [
    [1, 16],
    [8, 9],
    [4, 13],
    [5, 12],
    [2, 15],
    [7, 10],
    [3, 14],
    [6, 11],
  ];

  export const UR8: MatchesConfig = [
    [1, 2],
    [3, 4],
    [5, 6],
    [7, 8],
  ];

  export const UR4: MatchesConfig = [
    [1, 2],
    [3, 4],
  ];

  export const LR8: MatchesConfig = [
    [1, 2],
    [3, 4],
    [5, 6],
    [7, 8],
  ];

  export const LR8Merge: MatchesConfig = [
    [4, 5],
    [3, 6],
    [2, 7],
    [1, 8],
  ];

  export const LR4: MatchesConfig = [
    [1, 2],
    [3, 4],
  ];

  export const LR4Merge: MatchesConfig = [
    [1, 2],
    [3, 4],
  ];
}
