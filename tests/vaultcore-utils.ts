import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  Allocated,
  CollateralManagerUpdated,
  FeeCalculatorUpdated,
  FeeVaultUpdated,
  Minted,
  OracleUpdated,
  RebaseManagerUpdated,
  RebasedUSDs,
  Redeemed,
  YieldReceiverUpdated
} from "../generated/Vaultcore/Vaultcore"

export function createAllocatedEvent(
  collateral: Address,
  strategy: Address,
  amount: BigInt
): Allocated {
  let allocatedEvent = changetype<Allocated>(newMockEvent())

  allocatedEvent.parameters = new Array()

  allocatedEvent.parameters.push(
    new ethereum.EventParam(
      "collateral",
      ethereum.Value.fromAddress(collateral)
    )
  )
  allocatedEvent.parameters.push(
    new ethereum.EventParam("strategy", ethereum.Value.fromAddress(strategy))
  )
  allocatedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return allocatedEvent
}

export function createCollateralManagerUpdatedEvent(
  newCollateralManager: Address
): CollateralManagerUpdated {
  let collateralManagerUpdatedEvent = changetype<CollateralManagerUpdated>(
    newMockEvent()
  )

  collateralManagerUpdatedEvent.parameters = new Array()

  collateralManagerUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newCollateralManager",
      ethereum.Value.fromAddress(newCollateralManager)
    )
  )

  return collateralManagerUpdatedEvent
}

export function createFeeCalculatorUpdatedEvent(
  newFeeCalculator: Address
): FeeCalculatorUpdated {
  let feeCalculatorUpdatedEvent = changetype<FeeCalculatorUpdated>(
    newMockEvent()
  )

  feeCalculatorUpdatedEvent.parameters = new Array()

  feeCalculatorUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newFeeCalculator",
      ethereum.Value.fromAddress(newFeeCalculator)
    )
  )

  return feeCalculatorUpdatedEvent
}

export function createFeeVaultUpdatedEvent(
  newFeeVault: Address
): FeeVaultUpdated {
  let feeVaultUpdatedEvent = changetype<FeeVaultUpdated>(newMockEvent())

  feeVaultUpdatedEvent.parameters = new Array()

  feeVaultUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newFeeVault",
      ethereum.Value.fromAddress(newFeeVault)
    )
  )

  return feeVaultUpdatedEvent
}

export function createMintedEvent(
  wallet: Address,
  collateralAddr: Address,
  usdsAmt: BigInt,
  collateralAmt: BigInt,
  feeAmt: BigInt
): Minted {
  let mintedEvent = changetype<Minted>(newMockEvent())

  mintedEvent.parameters = new Array()

  mintedEvent.parameters.push(
    new ethereum.EventParam("wallet", ethereum.Value.fromAddress(wallet))
  )
  mintedEvent.parameters.push(
    new ethereum.EventParam(
      "collateralAddr",
      ethereum.Value.fromAddress(collateralAddr)
    )
  )
  mintedEvent.parameters.push(
    new ethereum.EventParam(
      "usdsAmt",
      ethereum.Value.fromUnsignedBigInt(usdsAmt)
    )
  )
  mintedEvent.parameters.push(
    new ethereum.EventParam(
      "collateralAmt",
      ethereum.Value.fromUnsignedBigInt(collateralAmt)
    )
  )
  mintedEvent.parameters.push(
    new ethereum.EventParam("feeAmt", ethereum.Value.fromUnsignedBigInt(feeAmt))
  )

  return mintedEvent
}

export function createOracleUpdatedEvent(newOracle: Address): OracleUpdated {
  let oracleUpdatedEvent = changetype<OracleUpdated>(newMockEvent())

  oracleUpdatedEvent.parameters = new Array()

  oracleUpdatedEvent.parameters.push(
    new ethereum.EventParam("newOracle", ethereum.Value.fromAddress(newOracle))
  )

  return oracleUpdatedEvent
}

export function createRebaseManagerUpdatedEvent(
  newRebaseManager: Address
): RebaseManagerUpdated {
  let rebaseManagerUpdatedEvent = changetype<RebaseManagerUpdated>(
    newMockEvent()
  )

  rebaseManagerUpdatedEvent.parameters = new Array()

  rebaseManagerUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newRebaseManager",
      ethereum.Value.fromAddress(newRebaseManager)
    )
  )

  return rebaseManagerUpdatedEvent
}

export function createRebasedUSDsEvent(rebaseAmt: BigInt): RebasedUSDs {
  let rebasedUsDsEvent = changetype<RebasedUSDs>(newMockEvent())

  rebasedUsDsEvent.parameters = new Array()

  rebasedUsDsEvent.parameters.push(
    new ethereum.EventParam(
      "rebaseAmt",
      ethereum.Value.fromUnsignedBigInt(rebaseAmt)
    )
  )

  return rebasedUsDsEvent
}

export function createRedeemedEvent(
  wallet: Address,
  collateralAddr: Address,
  usdsAmt: BigInt,
  collateralAmt: BigInt,
  feeAmt: BigInt
): Redeemed {
  let redeemedEvent = changetype<Redeemed>(newMockEvent())

  redeemedEvent.parameters = new Array()

  redeemedEvent.parameters.push(
    new ethereum.EventParam("wallet", ethereum.Value.fromAddress(wallet))
  )
  redeemedEvent.parameters.push(
    new ethereum.EventParam(
      "collateralAddr",
      ethereum.Value.fromAddress(collateralAddr)
    )
  )
  redeemedEvent.parameters.push(
    new ethereum.EventParam(
      "usdsAmt",
      ethereum.Value.fromUnsignedBigInt(usdsAmt)
    )
  )
  redeemedEvent.parameters.push(
    new ethereum.EventParam(
      "collateralAmt",
      ethereum.Value.fromUnsignedBigInt(collateralAmt)
    )
  )
  redeemedEvent.parameters.push(
    new ethereum.EventParam("feeAmt", ethereum.Value.fromUnsignedBigInt(feeAmt))
  )

  return redeemedEvent
}

export function createYieldReceiverUpdatedEvent(
  newYieldReceiver: Address
): YieldReceiverUpdated {
  let yieldReceiverUpdatedEvent = changetype<YieldReceiverUpdated>(
    newMockEvent()
  )

  yieldReceiverUpdatedEvent.parameters = new Array()

  yieldReceiverUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newYieldReceiver",
      ethereum.Value.fromAddress(newYieldReceiver)
    )
  )

  return yieldReceiverUpdatedEvent
}
