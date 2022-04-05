export function getAverage(numbers: number[]) {
  const sum = numbers.reduce((a, b) => a + b, 0);
  const avg = sum / numbers.length;
  return avg;
}

export function getStandardDeviation(numbers: number[]) {
  const avg = getAverage(numbers);
  const squares = numbers.map((n) => {
    const diff = Math.abs(n - avg);
    return diff * diff;
  });
  const squaresSum = squares.reduce((a, b) => a + b);
  return Math.sqrt(squaresSum / numbers.length);
}

export function getMedian(numbers: number[]) {
  numbers.sort();
  const half = Math.floor(numbers.length / 2);
  if (numbers.length % 2) {
    return numbers[half];
  } else {
    return (numbers[half - 1] + numbers[half]) / 2;
  }
}

// console.log(getStandardDeviation([6, 2, 3, 1]));
