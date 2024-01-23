import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { APRUpdated } from "../generated/schema"
import { APRUpdated as APRUpdatedEvent } from "../generated/RebaseManager/RebaseManager"
import { handleAPRUpdated } from "../src/rebase-manager"
import { createAPRUpdatedEvent } from "./rebase-manager-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let aprBottom = BigInt.fromI32(234)
    let aprCap = BigInt.fromI32(234)
    let newAPRUpdatedEvent = createAPRUpdatedEvent(aprBottom, aprCap)
    handleAPRUpdated(newAPRUpdatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("APRUpdated created and stored", () => {
    assert.entityCount("APRUpdated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "APRUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "aprBottom",
      "234"
    )
    assert.fieldEquals(
      "APRUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "aprCap",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
