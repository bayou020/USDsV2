import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { BuybackAddressUpdated } from "../generated/schema"
import { BuybackAddressUpdated as BuybackAddressUpdatedEvent } from "../generated/YieldReserve/YieldReserve"
import { handleBuybackAddressUpdated } from "../src/yield-reserve"
import { createBuybackAddressUpdatedEvent } from "./yield-reserve-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let newBuyback = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newBuybackAddressUpdatedEvent = createBuybackAddressUpdatedEvent(
      newBuyback
    )
    handleBuybackAddressUpdated(newBuybackAddressUpdatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("BuybackAddressUpdated created and stored", () => {
    assert.entityCount("BuybackAddressUpdated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "BuybackAddressUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "newBuyback",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
