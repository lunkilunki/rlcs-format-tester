import { Format } from '../interfaces/format';
import { AbstractResult } from '../interfaces/abstract-result';
import { Team } from '../interfaces/team';
import { WinComputer } from '../win-calculator/win-computer';

export class RoundRobinGroups16 implements Format {
  public readonly result: RoundRobinGroups16.Result;

  constructor(private readonly teams: Team[], private readonly computer: WinComputer) {
    if (this.teams.length !== 16) throw new Error('RoundRobinGroups must have 16 teams');
    // // teams are assumed to be sorted by descending seed

    const results = [
      this.runGroup(RoundRobinGroups16.GROUPS.A.map((seed) => this.teams[seed - 1])),
      this.runGroup(RoundRobinGroups16.GROUPS.B.map((seed) => this.teams[seed - 1])),
      this.runGroup(RoundRobinGroups16.GROUPS.C.map((seed) => this.teams[seed - 1])),
      this.runGroup(RoundRobinGroups16.GROUPS.D.map((seed) => this.teams[seed - 1])),
    ];

    this.result = {
      R1_4: results.map((r) => r[0]),
      R5_8: results.map((r) => r[1]),
      R9_12: results.map((r) => r[2]),
      R13_16: results.map((r) => r[3]),
    };
  }

  public toString(): string {
    return 'RoundRobinGroups';
  }

  private runGroup(teams: Team[]): Team[] {
    let ranking = teams.map((t) => ({ team: t, score: 0 }));

    const matchesResult: Team[] = [];
    matchesResult.push(this.computer.compute(teams[0], teams[1]).winner);
    matchesResult.push(this.computer.compute(teams[0], teams[2]).winner);
    matchesResult.push(this.computer.compute(teams[0], teams[3]).winner);
    matchesResult.push(this.computer.compute(teams[1], teams[2]).winner);
    matchesResult.push(this.computer.compute(teams[1], teams[3]).winner);
    matchesResult.push(this.computer.compute(teams[2], teams[3]).winner);
    matchesResult.forEach((r) => (ranking.find((t) => t.team === r)!.score += 1));

    ranking.sort((a, b) => (a.score < b.score ? 1 : a.score == b.score ? 0 : -1));

    const finalRanking: Team[] = [];

    // upper tie break
    if (ranking[0].score === ranking[1].score) {
      const upperTieBreakerResult = this.computer.compute(ranking[0].team, ranking[1].team);
      finalRanking.push(upperTieBreakerResult.winner);
      finalRanking.push(upperTieBreakerResult.loser);
    } else {
      finalRanking.push(ranking[0].team);
      finalRanking.push(ranking[1].team);
    }
    // lower tie break
    if (ranking[2].score === ranking[3].score) {
      const lowerTieBreakerResult = this.computer.compute(ranking[2].team, ranking[3].team);
      finalRanking.push(lowerTieBreakerResult.winner);
      finalRanking.push(lowerTieBreakerResult.loser);
    } else {
      finalRanking.push(ranking[2].team);
      finalRanking.push(ranking[3].team);
    }

    return finalRanking;
  }
}

export namespace RoundRobinGroups16 {
  export interface Result extends AbstractResult {
    readonly R1_4: Team[];
    readonly R5_8: Team[];
    readonly R9_12: Team[];
    readonly R13_16: Team[];
  }

  export const GROUPS = {
    A: [1, 8, 10, 15],
    B: [2, 7, 9, 16],
    C: [3, 6, 12, 13],
    D: [4, 5, 11, 14],
  };
}
