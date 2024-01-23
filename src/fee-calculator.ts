import { FeeCalibrated as FeeCalibratedEvent } from "../generated/FeeCalculator/FeeCalculator"
import { FeeCalibrate } from "../generated/schema"

export function handleFeeCalibrated(event: FeeCalibratedEvent): void {
  let entity = new FeeCalibrate(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.collateral = event.params.collateral
  entity.mintFee = event.params.mintFee
  entity.redeemFee = event.params.redeemFee

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
