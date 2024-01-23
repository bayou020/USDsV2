import { Address, Bytes,BigDecimal } from "@graphprotocol/graph-ts";
import {
  BuybackAddressUpdated as BuybackAddressUpdatedEvent,
  BuybackPercentageUpdated as BuybackPercentageUpdatedEvent,
  DripperAddressUpdated as DripperAddressUpdatedEvent,
  DstTokenPermissionUpdated as DstTokenPermissionUpdatedEvent,
  SrcTokenPermissionUpdated as SrcTokenPermissionUpdatedEvent,
  Swapped as SwappedEvent,
  USDsMintedViaSwapper as USDsMintedViaSwapperEvent,
  USDsSent as USDsSentEvent,
  VaultAddressUpdated as VaultAddressUpdatedEvent,
} from "../generated/YieldReserve/YieldReserve";
import {
  BuybackPercentageUpdate,
  DstTokenPermissionUpdate,
  SrcTokenPermissionUpdate,
  Swap,
  USDsMintedViaSwapper,
  USDsSent,
  TransactionData,
  Token,
} from "../generated/schema";
import { _ERC20 } from "../generated/CollateralManager/_ERC20";
export function handleBuybackAddressUpdated(
  event: BuybackAddressUpdatedEvent
): void {
  // let entity = new BuybackAddressUpdate(
  //   event.transaction.hash.concatI32(event.logIndex.toI32())
  // );
  // entity.newBuyback = event.params.newBuyback;
  // entity.blockNumber = event.block.number;
  // entity.blockTimestamp = event.block.timestamp;
  // entity.transactionHash = event.transaction.hash;
  // entity.save();
}

export function handleBuybackPercentageUpdated(
  event: BuybackPercentageUpdatedEvent
): void {
  let entity = new BuybackPercentageUpdate(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.toBuyback = event.params.toBuyback;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleDripperAddressUpdated(
  event: DripperAddressUpdatedEvent
): void {
  //   let entity = new DripperAddressUpdate(
  //     event.transaction.hash.concatI32(event.logIndex.toI32())
  //   );
  //   entity.newDripper = event.params.newDripper;
  //   entity.blockNumber = event.block.number;
  //   entity.blockTimestamp = event.block.timestamp;
  //   entity.transactionHash = event.transaction.hash;
  //   entity.save();
}

export function handleDstTokenPermissionUpdated(
  event: DstTokenPermissionUpdatedEvent
): void {
  let entity = new DstTokenPermissionUpdate(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  let token = Token.load(event.params.token);
  if (!token) {
    token = new Token(event.params.token);
    token.isCollateral = false;
    token.srcAllowed = false;
    token.dstAllowed = false;
    token.isLpToken = false;
    token.strategies = Bytes.empty();
    token.vaultAmount = BigDecimal.fromString("0");
    token.vaultValue = BigDecimal.fromString("0");
  }
  let tokens = _ERC20.bind(Address.fromBytes(event.params.token));
  token.name = tokens.name();
  token.decimals = tokens.decimals();
  token.symbol = tokens.symbol();
  entity.token = event.params.token;
  entity.isAllowed = event.params.isAllowed;
  token.dstAllowed = event.params.isAllowed;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  token.save();
  entity.save();
}

export function handleSrcTokenPermissionUpdated(
  event: SrcTokenPermissionUpdatedEvent
): void {
  let entity = new SrcTokenPermissionUpdate(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  let token = Token.load(event.params.token);
  if (!token) {
    token = new Token(event.params.token);
    token.isCollateral = false;
    token.srcAllowed = false;
    token.dstAllowed = false;
    token.isLpToken = false;
    token.strategies = Bytes.empty();
    token.vaultAmount = BigDecimal.fromString("0");
    token.vaultValue = BigDecimal.fromString("0");
  }
  let tokens = _ERC20.bind(Address.fromBytes(event.params.token));
  token.name = tokens.name();
  token.decimals = tokens.decimals();
  token.symbol = tokens.symbol();
  entity.token = event.params.token;
  token.srcAllowed = event.params.isAllowed;
  entity.isAllowed = event.params.isAllowed;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  token.save();
  entity.save();
}

export function handleSwapped(event: SwappedEvent): void {
  let transaction = new TransactionData(event.transaction.hash.toHexString());
  let entity = new Swap(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.srcToken = event.params.srcToken;
  entity.dstToken = event.params.dstToken;
  entity.dstReceiver = event.params.dstReceiver;
  entity.amountIn = event.params.amountIn;
  entity.amountOut = event.params.amountOut;

  transaction.blockNumber = event.block.number;
  transaction.blockTimestamp = event.block.timestamp;
  transaction.transactionHash = event.transaction.hash;
  entity.transactionData = transaction.id;
  transaction.save();

  entity.save();
}

export function handleUSDsMintedViaSwapper(
  event: USDsMintedViaSwapperEvent
): void {
  let entity = new USDsMintedViaSwapper(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.collateralAddr = event.params.collateralAddr;
  entity.usdsMinted = event.params.usdsMinted;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleUSDsSent(event: USDsSentEvent): void {
  let entity = new USDsSent(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.toBuyback = event.params.toBuyback;
  entity.toVault = event.params.toVault;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleVaultAddressUpdated(
  event: VaultAddressUpdatedEvent
): void {
  // let entity = new VaultAddressUpdate(
  //   event.transaction.hash.concatI32(event.logIndex.toI32())
  // );
  // entity.newVault = event.params.newVault;
  // entity.blockNumber = event.block.number;
  // entity.blockTimestamp = event.block.timestamp;
  // entity.transactionHash = event.transaction.hash;
  // entity.save();
}
