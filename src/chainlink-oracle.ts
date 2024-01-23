import { TokenDataChanged as TokenDataChangedEvent } from "../generated/ChainlinkOracle/ChainlinkOracle"
import { TokenDataChange } from "../generated/schema"

export function handleTokenDataChanged(event: TokenDataChangedEvent): void {
  let entity = new TokenDataChange(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.tokenAddr = event.params.tokenAddr
  entity.priceFeed = event.params.priceFeed
  entity.pricePrecision = event.params.pricePrecision

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
