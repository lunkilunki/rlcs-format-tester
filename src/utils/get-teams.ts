import { Team } from '../interfaces/team';

export function getTeams(): Team[] {
  return [...Array(16).keys()].map((x) => ({ seed: x + 1 }));
}
