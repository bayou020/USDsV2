import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import {
  CollateralAdded,
  CollateralInfoUpdated,
  CollateralRemoved,
  CollateralStrategyAdded,
  CollateralStrategyRemoved,
  CollateralStrategyUpdated
} from "../generated/CollateralManager/CollateralManager"

export function createCollateralAddedEvent(
  collateral: Address,
  data: ethereum.Tuple
): CollateralAdded {
  let collateralAddedEvent = changetype<CollateralAdded>(newMockEvent())

  collateralAddedEvent.parameters = new Array()

  collateralAddedEvent.parameters.push(
    new ethereum.EventParam(
      "collateral",
      ethereum.Value.fromAddress(collateral)
    )
  )
  collateralAddedEvent.parameters.push(
    new ethereum.EventParam("data", ethereum.Value.fromTuple(data))
  )

  return collateralAddedEvent
}

export function createCollateralInfoUpdatedEvent(
  collateral: Address,
  data: ethereum.Tuple
): CollateralInfoUpdated {
  let collateralInfoUpdatedEvent = changetype<CollateralInfoUpdated>(
    newMockEvent()
  )

  collateralInfoUpdatedEvent.parameters = new Array()

  collateralInfoUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "collateral",
      ethereum.Value.fromAddress(collateral)
    )
  )
  collateralInfoUpdatedEvent.parameters.push(
    new ethereum.EventParam("data", ethereum.Value.fromTuple(data))
  )

  return collateralInfoUpdatedEvent
}

export function createCollateralRemovedEvent(
  collateral: Address
): CollateralRemoved {
  let collateralRemovedEvent = changetype<CollateralRemoved>(newMockEvent())

  collateralRemovedEvent.parameters = new Array()

  collateralRemovedEvent.parameters.push(
    new ethereum.EventParam(
      "collateral",
      ethereum.Value.fromAddress(collateral)
    )
  )

  return collateralRemovedEvent
}

export function createCollateralStrategyAddedEvent(
  collateral: Address,
  strategy: Address
): CollateralStrategyAdded {
  let collateralStrategyAddedEvent = changetype<CollateralStrategyAdded>(
    newMockEvent()
  )

  collateralStrategyAddedEvent.parameters = new Array()

  collateralStrategyAddedEvent.parameters.push(
    new ethereum.EventParam(
      "collateral",
      ethereum.Value.fromAddress(collateral)
    )
  )
  collateralStrategyAddedEvent.parameters.push(
    new ethereum.EventParam("strategy", ethereum.Value.fromAddress(strategy))
  )

  return collateralStrategyAddedEvent
}

export function createCollateralStrategyRemovedEvent(
  collateral: Address,
  strategy: Address
): CollateralStrategyRemoved {
  let collateralStrategyRemovedEvent = changetype<CollateralStrategyRemoved>(
    newMockEvent()
  )

  collateralStrategyRemovedEvent.parameters = new Array()

  collateralStrategyRemovedEvent.parameters.push(
    new ethereum.EventParam(
      "collateral",
      ethereum.Value.fromAddress(collateral)
    )
  )
  collateralStrategyRemovedEvent.parameters.push(
    new ethereum.EventParam("strategy", ethereum.Value.fromAddress(strategy))
  )

  return collateralStrategyRemovedEvent
}

export function createCollateralStrategyUpdatedEvent(
  collateral: Address,
  strategy: Address
): CollateralStrategyUpdated {
  let collateralStrategyUpdatedEvent = changetype<CollateralStrategyUpdated>(
    newMockEvent()
  )

  collateralStrategyUpdatedEvent.parameters = new Array()

  collateralStrategyUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "collateral",
      ethereum.Value.fromAddress(collateral)
    )
  )
  collateralStrategyUpdatedEvent.parameters.push(
    new ethereum.EventParam("strategy", ethereum.Value.fromAddress(strategy))
  )

  return collateralStrategyUpdatedEvent
}
