const helpers = {
  mean: arr => arr.reduce((a, b) => a + b, 0) / arr.length,
  standardDeviation: (arr, mean) => {
    const sum = arr.reduce((acc, cur) => acc + (cur - mean) * (cur - mean), 0)

    return Math.sqrt(sum / (arr.length - 1))
  },
  ncdf: (x, mean, sd) => {
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
  },
}

export const useABTest = ({ a, b }) => {
  const mean = (a.conversionRate + b.conversionRate) / 2
  const aStdError = Math.sqrt(
    (a.conversionRate * (1 - a.conversionRate)) / a.count
  )
  const bStdError = Math.sqrt(
    (b.conversionRate * (1 - b.conversionRate)) / b.count
  )
  const seDiff = Math.sqrt(Math.pow(aStdError, 2) + Math.pow(bStdError, 2))
  const zScore = (b.conversionRate - a.conversionRate) / seDiff
  const pValue = 1 - helpers.ncdf(zScore, 0, 1)
  const statisticalSignificance = 1 - pValue
  const power =
    1 -
    helpers.ncdf(
      (a.conversionRate + aStdError * 1.644853 - b.conversionRate) / bStdError,
      0,
      1
    )

  return {
    testData: {
      standardDeviation: helpers.standardDeviation(
        [a.conversionRate, b.conversionRate],
        mean
      ),
      mean,
      pValue,
      zScore,
      power,
      positive: b.conversionRate > a.conversionRate,
      statisticalSignificance: `${(100 * statisticalSignificance).toFixed(2)}%`,
    },
  }
}
