import { useReducer } from "react"
import { usePermutationTest, useABTest, useSampleSizeCalculator } from "./hooks"

const dataset = require("./dataset.json")

const App = () => {
  const [{ MDE, CR }, setState] = useReducer(
    (state, action) => ({ ...state, ...action }),
    {
      MDE: undefined,
      CR: undefined,
    }
  )

  const handleChange = ({ target: { name, value } }) => {
    setState({ [name]: value })
  }

  const permutationTest = usePermutationTest({ dataset })
  console.log("Permutationstest:", permutationTest)

  const abTest = useABTest(permutationTest.sample)
  console.log("A/B-test:", abTest)

  const sampleSize = useSampleSizeCalculator({
    ...permutationTest.sample,
    mean: abTest.testData.mean,
    MDE,
    CR,
  })
  console.log("Provstorlek:", sampleSize)

  return (
    <>
      <p>Open console</p>
      <label>MDE </label>
      <input
        type="number"
        name="MDE"
        onChange={e => handleChange(e)}
        placeholder="20"
      />
      %<br />
      <br />
      <label>CR </label>
      <input
        type="number"
        name="CR"
        onChange={e => handleChange(e)}
        placeholder="2"
      />
    </>
  )
}

export default App
