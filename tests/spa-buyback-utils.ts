import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  BoughtBack,
  RewardPercentageUpdated,
  SPABurned,
  SPARewarded,
  VeSpaRewarderUpdated,
  Withdrawn
} from "../generated/SPABuyback/SPABuyback"

export function createBoughtBackEvent(
  receiverOfUSDs: Address,
  senderOfSPA: Address,
  spaPrice: BigInt,
  spaAmount: BigInt,
  usdsAmount: BigInt
): BoughtBack {
  let boughtBackEvent = changetype<BoughtBack>(newMockEvent())

  boughtBackEvent.parameters = new Array()

  boughtBackEvent.parameters.push(
    new ethereum.EventParam(
      "receiverOfUSDs",
      ethereum.Value.fromAddress(receiverOfUSDs)
    )
  )
  boughtBackEvent.parameters.push(
    new ethereum.EventParam(
      "senderOfSPA",
      ethereum.Value.fromAddress(senderOfSPA)
    )
  )
  boughtBackEvent.parameters.push(
    new ethereum.EventParam(
      "spaPrice",
      ethereum.Value.fromUnsignedBigInt(spaPrice)
    )
  )
  boughtBackEvent.parameters.push(
    new ethereum.EventParam(
      "spaAmount",
      ethereum.Value.fromUnsignedBigInt(spaAmount)
    )
  )
  boughtBackEvent.parameters.push(
    new ethereum.EventParam(
      "usdsAmount",
      ethereum.Value.fromUnsignedBigInt(usdsAmount)
    )
  )

  return boughtBackEvent
}

export function createRewardPercentageUpdatedEvent(
  newRewardPercentage: BigInt
): RewardPercentageUpdated {
  let rewardPercentageUpdatedEvent = changetype<RewardPercentageUpdated>(
    newMockEvent()
  )

  rewardPercentageUpdatedEvent.parameters = new Array()

  rewardPercentageUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newRewardPercentage",
      ethereum.Value.fromUnsignedBigInt(newRewardPercentage)
    )
  )

  return rewardPercentageUpdatedEvent
}

export function createSPABurnedEvent(spaAmount: BigInt): SPABurned {
  let spaBurnedEvent = changetype<SPABurned>(newMockEvent())

  spaBurnedEvent.parameters = new Array()

  spaBurnedEvent.parameters.push(
    new ethereum.EventParam(
      "spaAmount",
      ethereum.Value.fromUnsignedBigInt(spaAmount)
    )
  )

  return spaBurnedEvent
}

export function createSPARewardedEvent(spaAmount: BigInt): SPARewarded {
  let spaRewardedEvent = changetype<SPARewarded>(newMockEvent())

  spaRewardedEvent.parameters = new Array()

  spaRewardedEvent.parameters.push(
    new ethereum.EventParam(
      "spaAmount",
      ethereum.Value.fromUnsignedBigInt(spaAmount)
    )
  )

  return spaRewardedEvent
}

export function createVeSpaRewarderUpdatedEvent(
  newVeSpaRewarder: Address
): VeSpaRewarderUpdated {
  let veSpaRewarderUpdatedEvent = changetype<VeSpaRewarderUpdated>(
    newMockEvent()
  )

  veSpaRewarderUpdatedEvent.parameters = new Array()

  veSpaRewarderUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newVeSpaRewarder",
      ethereum.Value.fromAddress(newVeSpaRewarder)
    )
  )

  return veSpaRewarderUpdatedEvent
}

export function createWithdrawnEvent(
  token: Address,
  receiver: Address,
  amount: BigInt
): Withdrawn {
  let withdrawnEvent = changetype<Withdrawn>(newMockEvent())

  withdrawnEvent.parameters = new Array()

  withdrawnEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  withdrawnEvent.parameters.push(
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver))
  )
  withdrawnEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return withdrawnEvent
}
