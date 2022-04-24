// const mean = arr => arr.reduce((a, b) => a + b, 0) / arr.length

const standardDeviation = (arr, mean) => {
  const sum = arr.reduce((acc, cur) => acc + (cur - mean) * (cur - mean), 0)

  return Math.sqrt(sum / (arr.length - 1))
}

const ncdf = (x, mean, sd) => {
  x = (x - mean) / sd
  const t = 1 / (1 + 0.2315419 * Math.abs(x))
  const d = 0.3989423 * Math.exp((-x * x) / 2)
  let prob =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))

  if (x > 0) prob = 1 - prob

  return prob
}

export const useABTest = ({ a, b }) => {
  const mean = (a.conversionRate + b.conversionRate) / 2 // See alt. at the top of the file
  const aStdError = Math.sqrt(
    (a.conversionRate * (1 - a.conversionRate)) / a.count
  )
  const bStdError = Math.sqrt(
    (b.conversionRate * (1 - b.conversionRate)) / b.count
  )
  const seDiff = Math.sqrt(Math.pow(aStdError, 2) + Math.pow(bStdError, 2))
  const zScore = (b.conversionRate - a.conversionRate) / seDiff
  const pValue = 1 - ncdf(zScore, 0, 1)
  const statisticalSignificance = 1 - pValue
  const power =
    1 -
    ncdf(
      (a.conversionRate + aStdError * 1.644853 - b.conversionRate) / bStdError,
      0,
      1
    )

  return {
    standardDeviation: standardDeviation(
      [a.conversionRate, b.conversionRate],
      mean
    ),
    aStdError,
    bStdError,
    mean,
    pValue,
    zScore,
    power,
    seDiff,
    positive: b.conversionRate > a.conversionRate,
    statisticalSignificance: `${(100 * statisticalSignificance).toFixed(2)}%`,
  }
}
