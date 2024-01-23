import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import { TokenDataChanged } from "../generated/ChainlinkOracle/ChainlinkOracle"

export function createTokenDataChangedEvent(
  tokenAddr: Address,
  priceFeed: Address,
  pricePrecision: BigInt
): TokenDataChanged {
  let tokenDataChangedEvent = changetype<TokenDataChanged>(newMockEvent())

  tokenDataChangedEvent.parameters = new Array()

  tokenDataChangedEvent.parameters.push(
    new ethereum.EventParam("tokenAddr", ethereum.Value.fromAddress(tokenAddr))
  )
  tokenDataChangedEvent.parameters.push(
    new ethereum.EventParam("priceFeed", ethereum.Value.fromAddress(priceFeed))
  )
  tokenDataChangedEvent.parameters.push(
    new ethereum.EventParam(
      "pricePrecision",
      ethereum.Value.fromUnsignedBigInt(pricePrecision)
    )
  )

  return tokenDataChangedEvent
}
