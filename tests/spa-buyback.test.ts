import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { BoughtBack } from "../generated/schema"
import { BoughtBack as BoughtBackEvent } from "../generated/SPABuyback/SPABuyback"
import { handleBoughtBack } from "../src/spa-buyback"
import { createBoughtBackEvent } from "./spa-buyback-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let receiverOfUSDs = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let senderOfSPA = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let spaPrice = BigInt.fromI32(234)
    let spaAmount = BigInt.fromI32(234)
    let usdsAmount = BigInt.fromI32(234)
    let newBoughtBackEvent = createBoughtBackEvent(
      receiverOfUSDs,
      senderOfSPA,
      spaPrice,
      spaAmount,
      usdsAmount
    )
    handleBoughtBack(newBoughtBackEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("BoughtBack created and stored", () => {
    assert.entityCount("BoughtBack", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "BoughtBack",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "receiverOfUSDs",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "BoughtBack",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "senderOfSPA",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "BoughtBack",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "spaPrice",
      "234"
    )
    assert.fieldEquals(
      "BoughtBack",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "spaAmount",
      "234"
    )
    assert.fieldEquals(
      "BoughtBack",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "usdsAmount",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
