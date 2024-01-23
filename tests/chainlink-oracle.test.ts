import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { TokenDataChanged } from "../generated/schema"
import { TokenDataChanged as TokenDataChangedEvent } from "../generated/ChainlinkOracle/ChainlinkOracle"
import { handleTokenDataChanged } from "../src/chainlink-oracle"
import { createTokenDataChangedEvent } from "./chainlink-oracle-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let tokenAddr = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let priceFeed = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let pricePrecision = BigInt.fromI32(234)
    let newTokenDataChangedEvent = createTokenDataChangedEvent(
      tokenAddr,
      priceFeed,
      pricePrecision
    )
    handleTokenDataChanged(newTokenDataChangedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("TokenDataChanged created and stored", () => {
    assert.entityCount("TokenDataChanged", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "TokenDataChanged",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tokenAddr",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "TokenDataChanged",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "priceFeed",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "TokenDataChanged",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "pricePrecision",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
