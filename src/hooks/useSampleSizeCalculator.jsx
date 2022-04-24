const roundToSigFigs = (inputNumber, sigFigs = 2) => {
  const n = Math.round(inputNumber)
  const mult = Math.pow(10, sigFigs - Math.floor(Math.log(n) / Math.LN10) - 1)
  const roundOnce = Math.round(n * mult) / mult

  return Math.round(roundOnce)
}

const calcSampleEstimate = (significance, variance, theta) =>
  (2 *
    (1 - significance) *
    variance *
    Math.log(1 + Math.sqrt(variance) / theta)) /
  (theta * theta)

const calcVariance = (c1, c2) => c1 * (1 - c1) + c2 * (1 - c2)

const sampleSizeEstimate = (
  relativeMDE,
  baselineCR,
  statisticalSignificance = 0.95
) => {
  const marginOfError = 1 - statisticalSignificance
  const absoluteMDE = baselineCR * relativeMDE
  const c2 = baselineCR - absoluteMDE
  const c3 = baselineCR + absoluteMDE
  const theta = Math.abs(absoluteMDE)
  const variance1 = calcVariance(baselineCR, c2)
  const variance2 = calcVariance(baselineCR, c3)
  const sampleEstimate1 = calcSampleEstimate(marginOfError, variance1, theta)
  const sampleEstimate2 = calcSampleEstimate(marginOfError, variance2, theta)
  const sampleEstimate =
    Math.abs(sampleEstimate1) >= Math.abs(sampleEstimate2)
      ? sampleEstimate1
      : sampleEstimate2

  if (!isFinite(sampleEstimate) || sampleEstimate < 0) {
    return NaN
  }

  return roundToSigFigs(sampleEstimate)
}

// Additionally you can also pass a start time and override the default fixed horizon
export const useSampleSizeCalculator = ({
  a,
  b,
  testStatistic,
  MDE,
  CR,
  mean,
  startTime = +new Date(),
  minDays = 14,
  minConversionsPerSample = 100,
}) => {
  if ((MDE && (isNaN(MDE) || MDE < 1)) || (CR && (isNaN(CR) || CR < 1))) {
    alert("Leave blank or enter a positive number.")
    return
  }

  const relativeMDE = MDE ? parseFloat(MDE / 100) : testStatistic / 100
  const baselineCR = CR ? parseFloat(CR / 100) : mean
  const sampleSize = sampleSizeEstimate(relativeMDE, baselineCR)

  const fhConversions =
    a.conversions >= minConversionsPerSample &&
    b.conversions >= minConversionsPerSample
  const fhDuration =
    Math.ceil((minDays * 86400000 - (+new Date() - startTime)) / 86400000) <= 0

  return {
    sampleSize: `${sampleSize} (per variation)`,
    fixedHorizon: fhConversions && fhDuration,
  }
}
