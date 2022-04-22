import { usePermutationTest, useABTest } from "./hooks"

const dataset = require("./dataset.json")

const App = () => {
  const permutationTest = usePermutationTest({ dataset })
  console.log("Permutationstest:", permutationTest)

  const abTest = useABTest(permutationTest.sample)
  console.log("A/B-test:", abTest)

  return <p>Open console</p>
}

export default App
