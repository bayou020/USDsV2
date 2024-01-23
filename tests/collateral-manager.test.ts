import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address } from "@graphprotocol/graph-ts"
import { CollateralAdded } from "../generated/schema"
import { CollateralAdded as CollateralAddedEvent } from "../generated/CollateralManager/CollateralManager"
import { handleCollateralAdded } from "../src/collateral-manager"
import { createCollateralAddedEvent } from "./collateral-manager-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let collateral = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let data = "ethereum.Tuple Not implemented"
    let newCollateralAddedEvent = createCollateralAddedEvent(collateral, data)
    handleCollateralAdded(newCollateralAddedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("CollateralAdded created and stored", () => {
    assert.entityCount("CollateralAdded", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "CollateralAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "collateral",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "CollateralAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "data",
      "ethereum.Tuple Not implemented"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
