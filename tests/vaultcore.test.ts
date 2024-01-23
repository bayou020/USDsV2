import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { Allocated } from "../generated/schema"
import { Allocated as AllocatedEvent } from "../generated/Vaultcore/Vaultcore"
import { handleAllocated } from "../src/vaultcore"
import { createAllocatedEvent } from "./vaultcore-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let collateral = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let strategy = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let amount = BigInt.fromI32(234)
    let newAllocatedEvent = createAllocatedEvent(collateral, strategy, amount)
    handleAllocated(newAllocatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("Allocated created and stored", () => {
    assert.entityCount("Allocated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "Allocated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "collateral",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "Allocated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "strategy",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "Allocated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "amount",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
