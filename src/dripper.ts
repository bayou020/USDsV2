import {
  Collected as CollectedEvent,
  DripDurationUpdated as DripDurationUpdatedEvent,
  Recovered as RecoveredEvent
} from "../generated/Dripper/Dripper"
import { Collect, DripDurationUpdate, Recover } from "../generated/schema"

export function handleCollected(event: CollectedEvent): void {
  let entity = new Collect(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDripDurationUpdated(
  event: DripDurationUpdatedEvent
): void {
  let entity = new DripDurationUpdate(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.dripDuration = event.params.dripDuration

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRecovered(event: RecoveredEvent): void {
  let entity = new Recover(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
