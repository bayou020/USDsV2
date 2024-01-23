import {
  BigInt,
  BigDecimal,
  Address,
  log,
  Bytes,
  store,
} from "@graphprotocol/graph-ts";
import {
  BoughtBack as BoughtBackEvent,
  RewardPercentageUpdated as RewardPercentageUpdatedEvent,
  SPABurned as SPABurnedEvent,
  SPARewarded as SPARewardedEvent,
  VeSpaRewarderUpdated as VeSpaRewarderUpdatedEvent,
  Withdrawn as WithdrawnEvent,
} from "../generated/SPABuyback/SPABuyback";
import {
  BoughtBack,
  RewardPercentageUpdate,
  SPABurn,
  SPAReward,
  TotalBuyback,
  DayBuyback,
  SPADayBurn,
  TotalSPAReward,
  TransactionData,

  // VeSpaRewarderUpdate,
  Withdraw,
} from "../generated/schema";
import { _ERC20 as erc20 } from "../generated/CollateralManager/_ERC20";
import { MasterpriceOracle } from "../generated/MasterpriceOracle/MasterpriceOracle";
import {
  digitsConvert,
  collateralConvert,
  timestampConvertDate,
  erc20BalanceCheck,
} from "../src/utils/utils";

export function handleBoughtBack(event: BoughtBackEvent): void {
  let oracle = MasterpriceOracle.bind(
    Address.fromString("0x14D99412dAB1878dC01Fe7a1664cdE85896e8E50")
  );
  let transaction = new TransactionData(event.transaction.hash.toHexString());
  let entity = new BoughtBack(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  let all = TotalBuyback.load("buyback total amounts");

  if (!all) {
    all = new TotalBuyback("buyback total amounts");

    // Entity fields can be set using simple assignments
    all.count = BigInt.fromI32(0);
    all.spaAmount = BigDecimal.fromString("0");
    all.usdsAmount = BigDecimal.fromString("0");
    all.spaValue = BigDecimal.fromString("0");
    all.usdsValue = BigDecimal.fromString("0");
    all.usdsLeft = BigDecimal.fromString("0");
    all.spaLeft = BigDecimal.fromString("0");
  }
  let day = DayBuyback.load(timestampConvertDate(event.block.timestamp));

  if (!day) {
    day = new DayBuyback(timestampConvertDate(event.block.timestamp));

    // Entity fields can be set using simple assignments
    day.count = BigInt.fromI32(0);
    day.spaAmount = BigDecimal.fromString("0");
    day.usdsAmount = BigDecimal.fromString("0");
    day.spaValue = BigDecimal.fromString("0");
    day.usdsValue = BigDecimal.fromString("0");
    day.usdsLeft = BigDecimal.fromString("0");
    day.spaLeft = BigDecimal.fromString("0");
    day.spaPrice = BigDecimal.fromString("0");
  }
  let usdsAddress = Address.fromString(
    "0xD74f5255D557944cf7Dd0E45FF521520002D5748"
  );
  let spaAddress = Address.fromString(
    "0x5575552988A3A80504bBaeB1311674fCFd40aD4B"
  );
  let USDs = erc20.bind(usdsAddress);
  let SPA = erc20.bind(spaAddress);
  let buybackAddress = event.address;
  entity.usdsLeft = erc20BalanceCheck(USDs, buybackAddress);
  entity.spaLeft = erc20BalanceCheck(SPA, buybackAddress);
  entity.receiverOfUSDs = event.params.receiverOfUSDs;
  entity.senderOfSPA = event.params.senderOfSPA;
  entity.spaPrice = collateralConvert(event.params.spaPrice).div(
    BigDecimal.fromString("100")
  );
  entity.spaAmount = digitsConvert(event.params.spaAmount);
  entity.usdsAmount = digitsConvert(event.params.usdsAmount);
  entity.spaValue = entity.spaAmount.times(entity.spaPrice);
  entity.usdsValue = digitsConvert(event.params.usdsAmount);
  entity.spaBurned = digitsConvert(event.params.spaAmount);
  entity.spaRewarded = digitsConvert(event.params.usdsAmount);

  transaction.blockNumber = event.block.number;
  transaction.blockTimestamp = event.block.timestamp;
  transaction.transactionHash = event.transaction.hash;
  entity.transactionData = transaction.id;
  all.count = all.count.plus(BigInt.fromI32(1));
  all.spaAmount = all.spaAmount.plus(digitsConvert(event.params.spaAmount));

  all.usdsAmount = all.usdsAmount.plus(digitsConvert(event.params.usdsAmount));
  all.usdsValue = all.usdsAmount.times(
    oracle
      .getPrice(usdsAddress)
      .price.toBigDecimal()
      .div(oracle.getPrice(usdsAddress).precision.toBigDecimal())
  );
  all.spaValue = all.spaValue.plus(entity.spaValue);
  all.usdsLeft = entity.usdsLeft;
  all.spaLeft = entity.spaLeft;
  all.spaPrice = entity.spaPrice;
  all.transactionData = transaction.id;

  day.count = day.count.plus(BigInt.fromI32(1));
  day.spaAmount = day.spaAmount.plus(digitsConvert(event.params.spaAmount));

  day.usdsAmount = day.usdsAmount.plus(digitsConvert(event.params.usdsAmount));
  day.usdsValue = day.usdsAmount.times(
    oracle
      .getPrice(usdsAddress)
      .price.toBigDecimal()
      .div(oracle.getPrice(usdsAddress).precision.toBigDecimal())
  );
  day.spaValue = day.spaValue.plus(entity.spaValue);
  day.usdsLeft = entity.usdsLeft;
  day.spaLeft = entity.spaLeft;
  day.spaPrice = entity.spaPrice;
  day.transactionData = transaction.id;
  day.save();
  all.save();
  transaction.save();
  entity.save();
}

export function handleRewardPercentageUpdated(
  event: RewardPercentageUpdatedEvent
): void {
  let entity = new RewardPercentageUpdate(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.newRewardPercentage = event.params.newRewardPercentage;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleSPABurned(event: SPABurnedEvent): void {
  let entity = new SPABurn(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  let day =  SPADayBurn.load(timestampConvertDate(event.block.timestamp));
  if (!day) {
    day = new SPADayBurn(timestampConvertDate(event.block.timestamp));
    day.spaAmount = BigDecimal.fromString("0");
    day.count = BigInt.fromI32(0);
    
  }
  entity.spaAmount = digitsConvert(event.params.spaAmount);

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  day.count = day.count.plus(BigInt.fromI32(1));
  day.spaAmount = day.spaAmount.plus(digitsConvert(event.params.spaAmount));
  day.blockNumber = event.block.number;
  day.blockTimestamp = event.block.timestamp;
  day.transactionHash = event.transaction.hash;

  day.save();
  entity.save();
}

export function handleSPARewarded(event: SPARewardedEvent): void {
  let entity = new SPAReward(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  let all = TotalSPAReward.load(Bytes.empty());
  if (!all) {

    all = new TotalSPAReward(Bytes.empty());
    all.count = BigInt.fromI32(0);
    all.spaAmount = BigDecimal.fromString("0");
    all.spaValue = BigDecimal.fromString("0");
  }

  all.count= all.count.plus(BigInt.fromI32(1)); 
  all.spaAmount = all.spaAmount.plus(digitsConvert(event.params.spaAmount));

  entity.spaAmount = digitsConvert(event.params.spaAmount);

  
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

    all.save()
    entity.save();
}

export function handleVeSpaRewarderUpdated(
  event: VeSpaRewarderUpdatedEvent
): void {
  // let entity = new VeSpaRewarderUpdate(
  //   event.transaction.hash.concatI32(event.logIndex.toI32())
  // )
  // entity.newVeSpaRewarder = event.params.newVeSpaRewarder
  // entity.blockNumber = event.block.number
  // entity.blockTimestamp = event.block.timestamp
  // entity.transactionHash = event.transaction.hash
  // entity.save()
}

export function handleWithdrawn(event: WithdrawnEvent): void {
  let entity = new Withdraw(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.token = event.params.token;
  entity.receiver = event.params.receiver;
  entity.amount = event.params.amount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
