import {
  APRUpdated as APRUpdatedEvent,
  DripperUpdated as DripperUpdatedEvent,
  GapUpdated as GapUpdatedEvent
} from "../generated/RebaseManager/RebaseManager"
import { APRUpdate, GapUpdate } from "../generated/schema"

export function handleAPRUpdated(event: APRUpdatedEvent): void {
  let entity = new APRUpdate(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.aprBottom = event.params.aprBottom
  entity.aprCap = event.params.aprCap

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDripperUpdated(event: DripperUpdatedEvent): void {
  // let entity = new DripperUpdate(
  //   event.transaction.hash.concatI32(event.logIndex.toI32())
  // )
  // entity.dripper = event.params.dripper

  // entity.blockNumber = event.block.number
  // entity.blockTimestamp = event.block.timestamp
  // entity.transactionHash = event.transaction.hash

  // entity.save()
}

export function handleGapUpdated(event: GapUpdatedEvent): void {
  let entity = new GapUpdate(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.gap = event.params.gap

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
