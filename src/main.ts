import { getTeams } from './utils/get-teams';
import { Fall } from './formats/fall';
import { Winter } from './formats/winter';
import { WinComputer } from './win-calculator/win-computer';
import { Calculators } from './win-calculator/calculators';
import { SingleElim16 } from './formats/single-elim.16';
import { GSL } from './formats/gsl';
import { DoubleElim16 } from './formats/double-elim.16';
import { WinterAlt } from './formats/winter-alt';

const times = 100000;

const TEAMS = getTeams();

const fallRuns: Fall[] = [];
const winterRuns: Winter[] = [];
const winterAltRuns: WinterAlt[] = [];
const singleElimRuns: SingleElim16[] = [];
const gslRuns: GSL[] = [];
const doubleElimRuns: DoubleElim16[] = [];
const computer = new WinComputer(Calculators.linearFactory(70, 1.7));

const start = Date.now();
let generationStart = Date.now();
console.log('generating runs for Fall format');
for (let i = 0; i < times; i++) {
  fallRuns.push(new Fall(TEAMS, computer));
}
console.log(
  `generation done in ${Math.floor((Date.now() - generationStart) / 1000)}.${
    (Date.now() - generationStart) % 1000
  }s`,
);

generationStart = Date.now();
console.log('generating runs for Winter format');
for (let i = 0; i < times; i++) {
  winterRuns.push(new Winter(TEAMS, computer));
}
console.log(
  `generation done in ${Math.floor((Date.now() - generationStart) / 1000)}.${
    (Date.now() - generationStart) % 1000
  }s`,
);

generationStart = Date.now();
console.log('generating runs for Winter-alt format');
for (let i = 0; i < times; i++) {
  winterAltRuns.push(new WinterAlt(TEAMS, computer));
}
console.log(
  `generation done in ${Math.floor((Date.now() - generationStart) / 1000)}.${
    (Date.now() - generationStart) % 1000
  }s`,
);

generationStart = Date.now();
console.log('generating runs for SingleElim format');
for (let i = 0; i < times; i++) {
  singleElimRuns.push(new SingleElim16(TEAMS, computer));
}
console.log(
  `generation done in ${Math.floor((Date.now() - generationStart) / 1000)}.${
    (Date.now() - generationStart) % 1000
  }s`,
);

generationStart = Date.now();
console.log('generating runs for GSL format');
for (let i = 0; i < times; i++) {
  gslRuns.push(new GSL(TEAMS, computer));
}
console.log(
  `generation done in ${Math.floor((Date.now() - generationStart) / 1000)}.${
    (Date.now() - generationStart) % 1000
  }s`,
);

generationStart = Date.now();
console.log('generating runs for DoubleElim format');
for (let i = 0; i < times; i++) {
  doubleElimRuns.push(new DoubleElim16(TEAMS, computer));
}
console.log(
  `generation done in ${Math.floor((Date.now() - generationStart) / 1000)}.${
    (Date.now() - generationStart) % 1000
  }s`,
);

const d = {
  fall: fallRuns,
  winter: winterRuns,
  winterAlt: winterAltRuns,
  single: singleElimRuns,
  gsl: gslRuns,
  double: doubleElimRuns,
};

function percentage(n: number, max: number = times) {
  const val = (n * 100) / max;
  return val.toFixed(2);
}

generationStart = Date.now();
console.log('computing stats');

const fall = {
  winnerIsTop2Swiss: d.fall.filter((f) => f.swissResults.R1_2.includes(f.result.R1[0])).length,
  winnerIsTop3_5Swiss: d.fall.filter((f) => f.swissResults.R3_5.includes(f.result.R1[0])).length,
  winnerIsTop6_8Swiss: d.fall.filter((f) => f.swissResults.R6_8.includes(f.result.R1[0])).length,
  winratePerSeed: TEAMS.map((t) => d.fall.filter((x) => x.result.R1[0].seed === t.seed).length),
  seed1WonFrom6_8Swiss: d.fall.filter(
    (f) => f.swissResults.R6_8.find((x) => x.seed === 1) && f.result.R1[0].seed === 1,
  ).length,
  seed1WonFrom3_8Swiss: d.fall.filter(
    (f) => !f.swissResults.R1_2.find((x) => x.seed === 1) && f.result.R1[0].seed === 1,
  ).length,
  seed1WonFrom1_2Swiss: d.fall.filter(
    (f) => f.swissResults.R1_2.find((x) => x.seed === 1) && f.result.R1[0].seed === 1,
  ).length,
  seed1Is6_8Swiss: d.fall.filter((f) => f.swissResults.R6_8.find((x) => x.seed === 1)).length,
  seed1Is3_8Swiss: d.fall.filter((f) => !f.swissResults.R1_2.find((x) => x.seed === 1)).length,
  seed1Is1_2Swiss: d.fall.filter((f) => f.swissResults.R1_2.find((x) => x.seed === 1)).length,
};

const winter = {
  winnerIsTop4Groups: d.winter.filter((w) => w.groupResults.R1_4.includes(w.result.R1[0])).length,
  winnerIsTop5_8Groups: d.winter.filter((w) => !w.groupResults.R1_4.includes(w.result.R1[0])).length,
  winnerIsTop9_12Groups: d.winter.filter(
    (w) => !w.groupResults.R1_4.includes(w.result.R1[0]) && !w.groupResults.R5_8.includes(w.result.R1[0]),
  ).length,
  winratePerSeed: TEAMS.map((t) => d.winter.filter((x) => x.result.R1[0].seed === t.seed).length),
  seed1WonFrom1_4Groups: d.winter.filter(
    (w) => w.groupResults.R1_4.find((x) => x.seed === 1) && w.result.R1[0].seed === 1,
  ).length,
  seed1WonFrom5_12Groups: d.winter.filter(
    (w) => !w.groupResults.R1_4.find((x) => x.seed === 1) && w.result.R1[0].seed === 1,
  ).length,
  seed1Is5_12Groups: d.winter.filter((w) => !w.groupResults.R1_4.find((x) => x.seed === 1)).length,
  seed1Is1_4Groups: d.winter.filter((w) => w.groupResults.R1_4.find((x) => x.seed === 1)).length,
};

const winterAlt = {
  winnerIsTop4Groups: d.winterAlt.filter((w) => w.groupResults.R1_4.includes(w.result.R1[0])).length,
  winnerIsTop5_8Groups: d.winterAlt.filter((w) => w.groupResults.R5_8.includes(w.result.R1[0])).length,
  winnerIsTop9_12Groups: d.winterAlt.filter(
    (w) => !w.groupResults.R1_4.includes(w.result.R1[0]) && !w.groupResults.R5_8.includes(w.result.R1[0]),
  ).length,
  winratePerSeed: TEAMS.map((t) => d.winterAlt.filter((x) => x.result.R1[0].seed === t.seed).length),
  seed1WonFrom1_8Groups: d.winterAlt.filter(
    (w) =>
      (w.groupResults.R1_4.find((x) => x.seed === 1) || w.groupResults.R5_8.find((x) => x.seed === 1)) &&
      w.result.R1[0].seed === 1,
  ).length,
  seed1WonFrom9_12Groups: d.winterAlt.filter(
    (w) => w.groupResults.R9_12.find((x) => x.seed === 1) && w.result.R1[0].seed === 1,
  ).length,
  seed1Is9_12Groups: d.winterAlt.filter((w) => w.groupResults.R9_12.find((x) => x.seed === 1)).length,
  seed1Is1_8Groups: d.winterAlt.filter(
    (w) => w.groupResults.R1_4.find((x) => x.seed === 1) || w.groupResults.R5_8.find((x) => x.seed === 1),
  ).length,
};

const single = {
  winratePerSeed: TEAMS.map((t) => d.single.filter((x) => x.result.R1[0].seed === t.seed).length),
};

const double = {
  winratePerSeed: TEAMS.map((t) => d.double.filter((x) => x.result.R1[0].seed === t.seed).length),
  winnerWentThroughLower: d.double.filter((d) => d.winnerWentThroughLower !== null).length,
  winnerLostUpperRO16: d.double.filter((d) => d.winnerWentThroughLower === DoubleElim16.UpperRounds.RO16)
    .length,
  winnerLostUpperRO8: d.double.filter((d) => d.winnerWentThroughLower === DoubleElim16.UpperRounds.RO8)
    .length,
  winnerLostUpperRO4: d.double.filter((d) => d.winnerWentThroughLower === DoubleElim16.UpperRounds.RO4)
    .length,
  winnerLostUpperRO2: d.double.filter((d) => d.winnerWentThroughLower === DoubleElim16.UpperRounds.RO2)
    .length,
  seed1LostUpperRO16: d.double.filter((d) => d.seed1WentToLowerInRO16).length,
  seed1WonFromLostUpperRO16: d.double.filter(
    (d) => d.result.R1[0].seed === 1 && d.winnerWentThroughLower === DoubleElim16.UpperRounds.RO16,
  ).length,
};

const gsl = {
  winratePerSeed: TEAMS.map((t) => d.gsl.filter((x) => x.result.R1[0].seed === t.seed).length),
  winnerToppedHisGroup: d.gsl.filter((x) =>
    x.groupsResult.map((g) => g.qualified[0]).includes(x.result.R1[0]),
  ).length,
};

console.log(
  `stats computation done in ${Math.floor((Date.now() - generationStart) / 1000)}.${
    (Date.now() - generationStart) % 1000
  }s`,
);
console.log(`process took ${Math.floor((Date.now() - start) / 1000)}.${(Date.now() - start) % 1000}`);
console.log('\n');

console.log(`Stats for ${times} runs`);
console.log(`Match resolution is done using ${computer.calculator.toString()}`);
console.log('\n');
console.log('FALL FORMAT');
console.log('Percentage over number of runs');
console.log(` winrate per seed : ${fall.winratePerSeed.map((w) => `${percentage(w)}%`).join(' - ')}`);
console.log(` winner was top2 in swiss : ${percentage(fall.winnerIsTop2Swiss)}%`);
console.log(` winner was 3-5 in swiss : ${percentage(fall.winnerIsTop3_5Swiss)}%`);
console.log(` winner was 6-8 in swiss : ${percentage(fall.winnerIsTop6_8Swiss)}%`);
console.log("Percentage over number of times 'from' situation happened");
console.log(
  ` seed 1 won from 6-8 in swiss : ${percentage(
    fall.seed1WonFrom6_8Swiss,
    fall.seed1Is6_8Swiss,
  )}% (happened ${percentage(fall.seed1Is6_8Swiss)}% of the time)`,
);
console.log(
  ` seed 1 won from 3-8 in swiss : ${percentage(
    fall.seed1WonFrom3_8Swiss,
    fall.seed1Is3_8Swiss,
  )}% (happened ${percentage(fall.seed1Is3_8Swiss)}% of the time)`,
);
console.log(
  ` seed 1 won from 1-2 in swiss : ${percentage(
    fall.seed1WonFrom1_2Swiss,
    fall.seed1Is1_2Swiss,
  )}% (happened ${percentage(fall.seed1Is1_2Swiss)}% of the time)`,
);

console.log('\n');
console.log('WINTER FORMAT');
console.log('Percentage over number of runs');
console.log(` winrate per seed : ${winter.winratePerSeed.map((w) => `${percentage(w)}%`).join(' - ')}`);
console.log(` winner was top4 in groups : ${percentage(winter.winnerIsTop4Groups)}%`);
console.log(` winner was 5-8 in groups : ${percentage(winter.winnerIsTop5_8Groups)}%`);
console.log(` winner was 9-12 groups : ${percentage(winter.winnerIsTop9_12Groups)}%`);
console.log("Percentage over number of times 'from' situation happened");
console.log(
  ` seed 1 won from 5-12 in groups : ${percentage(
    winter.seed1WonFrom5_12Groups,
    winter.seed1Is5_12Groups,
  )}% (happened ${percentage(winter.seed1Is5_12Groups)}% of the time)`,
);
console.log(
  ` seed 1 won from 1-4 in groups : ${percentage(
    winter.seed1WonFrom1_4Groups,
    winter.seed1Is1_4Groups,
  )}% (happened ${percentage(winter.seed1Is1_4Groups)}% of the time)`,
);

console.log('\n');
console.log('WINTER ALT FORMAT (groups 1-8 -> upper and 9-12 -> lower)');
console.log('Percentage over number of runs');
console.log(` winrate per seed : ${winterAlt.winratePerSeed.map((w) => `${percentage(w)}%`).join(' - ')}`);
console.log(` winner was top4 in groups : ${percentage(winterAlt.winnerIsTop4Groups)}%`);
console.log(` winner was 5-8 in groups : ${percentage(winterAlt.winnerIsTop5_8Groups)}%`);
console.log(` winner was 9-12 groups : ${percentage(winterAlt.winnerIsTop9_12Groups)}%`);
console.log("Percentage over number of times 'from' situation happened");
console.log(
  ` seed 1 won from 9-12 in groups : ${percentage(
    winterAlt.seed1WonFrom9_12Groups,
    winterAlt.seed1Is9_12Groups,
  )}% (happened ${percentage(winterAlt.seed1Is9_12Groups)}% of the time)`,
);
console.log(
  ` seed 1 won from 1-8 in groups : ${percentage(
    winterAlt.seed1WonFrom1_8Groups,
    winterAlt.seed1Is1_8Groups,
  )}% (happened ${percentage(winterAlt.seed1Is1_8Groups)}% of the time)`,
);

console.log('\n');
console.log('SINGLE ELIM FORMAT');
console.log('Percentage over number of runs');
console.log(` winrate per seed : ${single.winratePerSeed.map((w) => `${percentage(w)}%`).join(' - ')}`);

console.log('\n');
console.log('DOUBLE ELIM FORMAT');
console.log('Percentage over number of runs');
console.log(` winrate per seed : ${double.winratePerSeed.map((w) => `${percentage(w)}%`).join(' - ')}`);
console.log(` winner went to lower : ${percentage(double.winnerWentThroughLower)}%`);
console.log(` winner went to lower in RO16 : ${percentage(double.winnerLostUpperRO16)}%`);
console.log(` winner went to lower in RO8 : ${percentage(double.winnerLostUpperRO8)}%`);
console.log(` winner went to lower in RO4 : ${percentage(double.winnerLostUpperRO4)}%`);
console.log(` winner went to lower in RO2 : ${percentage(double.winnerLostUpperRO2)}%`);
console.log("Percentage over number of times 'from' situation happened");
console.log(
  ` seed 1 won from going in Lower in RO16 : ${percentage(
    double.seed1WonFromLostUpperRO16,
    double.seed1LostUpperRO16,
  )}%`,
);

console.log('\n');
console.log('GSL FORMAT');
console.log('Percentage over number of runs');
console.log(` winrate per seed : ${gsl.winratePerSeed.map((w) => `${percentage(w)}%`).join(' - ')}`);
console.log(` winner topped his group : ${percentage(gsl.winnerToppedHisGroup)}%`);
