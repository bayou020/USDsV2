import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  APRUpdated,
  DripperUpdated,
  GapUpdated
} from "../generated/RebaseManager/RebaseManager"

export function createAPRUpdatedEvent(
  aprBottom: BigInt,
  aprCap: BigInt
): APRUpdated {
  let aprUpdatedEvent = changetype<APRUpdated>(newMockEvent())

  aprUpdatedEvent.parameters = new Array()

  aprUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "aprBottom",
      ethereum.Value.fromUnsignedBigInt(aprBottom)
    )
  )
  aprUpdatedEvent.parameters.push(
    new ethereum.EventParam("aprCap", ethereum.Value.fromUnsignedBigInt(aprCap))
  )

  return aprUpdatedEvent
}

export function createDripperUpdatedEvent(dripper: Address): DripperUpdated {
  let dripperUpdatedEvent = changetype<DripperUpdated>(newMockEvent())

  dripperUpdatedEvent.parameters = new Array()

  dripperUpdatedEvent.parameters.push(
    new ethereum.EventParam("dripper", ethereum.Value.fromAddress(dripper))
  )

  return dripperUpdatedEvent
}

export function createGapUpdatedEvent(gap: BigInt): GapUpdated {
  let gapUpdatedEvent = changetype<GapUpdated>(newMockEvent())

  gapUpdatedEvent.parameters = new Array()

  gapUpdatedEvent.parameters.push(
    new ethereum.EventParam("gap", ethereum.Value.fromUnsignedBigInt(gap))
  )

  return gapUpdatedEvent
}
