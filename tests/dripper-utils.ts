import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  Collected,
  DripDurationUpdated,
  Recovered
} from "../generated/Dripper/Dripper"

export function createCollectedEvent(amount: BigInt): Collected {
  let collectedEvent = changetype<Collected>(newMockEvent())

  collectedEvent.parameters = new Array()

  collectedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return collectedEvent
}

export function createDripDurationUpdatedEvent(
  dripDuration: BigInt
): DripDurationUpdated {
  let dripDurationUpdatedEvent = changetype<DripDurationUpdated>(newMockEvent())

  dripDurationUpdatedEvent.parameters = new Array()

  dripDurationUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "dripDuration",
      ethereum.Value.fromUnsignedBigInt(dripDuration)
    )
  )

  return dripDurationUpdatedEvent
}

export function createRecoveredEvent(
  owner: Address,
  amount: BigInt
): Recovered {
  let recoveredEvent = changetype<Recovered>(newMockEvent())

  recoveredEvent.parameters = new Array()

  recoveredEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  recoveredEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return recoveredEvent
}
