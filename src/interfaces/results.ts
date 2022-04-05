import { Team } from './team';

export interface OneGroupResult {
  readonly teams: Team[];
}

export interface EliminatoryResult {
  readonly qualified: Team[];
  readonly eliminated: Team[];
}

export interface TwoGroupsResult {
  readonly upper: Team[];
  readonly lower: Team[];
}

export interface ThreeGroupsResult {
  readonly upper: Team[];
  readonly mid: Team[];
  readonly lower: Team[];
}
