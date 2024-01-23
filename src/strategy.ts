import {
  Address,
  BigDecimal,
  BigInt,
  Bytes,
  ethereum,
  dataSource,
} from "@graphprotocol/graph-ts";
import {
  Deposit as DepositEvent,
  HarvestIncentiveCollected as HarvestIncentiveCollectedEvent,
  HarvestIncentiveRateUpdated as HarvestIncentiveRateUpdatedEvent,
  Initialized as InitializedEvent,
  InterestCollected as InterestCollectedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  PTokenAdded as PTokenAddedEvent,
  PTokenRemoved as PTokenRemovedEvent,
  RewardTokenCollected as RewardTokenCollectedEvent,
  SlippageUpdated as SlippageUpdatedEvent,
  VaultUpdated as VaultUpdatedEvent,
  Withdrawal as WithdrawalEvent,
  YieldReceiverUpdated as YieldReceiverUpdatedEvent,
} from "../generated/templates/Strategy/Strategy";
import { _ERC20 } from "../generated/CollateralManager/_ERC20";
import { MasterpriceOracle } from "../generated/MasterpriceOracle/MasterpriceOracle";
import { Strategy as StrategyContract } from "../generated/templates/Strategy/Strategy";
import {
  Deposit,
  HarvestIncentiveCollect,
  HarvestIncentiveRateUpdate,
  StrategyInitialize,
  InterestCollect,
  OwnershipTransfer,
  AddPToken,
  RemovePToken,
  RewardTokenCollect,
  SlippageUpdate,
  VaultUpdate,
  Withdrawal,
  YieldReceiverUpdate,
  Token,
  usdsStrategy,
  Collateral,
  DailyCollateral,
  totalRevenue,
} from "../generated/schema";
import { Strategy } from "../generated/templates";
import { timestampConvertDate } from "../src/utils/utils";

export function handleDeposit(event: DepositEvent): void {
  let strategiesArray = new Array<Bytes>();
  let tokenArray = new Array<Bytes>();
  let BalArray = new Array<BigDecimal>();
  let entity = new Deposit(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.strategy = event.address;
  let token = Token.load(event.params.asset);
  if (!token) {
    token = new Token(event.params.asset);
    token.isCollateral = true;
    token.srcAllowed = false;
    token.dstAllowed = false;
    token.isLpToken = false;
    token.strategies = Bytes.empty();
    token.vaultAmount = BigDecimal.fromString("0");
    token.vaultValue = BigDecimal.fromString("0");
  }
  let strategy = usdsStrategy.load(event.address);
  if (!strategy) {
    strategy = new usdsStrategy(event.address);
    strategy.Balances = new Array<BigDecimal>();
  }
  let collateral = _ERC20.bind(Address.fromBytes(event.params.asset));
  token.name = collateral.name();
  token.decimals = collateral.decimals();
  token.symbol = collateral.symbol();
  token.strategies = event.address;
  token.save();
  entity.asset = token.id;
  entity.amount = event.params.amount.toBigDecimal().div(
    BigInt.fromI32(10)
      .pow(collateral.decimals().toU32() as u8)
      .toBigDecimal()
  );
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let contract = StrategyContract.bind(Address.fromBytes(event.address));
  let collaterals = strategy.collaterals.load();

  for (let i = 0; i < collaterals.length; i++) {
    let amount = contract
      .checkBalance(Address.fromBytes(collaterals[i].id))
      .toBigDecimal()
      .div(
        BigInt.fromI32(10)
          .pow(collaterals[i].decimals.toU32() as u8)
          .toBigDecimal()
      );
    tokenArray.push(collaterals[i].id);
    BalArray.push(amount);
  }
  strategy.bal = BalArray;
  strategy.save();

  entity.save();
}

export function handleHarvestIncentiveCollected(
  event: HarvestIncentiveCollectedEvent
): void {
  let total = totalRevenue.load(Bytes.fromHexString("0x01"));
  if (!total) {
    total = new totalRevenue(Bytes.fromHexString("0x01"));
    total.totalInterest = BigDecimal.fromString("0");
    total.totalReward = BigDecimal.fromString("0");
  }
  let oracle = MasterpriceOracle.bind(
    Address.fromString("0x14D99412dAB1878dC01Fe7a1664cdE85896e8E50")
  );
  let entity = new HarvestIncentiveCollect(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  let tkn = Collateral.load(event.params.token);
  if (!tkn) {
    tkn = new Collateral(event.params.token);
  }
  let collateralDay = DailyCollateral.load(
    event.params.token
      .toHexString()
      .concat("-")
      .concat(timestampConvertDate(event.block.timestamp))
  );
  if (!collateralDay) {
    collateralDay = new DailyCollateral(
      event.params.token
        .toHexString()
        .concat("-")
        .concat(timestampConvertDate(event.block.timestamp))
    );
  }
  let token = _ERC20.bind(event.params.token);
  let tokenPrice = oracle
    .getPrice(event.params.token)
    .price.toBigDecimal()
    .div(BigDecimal.fromString("100000000"));
  entity.strategy = event.address;
  entity.token = event.params.token;
  entity.harvestor = event.params.harvestor;
  entity.amount = event.params.amount.toBigDecimal().div(
    BigInt.fromI32(10)
      .pow(token.decimals().toU32() as u8)
      .toBigDecimal()
  );

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  tkn.interestDistributedValue = tkn.interestDistributedValue.plus(
    entity.amount.times(tokenPrice)
  );
  tkn.interestValue = tkn.interestValue.plus(tkn.interestDistributedValue);
  total.totalInterest = total.totalInterest.plus(tkn.interestDistributedValue);
  collateralDay.interestDistributedValue = collateralDay.interestDistributedValue.plus(
    entity.amount.times(tokenPrice)
  );
  collateralDay.interestValue = collateralDay.interestValue.plus(
    collateralDay.interestDistributedValue
  );
  collateralDay.blockTimestamp = event.block.timestamp;

  collateralDay.save();
  total.save();
  tkn.save();
  entity.save();
}

export function handleHarvestIncentiveRateUpdated(
  event: HarvestIncentiveRateUpdatedEvent
): void {
  let entity = new HarvestIncentiveRateUpdate(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.strategy = event.address;
  entity.newRate = event.params.newRate;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleInitialized(event: InitializedEvent): void {
  let entity = new StrategyInitialize(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.strategy = event.address;

  entity.version = event.params.version;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleInterestCollected(event: InterestCollectedEvent): void {
  let total = totalRevenue.load(Bytes.fromHexString("0x01"));
  if (!total) {
    total = new totalRevenue(Bytes.fromHexString("0x01"));
    total.totalInterest = BigDecimal.fromString("0");
    total.totalReward = BigDecimal.fromString("0");
  }
  let entity = new InterestCollect(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  let oracle = MasterpriceOracle.bind(
    Address.fromString("0x14D99412dAB1878dC01Fe7a1664cdE85896e8E50")
  );
  let tkn = Collateral.load(event.params.asset);
  if (!tkn) {
    tkn = new Collateral(event.params.asset);
  }
  let collateralDay = DailyCollateral.load(
    event.params.asset
      .toHexString()
      .concat("-")
      .concat(timestampConvertDate(event.block.timestamp))
  );
  if (!collateralDay) {
    collateralDay = new DailyCollateral(
      event.params.asset
        .toHexString()
        .concat("-")
        .concat(timestampConvertDate(event.block.timestamp))
    );
  }

  let token = _ERC20.bind(event.params.asset);
  let tokenPrice = oracle
    .getPrice(event.params.asset)
    .price.toBigDecimal()
    .div(BigDecimal.fromString("100000000"));
  entity.strategy = event.address;
  entity.asset = event.params.asset;
  entity.recipient = event.params.recipient;
  entity.amount = event.params.amount.toBigDecimal().div(
    BigInt.fromI32(10)
      .pow(token.decimals().toU32() as u8)
      .toBigDecimal()
  );

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  tkn.interestCollectedValue = tkn.interestCollectedValue.plus(
    entity.amount.times(tokenPrice)
  );
  tkn.interestValue = tkn.interestValue.plus(tkn.interestCollectedValue);
  total.totalInterest = total.totalInterest.plus(tkn.interestCollectedValue);

  collateralDay.interestCollectedValue = collateralDay.interestCollectedValue.plus(
    entity.amount.times(tokenPrice)
  );
  collateralDay.interestValue = collateralDay.interestValue.plus(
    collateralDay.interestCollectedValue
  );
  collateralDay.blockTimestamp = event.block.timestamp;

  collateralDay.save();
  tkn.save();
  total.save();
  entity.save();
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.strategy = event.address;
  entity.previousOwner = event.params.previousOwner;
  entity.newOwner = event.params.newOwner;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handlePTokenAdded(event: PTokenAddedEvent): void {
  let entity = new AddPToken(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  let token = Token.load(event.params.pToken);
  if (!token) {
    token = new Token(event.params.pToken);
    token.isCollateral = false;
    token.srcAllowed = false;
    token.dstAllowed = false;
    token.isLpToken = true;
    token.vaultAmount = BigDecimal.fromString("0");
    token.vaultValue = BigDecimal.fromString("0");
  }
  let pToken = _ERC20.bind(Address.fromBytes(event.params.pToken));
  token.name = pToken.name();
  token.decimals = pToken.decimals();
  token.symbol = pToken.symbol();
  token.strategies = event.address;
  token.save();

  entity.strategy = event.address;
  entity.asset = event.params.asset;
  entity.pToken = event.params.pToken;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handlePTokenRemoved(event: PTokenRemovedEvent): void {
  let entity = new RemovePToken(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.strategy = event.address;
  entity.asset = event.params.asset;
  entity.pToken = event.params.pToken;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleRewardTokenCollected(
  event: RewardTokenCollectedEvent
): void {
  let entity = new RewardTokenCollect(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.strategy = event.address;
  entity.rwdToken = event.params.rwdToken;
  entity.recipient = event.params.recipient;
  entity.amount = event.params.amount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleSlippageUpdated(event: SlippageUpdatedEvent): void {
  let entity = new SlippageUpdate(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.strategy = event.address;
  entity.depositSlippage = event.params.depositSlippage;
  entity.withdrawSlippage = event.params.withdrawSlippage;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleVaultUpdated(event: VaultUpdatedEvent): void {
  let entity = new VaultUpdate(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.strategy = event.address;
  entity.newVaultAddr = event.params.newVaultAddr;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleWithdrawal(event: WithdrawalEvent): void {
  let entity = new Withdrawal(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  let token = Token.load(event.params.asset);
  if (!token) {
    token = new Token(event.params.asset);
    token.isCollateral = true;
    token.srcAllowed = false;
    token.dstAllowed = false;
    token.isLpToken = false;
    token.strategies = Bytes.empty();
    token.vaultAmount = BigDecimal.fromString("0");
    token.vaultValue = BigDecimal.fromString("0");
  }
  let collateral = _ERC20.bind(Address.fromBytes(event.params.asset));
  token.name = collateral.name();
  token.decimals = collateral.decimals();
  token.symbol = collateral.symbol();
  token.strategies = event.address;
  token.save();
  entity.asset = token.id;
  entity.amount = event.params.amount;

  entity.strategy = event.address;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleYieldReceiverUpdated(
  event: YieldReceiverUpdatedEvent
): void {
  let entity = new YieldReceiverUpdate(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.newYieldReceiver = event.params.newYieldReceiver;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
