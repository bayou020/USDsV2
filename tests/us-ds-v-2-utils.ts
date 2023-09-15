import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  Approval,
  EIP712DomainChanged,
  Initialized,
  OwnershipTransferred,
  Paused,
  TotalSupplyUpdated,
  Transfer,
  VaultUpdated
} from "../generated/USDsV2/USDsV2"

export function createApprovalEvent(
  owner: Address,
  spender: Address,
  value: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("spender", ethereum.Value.fromAddress(spender))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return approvalEvent
}

export function createEIP712DomainChangedEvent(): EIP712DomainChanged {
  let eip712DomainChangedEvent = changetype<EIP712DomainChanged>(newMockEvent())

  eip712DomainChangedEvent.parameters = new Array()

  return eip712DomainChangedEvent
}

export function createInitializedEvent(version: i32): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(version))
    )
  )

  return initializedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPausedEvent(isPaused: boolean): Paused {
  let pausedEvent = changetype<Paused>(newMockEvent())

  pausedEvent.parameters = new Array()

  pausedEvent.parameters.push(
    new ethereum.EventParam("isPaused", ethereum.Value.fromBoolean(isPaused))
  )

  return pausedEvent
}

export function createTotalSupplyUpdatedEvent(
  totalSupply: BigInt,
  rebasingCredits: BigInt,
  rebasingCreditsPerToken: BigInt
): TotalSupplyUpdated {
  let totalSupplyUpdatedEvent = changetype<TotalSupplyUpdated>(newMockEvent())

  totalSupplyUpdatedEvent.parameters = new Array()

  totalSupplyUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "totalSupply",
      ethereum.Value.fromUnsignedBigInt(totalSupply)
    )
  )
  totalSupplyUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "rebasingCredits",
      ethereum.Value.fromUnsignedBigInt(rebasingCredits)
    )
  )
  totalSupplyUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "rebasingCreditsPerToken",
      ethereum.Value.fromUnsignedBigInt(rebasingCreditsPerToken)
    )
  )

  return totalSupplyUpdatedEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  value: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return transferEvent
}

export function createVaultUpdatedEvent(newVault: Address): VaultUpdated {
  let vaultUpdatedEvent = changetype<VaultUpdated>(newMockEvent())

  vaultUpdatedEvent.parameters = new Array()

  vaultUpdatedEvent.parameters.push(
    new ethereum.EventParam("newVault", ethereum.Value.fromAddress(newVault))
  )

  return vaultUpdatedEvent
}
