import { useReducer } from "react"
import { usePermutationTest, useABTest, useSampleSizeCalculator } from "./hooks"

const dataset = require("./dataset.json")

const App = () => {
  const { sample, permutationTest } = usePermutationTest({ dataset })
  console.log("Sample:", sample)
  console.log("Permutationstest:", permutationTest)

  const abTest = useABTest(sample)
  console.log("A/B-test:", abTest)

  // Below is related to the sample size calculator

  const [{ MDE, CR }, setState] = useReducer(
    (state, action) => ({ ...state, ...action }),
    {
      MDE: undefined,
      CR: undefined,
    }
  )

  const handleChange = ({ target: { name, value } }) =>
    setState({ [name]: value })

  const sampleSize = useSampleSizeCalculator({
    ...sample,
    mean: abTest.mean,
    MDE,
    CR,
  })
  console.log("Provstorlek:", sampleSize)

  return (
    <>
      <p>Open console</p>
      <label>
        MDE
        <input
          type="number"
          name="MDE"
          onChange={e => handleChange(e)}
          placeholder="20"
        />
        %
      </label>
      <br />
      <br />
      <label>
        CR
        <input
          type="number"
          name="CR"
          onChange={e => handleChange(e)}
          placeholder="2"
        />
        %
      </label>
    </>
  )
}

export default App
