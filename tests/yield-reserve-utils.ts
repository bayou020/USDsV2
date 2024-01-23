import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  BuybackAddressUpdated,
  BuybackPercentageUpdated,
  DripperAddressUpdated,
  DstTokenPermissionUpdated,
  SrcTokenPermissionUpdated,
  Swapped,
  USDsMintedViaSwapper,
  USDsSent,
  VaultAddressUpdated
} from "../generated/YieldReserve/YieldReserve"

export function createBuybackAddressUpdatedEvent(
  newBuyback: Address
): BuybackAddressUpdated {
  let buybackAddressUpdatedEvent = changetype<BuybackAddressUpdated>(
    newMockEvent()
  )

  buybackAddressUpdatedEvent.parameters = new Array()

  buybackAddressUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newBuyback",
      ethereum.Value.fromAddress(newBuyback)
    )
  )

  return buybackAddressUpdatedEvent
}

export function createBuybackPercentageUpdatedEvent(
  toBuyback: BigInt
): BuybackPercentageUpdated {
  let buybackPercentageUpdatedEvent = changetype<BuybackPercentageUpdated>(
    newMockEvent()
  )

  buybackPercentageUpdatedEvent.parameters = new Array()

  buybackPercentageUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "toBuyback",
      ethereum.Value.fromUnsignedBigInt(toBuyback)
    )
  )

  return buybackPercentageUpdatedEvent
}

export function createDripperAddressUpdatedEvent(
  newDripper: Address
): DripperAddressUpdated {
  let dripperAddressUpdatedEvent = changetype<DripperAddressUpdated>(
    newMockEvent()
  )

  dripperAddressUpdatedEvent.parameters = new Array()

  dripperAddressUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newDripper",
      ethereum.Value.fromAddress(newDripper)
    )
  )

  return dripperAddressUpdatedEvent
}

export function createDstTokenPermissionUpdatedEvent(
  token: Address,
  isAllowed: boolean
): DstTokenPermissionUpdated {
  let dstTokenPermissionUpdatedEvent = changetype<DstTokenPermissionUpdated>(
    newMockEvent()
  )

  dstTokenPermissionUpdatedEvent.parameters = new Array()

  dstTokenPermissionUpdatedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  dstTokenPermissionUpdatedEvent.parameters.push(
    new ethereum.EventParam("isAllowed", ethereum.Value.fromBoolean(isAllowed))
  )

  return dstTokenPermissionUpdatedEvent
}

export function createSrcTokenPermissionUpdatedEvent(
  token: Address,
  isAllowed: boolean
): SrcTokenPermissionUpdated {
  let srcTokenPermissionUpdatedEvent = changetype<SrcTokenPermissionUpdated>(
    newMockEvent()
  )

  srcTokenPermissionUpdatedEvent.parameters = new Array()

  srcTokenPermissionUpdatedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  srcTokenPermissionUpdatedEvent.parameters.push(
    new ethereum.EventParam("isAllowed", ethereum.Value.fromBoolean(isAllowed))
  )

  return srcTokenPermissionUpdatedEvent
}

export function createSwappedEvent(
  srcToken: Address,
  dstToken: Address,
  dstReceiver: Address,
  amountIn: BigInt,
  amountOut: BigInt
): Swapped {
  let swappedEvent = changetype<Swapped>(newMockEvent())

  swappedEvent.parameters = new Array()

  swappedEvent.parameters.push(
    new ethereum.EventParam("srcToken", ethereum.Value.fromAddress(srcToken))
  )
  swappedEvent.parameters.push(
    new ethereum.EventParam("dstToken", ethereum.Value.fromAddress(dstToken))
  )
  swappedEvent.parameters.push(
    new ethereum.EventParam(
      "dstReceiver",
      ethereum.Value.fromAddress(dstReceiver)
    )
  )
  swappedEvent.parameters.push(
    new ethereum.EventParam(
      "amountIn",
      ethereum.Value.fromUnsignedBigInt(amountIn)
    )
  )
  swappedEvent.parameters.push(
    new ethereum.EventParam(
      "amountOut",
      ethereum.Value.fromUnsignedBigInt(amountOut)
    )
  )

  return swappedEvent
}

export function createUSDsMintedViaSwapperEvent(
  collateralAddr: Address,
  usdsMinted: BigInt
): USDsMintedViaSwapper {
  let usDsMintedViaSwapperEvent = changetype<USDsMintedViaSwapper>(
    newMockEvent()
  )

  usDsMintedViaSwapperEvent.parameters = new Array()

  usDsMintedViaSwapperEvent.parameters.push(
    new ethereum.EventParam(
      "collateralAddr",
      ethereum.Value.fromAddress(collateralAddr)
    )
  )
  usDsMintedViaSwapperEvent.parameters.push(
    new ethereum.EventParam(
      "usdsMinted",
      ethereum.Value.fromUnsignedBigInt(usdsMinted)
    )
  )

  return usDsMintedViaSwapperEvent
}

export function createUSDsSentEvent(
  toBuyback: BigInt,
  toVault: BigInt
): USDsSent {
  let usDsSentEvent = changetype<USDsSent>(newMockEvent())

  usDsSentEvent.parameters = new Array()

  usDsSentEvent.parameters.push(
    new ethereum.EventParam(
      "toBuyback",
      ethereum.Value.fromUnsignedBigInt(toBuyback)
    )
  )
  usDsSentEvent.parameters.push(
    new ethereum.EventParam(
      "toVault",
      ethereum.Value.fromUnsignedBigInt(toVault)
    )
  )

  return usDsSentEvent
}

export function createVaultAddressUpdatedEvent(
  newVault: Address
): VaultAddressUpdated {
  let vaultAddressUpdatedEvent = changetype<VaultAddressUpdated>(newMockEvent())

  vaultAddressUpdatedEvent.parameters = new Array()

  vaultAddressUpdatedEvent.parameters.push(
    new ethereum.EventParam("newVault", ethereum.Value.fromAddress(newVault))
  )

  return vaultAddressUpdatedEvent
}
