import {
  PriceFeedRemoved as PriceFeedRemovedEvent,
  PriceFeedUpdated as PriceFeedUpdatedEvent
} from "../generated/MasterpriceOracle/MasterpriceOracle"
import { PriceFeedRemove, PriceFeedUpdate } from "../generated/schema"

export function handlePriceFeedRemoved(event: PriceFeedRemovedEvent): void {
  let entity = new PriceFeedRemove(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePriceFeedUpdated(event: PriceFeedUpdatedEvent): void {
  let entity = new PriceFeedUpdate(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token
  entity.source = event.params.source
  entity.msgData = event.params.msgData

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
