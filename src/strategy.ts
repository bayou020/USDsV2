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
import { getUsdPricePerToken, getUsdPrice } from "../src/prices";
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
  rewardToken,
  DailyRewardToken,
  totalRevenue,
  DaytotalRevenue,
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
    total.totalDistributed = BigDecimal.fromString("0");
    total.totalRevenue = BigDecimal.fromString("0");
  }
  let day = DaytotalRevenue.load(timestampConvertDate(event.block.timestamp));
  if (!day) {
    day = new DaytotalRevenue(timestampConvertDate(event.block.timestamp));
    day.totalInterest = BigDecimal.fromString("0");
    day.totalReward = BigDecimal.fromString("0");
    day.totalDistributed = BigDecimal.fromString("0");
    day.totalRevenue = BigDecimal.fromString("0");
  }
  let entity = new HarvestIncentiveCollect(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  let rwd = rewardToken.load(event.params.token);
  if (!rwd) {
    rwd = new rewardToken(event.params.token);
    rwd.symbol = "_";
    rwd.name = "_";
    rwd.strategy = Bytes.empty();
    rwd.decimals = BigInt.fromI32(0);
    rwd.actualPrice = BigDecimal.fromString("0");
    rwd.DistributedAmount = BigDecimal.fromString("0");
    rwd.interestCollectedAmount = BigDecimal.fromString("0");
    rwd.interestAmount = BigDecimal.fromString("0");
    rwd.rewardCollectedAmount = BigDecimal.fromString("0");
    rwd.rewardAmount = BigDecimal.fromString("0");
    rwd.amount = BigDecimal.fromString("0");
    rwd.value = BigDecimal.fromString("0");
  }
  let rwdDay = DailyRewardToken.load(
    event.params.token
      .toHexString()
      .concat("-")
      .concat(timestampConvertDate(event.block.timestamp))
  );
  if (!rwdDay) {
    rwdDay = new DailyRewardToken(
      event.params.token
        .toHexString()
        .concat("-")
        .concat(timestampConvertDate(event.block.timestamp))
    );
    rwdDay.symbol = "_";
    rwdDay.name = "_";
    rwdDay.strategy = Bytes.empty();
    rwdDay.decimals = BigInt.fromI32(0);
    rwdDay.actualPrice = BigDecimal.fromString("0");
    rwdDay.interestCollectedAmount = BigDecimal.fromString("0");
    rwdDay.interestAmount = BigDecimal.fromString("0");
    rwdDay.DistributedAmount = BigDecimal.fromString("0");
    rwdDay.rewardCollectedAmount = BigDecimal.fromString("0");
    rwdDay.rewardAmount = BigDecimal.fromString("0");
    rwdDay.amount = BigDecimal.fromString("0");
    rwdDay.value = BigDecimal.fromString("0");
    rwdDay.blockTimestamp = BigInt.fromI32(0);
  }
  let token = _ERC20.bind(event.params.token);

  rwd.strategy = event.address;
  rwdDay.strategy = rwd.strategy;
  rwd.symbol = token.symbol();
  rwdDay.symbol = rwd.symbol;
  rwd.name = token.name();
  rwdDay.name = rwd.name;
  rwd.decimals = token.decimals();
  rwdDay.decimals = rwd.decimals;
  rwd.actualPrice = getUsdPricePerToken(event.params.token).usdPrice;
  rwdDay.actualPrice = rwd.actualPrice;
  rwd.DistributedAmount = rwd.DistributedAmount.plus(
    event.params.amount.toBigDecimal().div(
      BigInt.fromI32(10)
        .pow(token.decimals().toU32() as u8)
        .toBigDecimal()
    )
  );
  rwdDay.DistributedAmount = rwdDay.DistributedAmount.plus(
    event.params.amount.toBigDecimal().div(
      BigInt.fromI32(10)
        .pow(token.decimals().toU32() as u8)
        .toBigDecimal()
    )
  );
  rwd.amount = rwd.amount.plus(rwd.DistributedAmount);
  rwdDay.amount = rwdDay.amount.plus(rwdDay.DistributedAmount);
  rwd.value = rwd.value.plus(
    event.params.amount
      .toBigDecimal()
      .div(
        BigInt.fromI32(10)
          .pow(token.decimals().toU32() as u8)
          .toBigDecimal()
      )
      .times(rwd.actualPrice)
  );
  rwdDay.value = rwdDay.value.plus(
    event.params.amount
      .toBigDecimal()
      .div(
        BigInt.fromI32(10)
          .pow(token.decimals().toU32() as u8)
          .toBigDecimal()
      )
      .times(rwd.actualPrice)
  );

  // let tokenCall=oracle
  // .try_getPrice(event.params.token)
  // .value.price.toBigDecimal()
  // let tokenPrice = tokenCall
  //   .div(BigDecimal.fromString("100000000"));
  let tokenPrice = getUsdPricePerToken(event.params.token).usdPrice;
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

  total.totalDistributed = total.totalDistributed.plus(
    event.params.amount
      .toBigDecimal()
      .div(
        BigInt.fromI32(10)
          .pow(token.decimals().toU32() as u8)
          .toBigDecimal()
      )
      .times(tokenPrice)
  );
  day.totalDistributed = day.totalDistributed.plus(
    event.params.amount
      .toBigDecimal()
      .div(
        BigInt.fromI32(10)
          .pow(token.decimals().toU32() as u8)
          .toBigDecimal()
      )
      .times(tokenPrice)
  );
  rwdDay.blockTimestamp = event.block.timestamp;
  total.totalRevenue = total.totalInterest.plus(total.totalDistributed);
  day.totalRevenue = day.totalInterest.plus(day.totalDistributed);
  day.blockTimestamp = event.block.timestamp;
  if (rwdDay.blockTimestamp >= BigInt.fromI32(1705276800)) {
    rwdDay.save();
  }
  day.save();
  total.save();
  rwd.save();
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
  entity.name = StrategyContract.bind(event.address)._name;
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
    total.totalDistributed = BigDecimal.fromString("0");
    total.totalReward = BigDecimal.fromString("0");
  }
  let day = DaytotalRevenue.load(timestampConvertDate(event.block.timestamp));
  if (!day) {
    day = new DaytotalRevenue(timestampConvertDate(event.block.timestamp));
    day.totalInterest = BigDecimal.fromString("0");
    day.totalReward = BigDecimal.fromString("0");
    day.totalDistributed = BigDecimal.fromString("0");
    day.totalRevenue = BigDecimal.fromString("0");
  }
  let entity = new InterestCollect(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  let oracle = MasterpriceOracle.bind(
    Address.fromString("0x14D99412dAB1878dC01Fe7a1664cdE85896e8E50")
  );
  let col = Collateral.load(event.params.asset);
  if (!col) {
    col = new Collateral(event.params.asset);
    col.symbol = "_";
    col.name = "_";
    col.decimals = BigInt.fromI32(0);
    col.price = BigDecimal.fromString("0");
    col.vaultAmount = BigDecimal.fromString("0");
    col.vaultValue = BigDecimal.fromString("0");
    col.strategiesAddresses = new Array<Bytes>(0);
    col.strategiesNames = new Array<string>(0);
    col.strategiesAmounts = new Array<BigDecimal>(0);
    col.strategiesValues = new Array<BigDecimal>(0);
    col.totalStrategyValue = BigDecimal.fromString("0");
    col.interestCollectedValue = BigDecimal.fromString("0");
    col.totalValue = BigDecimal.fromString("0");
  }
  let colDay = DailyCollateral.load(
    event.params.asset
      .toHexString()
      .concat("-")
      .concat(timestampConvertDate(event.block.timestamp))
  );
  if (!colDay) {
    colDay = new DailyCollateral(
      event.params.asset
        .toHexString()
        .concat("-")
        .concat(timestampConvertDate(event.block.timestamp))
    );
    colDay.collateral = Bytes.empty();
    colDay.symbol = "_";
    colDay.name = "_";
    colDay.decimals = BigInt.fromI32(0);
    colDay.price = BigDecimal.fromString("0");
    colDay.vaultAmount = BigDecimal.fromString("0");
    colDay.vaultValue = BigDecimal.fromString("0");
    colDay.strategiesAddresses = new Array<Bytes>(0);
    colDay.strategiesNames = new Array<string>(0);
    colDay.strategiesAmounts = new Array<BigDecimal>(0);
    colDay.strategiesValues = new Array<BigDecimal>(0);
    colDay.totalStrategyValue = BigDecimal.fromString("0");
    colDay.totalValue = BigDecimal.fromString("0");
    colDay.interestCollectedValue = BigDecimal.fromString("0");
    colDay.blockTimestamp = BigInt.fromI32(0);
  }

  let token = _ERC20.bind(event.params.asset);
  let tokenCall = oracle
    .try_getPrice(event.params.asset)
    .value.price.toBigDecimal();
  let tokenPrice = tokenCall.div(BigDecimal.fromString("100000000"));
  // let tokenPrice = BigDecimal.fromString("1");
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
  col.interestCollectedValue = col.interestCollectedValue.plus(
    entity.amount.times(tokenPrice)
  );
  total.totalInterest = total.totalInterest.plus(col.interestCollectedValue);
  day.totalInterest = day.totalInterest.plus(col.interestCollectedValue);
  colDay.interestCollectedValue = colDay.interestCollectedValue.plus(
    entity.amount.times(tokenPrice)
  );
  colDay.collateral = event.params.asset;
  let collateral = _ERC20.bind(Address.fromBytes(event.params.asset));
  colDay.name = collateral.name();
  colDay.decimals = collateral.decimals();
  colDay.symbol = collateral.symbol();

  colDay.blockTimestamp = event.block.timestamp;
  total.totalRevenue = total.totalInterest.plus(total.totalReward);
  day.totalRevenue = day.totalInterest.plus(day.totalReward);
  day.blockTimestamp = event.block.timestamp;

  colDay.save();
  day.save();
  col.save();
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
