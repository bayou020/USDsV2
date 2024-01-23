import { BigDecimal, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  Allocated as AllocatedEvent,
  CollateralManagerUpdated as CollateralManagerUpdatedEvent,
  FeeCalculatorUpdated as FeeCalculatorUpdatedEvent,
  FeeVaultUpdated as FeeVaultUpdatedEvent,
  Minted as MintedEvent,
  OracleUpdated as OracleUpdatedEvent,
  RebaseManagerUpdated as RebaseManagerUpdatedEvent,
  RebasedUSDs as RebasedUSDsEvent,
  Redeemed as RedeemedEvent,
  YieldReceiverUpdated as YieldReceiverUpdatedEvent,
} from "../generated/Vaultcore/Vaultcore";
import {
  Allocate,
  Mint,
  USDsRebase,
  Redeem,
  mintRedeemFee,
  User,
} from "../generated/schema";
import { digitsConvert } from "../src/utils/utils";
export function handleAllocated(event: AllocatedEvent): void {
  let entity = new Allocate(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.collateral = event.params.collateral;
  entity.strategy = event.params.strategy;
  entity.amount = event.params.amount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleCollateralManagerUpdated(
  event: CollateralManagerUpdatedEvent
): void {
  // let entity = new CollateralManagerUpdate(
  //   event.transaction.hash.concatI32(event.logIndex.toI32())
  // )
  // entity.newCollateralManager = event.params.newCollateralManager
  // entity.blockNumber = event.block.number
  // entity.blockTimestamp = event.block.timestamp
  // entity.transactionHash = event.transaction.hash
  // entity.save()
}

export function handleFeeCalculatorUpdated(
  event: FeeCalculatorUpdatedEvent
): void {
  // let entity = new FeeCalculatorUpdate(
  //   event.transaction.hash.concatI32(event.logIndex.toI32())
  // )
  // entity.newFeeCalculator = event.params.newFeeCalculator
  // entity.blockNumber = event.block.number
  // entity.blockTimestamp = event.block.timestamp
  // entity.transactionHash = event.transaction.hash
  // entity.save()
}

export function handleFeeVaultUpdated(event: FeeVaultUpdatedEvent): void {
  // let entity = new FeeVaultUpdate(
  //   event.transaction.hash.concatI32(event.logIndex.toI32())
  // )
  // entity.newFeeVault = event.params.newFeeVault
  // entity.blockNumber = event.block.number
  // entity.blockTimestamp = event.block.timestamp
  // entity.transactionHash = event.transaction.hash
  // entity.save()
}

export function handleMinted(event: MintedEvent): void {
  let user = User.load(event.params.wallet);
  if (!user) {
    user = new User(event.params.wallet);
    user.mintCount = BigInt.fromI32(0);
    user.redeemCount = BigInt.fromI32(0);
    user.holder= false
  }
  let entity = new Mint(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  let mintRedeemFees = mintRedeemFee.load(Bytes.fromHexString("0x01") as Bytes);
  if (!mintRedeemFees) {
    mintRedeemFees = new mintRedeemFee(Bytes.fromHexString("0x01") as Bytes);
    mintRedeemFees.mintFees = BigDecimal.fromString("0");
    mintRedeemFees.redeemFees = BigDecimal.fromString("0");
  }
  entity.wallet = event.params.wallet;
  entity.collateralAddr = event.params.collateralAddr;
  entity.usdsAmt = digitsConvert(event.params.usdsAmt);
  entity.collateralAmt = digitsConvert(event.params.collateralAmt);
  entity.feeAmt = digitsConvert(event.params.feeAmt);
  mintRedeemFees.mintFees = mintRedeemFees.mintFees.plus(
    digitsConvert(event.params.feeAmt)
  );
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  user.mintCount = user.mintCount.plus(BigInt.fromI32(1));
  if(user.mintCount.minus(user.redeemCount).gt(BigInt.fromI32(0))){
    user.holder = true
  }
  else {
    user.holder = false
  }
  mintRedeemFees.save();
  entity.save();
  user.save()
}

export function handleOracleUpdated(event: OracleUpdatedEvent): void {
  // let entity = new OracleUpdate(
  //   event.transaction.hash.concatI32(event.logIndex.toI32())
  // )
  // entity.newOracle = event.params.newOracle
  // entity.blockNumber = event.block.number
  // entity.blockTimestamp = event.block.timestamp
  // entity.transactionHash = event.transaction.hash
  // entity.save()
}

export function handleRebaseManagerUpdated(
  event: RebaseManagerUpdatedEvent
): void {
  // let entity = new RebaseManagerUpdate(
  //   event.transaction.hash.concatI32(event.logIndex.toI32())
  // )
  // entity.newRebaseManager = event.params.newRebaseManager
  // entity.blockNumber = event.block.number
  // entity.blockTimestamp = event.block.timestamp
  // entity.transactionHash = event.transaction.hash
  // entity.save()
}

export function handleRebasedUSDs(event: RebasedUSDsEvent): void {
  let entity = new USDsRebase(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.rebaseAmt = digitsConvert(event.params.rebaseAmt);

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleRedeemed(event: RedeemedEvent): void {
  let user = User.load(event.params.wallet);
  if (!user) {
    user = new User(event.params.wallet);
    user.mintCount = BigInt.fromI32(0);
    user.redeemCount = BigInt.fromI32(0);
    user.holder= false
  }
  let entity = new Redeem(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  let mintRedeemFees = mintRedeemFee.load(Bytes.fromHexString("0x01") as Bytes);
  if (!mintRedeemFees) {
    mintRedeemFees = new mintRedeemFee(Bytes.fromHexString("0x01") as Bytes);
    mintRedeemFees.mintFees = BigDecimal.fromString("0");
    mintRedeemFees.redeemFees = BigDecimal.fromString("0");
  }
  entity.wallet = event.params.wallet;
  entity.collateralAddr = event.params.collateralAddr;
  entity.usdsAmt = digitsConvert(event.params.usdsAmt);
  entity.collateralAmt = digitsConvert(event.params.collateralAmt);
  entity.feeAmt = digitsConvert(event.params.feeAmt);

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  mintRedeemFees.redeemFees = mintRedeemFees.redeemFees.plus(
    digitsConvert(event.params.feeAmt)
  );
  user.redeemCount = user.redeemCount.plus(BigInt.fromI32(1));
  if(user.mintCount.minus(user.redeemCount).gt(BigInt.fromI32(0))){
    user.holder = true
  }
  else {
    user.holder = false
  }
  user.save();
  mintRedeemFees.save();
  entity.save();
}

export function handleYieldReceiverUpdated(
  event: YieldReceiverUpdatedEvent
): void {
  // let entity = new YieldReceiverUpdate(
  //   event.transaction.hash.concatI32(event.logIndex.toI32())
  // )
  // entity.newYieldReceiver = event.params.newYieldReceiver
  // entity.blockNumber = event.block.number
  // entity.blockTimestamp = event.block.timestamp
  // entity.transactionHash = event.transaction.hash
  // entity.save()
}
