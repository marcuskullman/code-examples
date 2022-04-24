const reduceData = (dataset, shuffle) => {
  if (shuffle) {
    shuffle = [...dataset]
  }

  const { a, b } = dataset.reduce(
    (acc, { converted, variation }) => {
      if (shuffle) {
        const index = Math.floor(Math.random() * shuffle.length)
        variation = shuffle[index].variation
        shuffle.splice(index, 1)
      }

      acc[variation].count += 1

      if (converted) {
        acc[variation].conversions += 1
      }

      return acc
    },
    {
      a: {
        count: 0,
        conversions: 0,
      },
      b: {
        count: 0,
        conversions: 0,
      },
    }
  )

  a.conversionRate = a.conversions / a.count
  b.conversionRate = b.conversions / b.count

  return {
    a,
    b,
    testStatistic:
      (100 * (b.conversionRate - a.conversionRate)) / a.conversionRate,
  }
}

export const usePermutationTest = ({ dataset, simulations = 5000 }) => {
  const sample = reduceData(dataset)
  const distribution = {}
  let sum = 0

  for (let i = 0; i < simulations; i++) {
    const { a, b, testStatistic } = reduceData(dataset, true)
    const key = `A${a.conversions}-B${b.conversions}`
    distribution[key] = (distribution[key] || 0) + 1

    if (testStatistic >= sample.testStatistic) {
      sum += 1
    }
  }

  const pValue = sum / simulations
  const statisticalSignificance = 1 - pValue

  return {
    sample,
    permutationTest: {
      simulations,
      distribution,
      pValue,
      statisticalSignificance: `${(100 * statisticalSignificance).toFixed(2)}%`,
    },
  }
}
