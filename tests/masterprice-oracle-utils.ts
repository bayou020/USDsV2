import { newMockEvent } from "matchstick-as"
import { ethereum, Address, Bytes } from "@graphprotocol/graph-ts"
import {
  PriceFeedRemoved,
  PriceFeedUpdated
} from "../generated/MasterpriceOracle/MasterpriceOracle"

export function createPriceFeedRemovedEvent(token: Address): PriceFeedRemoved {
  let priceFeedRemovedEvent = changetype<PriceFeedRemoved>(newMockEvent())

  priceFeedRemovedEvent.parameters = new Array()

  priceFeedRemovedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )

  return priceFeedRemovedEvent
}

export function createPriceFeedUpdatedEvent(
  token: Address,
  source: Address,
  msgData: Bytes
): PriceFeedUpdated {
  let priceFeedUpdatedEvent = changetype<PriceFeedUpdated>(newMockEvent())

  priceFeedUpdatedEvent.parameters = new Array()

  priceFeedUpdatedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  priceFeedUpdatedEvent.parameters.push(
    new ethereum.EventParam("source", ethereum.Value.fromAddress(source))
  )
  priceFeedUpdatedEvent.parameters.push(
    new ethereum.EventParam("msgData", ethereum.Value.fromBytes(msgData))
  )

  return priceFeedUpdatedEvent
}
