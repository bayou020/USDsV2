import {
  BigInt,
  BigDecimal,
  Address,
  log,
  Bytes,
  store,
  bigInt,
} from "@graphprotocol/graph-ts";
import {
  CollateralAdded as CollateralAddedEvent,
  CollateralInfoUpdated as CollateralInfoUpdatedEvent,
  CollateralRemoved as CollateralRemovedEvent,
  CollateralStrategyAdded as CollateralStrategyAddedEvent,
  CollateralStrategyRemoved as CollateralStrategyRemovedEvent,
  CollateralStrategyUpdated as CollateralStrategyUpdatedEvent,
} from "../generated/CollateralManager/CollateralManager";
import { _ERC20 } from "../generated/CollateralManager/_ERC20";
import { Strategy as contractTemplate } from "../generated/templates";
import {
  AddCollateral,
  UpdateCollateral,
  RemoveCollateral,
  CollateralStrategyAdd,
  CollateralStrategyRemove,
  CollateralStrategyUpdate,
  Token,
  usdsStrategy,
  TotalCollateral,
  Collateral,
  CollateralStrategy,
  DailyCollateral,
} from "../generated/schema";
import { Strategy as StrategyContract } from "../generated/templates/Strategy/Strategy";
import {
  getTokenNames,
  getTokenDecimals,
  timestampConvertDate,
} from "../src/utils/utils";

export function handleCollateralAdded(event: CollateralAddedEvent): void {
  let collateralsArray = new Array<Bytes>();
  let totalCollateral = TotalCollateral.load(Bytes.fromI32(1));
  if (!totalCollateral) {
    totalCollateral = new TotalCollateral(Bytes.fromI32(1));
    totalCollateral.vaultAmounts = new Array<BigDecimal>();
    totalCollateral.vaultValues = new Array<BigDecimal>();
    totalCollateral.collaterals = new Array<Bytes>();
  }
  let entity = new AddCollateral(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  entity.collateral = event.params.collateral;
  entity.data_mintAllowed = event.params.data.mintAllowed;
  entity.data_redeemAllowed = event.params.data.redeemAllowed;
  entity.data_allocationAllowed = event.params.data.allocationAllowed;
  entity.data_downsidePeg = event.params.data.downsidePeg;
  entity.data_desiredCollateralComposition =
    event.params.data.desiredCollateralComposition;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let collateralToken = Collateral.load(event.params.collateral);
  if (!collateralToken) {
    collateralToken = new Collateral(event.params.collateral);
    collateralToken.symbol = "_";
    collateralToken.name = "_";
    collateralToken.decimals = BigInt.fromI32(0);
    collateralToken.vaultAmount = BigDecimal.fromString("0");
    collateralToken.vaultValue = BigDecimal.fromString("0");
    collateralToken.strategiesAddresses = new Array<Bytes>(0);
    collateralToken.strategiesNames = new Array<string>(0);
    collateralToken.strategiesAmounts = new Array<BigDecimal>(0);
    collateralToken.strategiesValues = new Array<BigDecimal>(0);
    collateralToken.totalStrategyValue = BigDecimal.fromString("0");
    collateralToken.interestCollectedValue = BigDecimal.fromString("0");
    collateralToken.interestDistributedValue = BigDecimal.fromString("0");
    collateralToken.interestValue = BigDecimal.fromString("0");
    collateralToken.totalValue = BigDecimal.fromString("0");
  }

  let collateralDay = DailyCollateral.load(
    event.params.collateral
      .toHexString()
      .concat("-")
      .concat(timestampConvertDate(event.block.timestamp))
  );
  if (!collateralDay) {
    collateralDay = new DailyCollateral(
      event.params.collateral
        .toHexString()
        .concat("-")
        .concat(timestampConvertDate(event.block.timestamp))
    );
    collateralDay.collateral=Bytes.empty();
    collateralDay.symbol = "_";
    collateralDay.name = "_";
    collateralDay.decimals = BigInt.fromI32(0);
    collateralDay.vaultAmount = BigDecimal.fromString("0");
    collateralDay.vaultValue = BigDecimal.fromString("0");
    collateralDay.strategiesAddresses = new Array<Bytes>(0);
    collateralDay.strategiesNames = new Array<string>(0);
    collateralDay.strategiesAmounts = new Array<BigDecimal>(0);
    collateralDay.strategiesValues = new Array<BigDecimal>(0);
    collateralDay.totalStrategyValue = BigDecimal.fromString("0");
    collateralDay.totalValue = BigDecimal.fromString("0");
    collateralDay.interestCollectedValue = BigDecimal.fromString("0");
    collateralDay.interestDistributedValue = BigDecimal.fromString("0");
    collateralDay.interestValue = BigDecimal.fromString("0");
    collateralDay.blockTimestamp = BigInt.fromI32(0);
  }

  let token = Token.load(event.params.collateral);
  if (!token) {
    token = new Token(event.params.collateral);
    token.isCollateral = true;
    token.srcAllowed = false;
    token.dstAllowed = false;
    token.isLpToken = false;
    token.strategies = Bytes.empty();
    token.vaultAmount = BigDecimal.fromString("0");
    token.vaultValue = BigDecimal.fromString("0");
  }
  let collateral = _ERC20.bind(Address.fromBytes(event.params.collateral));
  token.name = collateral.name();
  token.decimals = collateral.decimals();
  token.symbol = collateral.symbol();

  entity.token = token.id;
  collateralsArray = totalCollateral.collaterals;
  collateralsArray.push(event.params.collateral);
  totalCollateral.collaterals = collateralsArray;
  totalCollateral.blockNumber = event.block.number;
  token.save();
  collateralToken.name = collateral.name();
  collateralToken.decimals = collateral.decimals();
  collateralToken.symbol = collateral.symbol();
  collateralDay.collateral= event.params.collateral;
  collateralDay.name = collateral.name();
  collateralDay.decimals = collateral.decimals();
  collateralDay.symbol = collateral.symbol();
  collateralDay.blockTimestamp = event.block.timestamp;
  collateralDay.save();
  collateralToken.save();
  totalCollateral.save();
  entity.save();
}

export function handleCollateralInfoUpdated(
  event: CollateralInfoUpdatedEvent
): void {
  let entity = new UpdateCollateral(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.collateral = event.params.collateral;
  entity.data_mintAllowed = event.params.data.mintAllowed;
  entity.data_redeemAllowed = event.params.data.redeemAllowed;
  entity.data_allocationAllowed = event.params.data.allocationAllowed;
  entity.data_downsidePeg = event.params.data.downsidePeg;
  entity.data_desiredCollateralComposition =
    event.params.data.desiredCollateralComposition;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleCollateralRemoved(event: CollateralRemovedEvent): void {
  let entity = new RemoveCollateral(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.collateral = event.params.collateral;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let token = Token.load(event.params.collateral);
  if (!token) {
    token = new Token(event.params.collateral);
    token.isCollateral = true;
    token.srcAllowed = false;
    token.dstAllowed = false;
    token.isLpToken = false;
    token.strategies = Bytes.empty();
    token.vaultAmount = BigDecimal.fromString("0");
    token.vaultValue = BigDecimal.fromString("0");
  }
  let collateral = _ERC20.bind(Address.fromBytes(event.params.collateral));
  token.name = collateral.name();
  token.decimals = collateral.decimals();
  token.symbol = collateral.symbol();

  token.save();
  entity.save();
}

export function handleCollateralStrategyAdded(
  event: CollateralStrategyAddedEvent
): void {
  let strategiesArray = new Array<Bytes>();
  let tokenArray = new Array<Bytes>();
  let BalArray = new Array<BigDecimal>();
  let entity = new CollateralStrategyAdd(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  let token = Token.load(event.params.collateral);
  if (!token) {
    token = new Token(event.params.collateral);
    token.isCollateral = true;
    token.srcAllowed = false;
    token.dstAllowed = false;
    token.isLpToken = false;
    token.strategies = Bytes.empty();
    token.vaultAmount = BigDecimal.fromString("0");
    token.vaultValue = BigDecimal.fromString("0");
  }

  let collateralToken = Collateral.load(event.params.collateral);
  if (!collateralToken) {
    collateralToken = new Collateral(event.params.collateral);
  }
  let collateralDay = DailyCollateral.load(
    event.params.collateral
      .toHexString()
      .concat("-")
      .concat(timestampConvertDate(event.block.timestamp))
  );
  if (!collateralDay) {
    collateralDay = new DailyCollateral(
      event.params.collateral
        .toHexString()
        .concat("-")
        .concat(timestampConvertDate(event.block.timestamp))
        
    );
    collateralDay.collateral=Bytes.empty();
    collateralDay.symbol = "_";
    collateralDay.name = "_";
    collateralDay.decimals = BigInt.fromI32(0);
    collateralDay.vaultAmount = BigDecimal.fromString("0");
    collateralDay.vaultValue = BigDecimal.fromString("0");
    collateralDay.strategiesAddresses = new Array<Bytes>(0);
    collateralDay.strategiesNames = new Array<string>(0);
    collateralDay.strategiesAmounts = new Array<BigDecimal>(0);
    collateralDay.strategiesValues = new Array<BigDecimal>(0);
    collateralDay.totalStrategyValue = BigDecimal.fromString("0");
    collateralDay.totalValue = BigDecimal.fromString("0");
    collateralDay.interestCollectedValue = BigDecimal.fromString("0");
    collateralDay.interestDistributedValue = BigDecimal.fromString("0");
    collateralDay.interestValue = BigDecimal.fromString("0");
    collateralDay.blockTimestamp = BigInt.fromI32(0);
  }

  let strategiesAddressesArray = collateralToken.strategiesAddresses;
  let strategiesNamesArray = collateralToken.strategiesNames;
  strategiesAddressesArray.push(event.params.strategy);
  collateralToken.strategiesAddresses = strategiesAddressesArray;
  collateralDay.strategiesAddresses = collateralToken.strategiesAddresses;
  if (
    event.params.strategy ==
    Bytes.fromHexString("0x974993eE8DF7F5C4F3f9Aa4eB5b4534F359f3388")
  ) {
    strategiesNamesArray.push("AAVE");
  } else if (
    event.params.strategy ==
    Bytes.fromHexString("0xb9C9100720D8c6E35eb8dd0F9C1aBEf320dAA136")
  ) {
    strategiesNamesArray.push("STARGATE");
  } else if (
    event.params.strategy ==
    Bytes.fromHexString("0xBCeb48625771E35420076f79Ec6921E783a82442")
  ) {
    strategiesNamesArray.push("COMPOUND");
  }

  collateralToken.strategiesNames = strategiesNamesArray;
  collateralDay.strategiesNames = collateralToken.strategiesNames;
  collateralDay.collateral= event.params.collateral;

  let strategy = usdsStrategy.load(event.params.strategy);
  if (!strategy) {
    strategy = new usdsStrategy(event.params.strategy);
    strategy.Balances = new Array<BigDecimal>();
  }
  contractTemplate.create(event.params.strategy);

  entity.collateral = event.params.collateral;
  entity.strategy = event.params.strategy;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let collateral = _ERC20.bind(Address.fromBytes(event.params.collateral));
  token.name = collateral.name();
  token.decimals = collateral.decimals();
  token.symbol = collateral.symbol();
  strategiesArray.push(event.params.strategy);
  token.strategies = event.params.strategy;
  token.strategies = event.params.strategy;
  token.save();
  let contract = StrategyContract.bind(
    Address.fromBytes(event.params.strategy)
  );
  let collaterals = strategy.collaterals.load();

  for (let i = 0; i < collaterals.length; i++) {
    tokenArray.push(collaterals[i].id);
    BalArray.push(
      contract
        .checkBalance(Address.fromBytes(collaterals[i].id))
        .toBigDecimal()
        .div(
          BigInt.fromI32(10)
            .pow(collaterals[i].decimals.toU32() as u8)
            .toBigDecimal()
        )
    );
  }

  strategy.col = tokenArray;
  strategy.bal = BalArray;
  collateralToken.save();
  collateralDay.save();
  strategy.save();

  entity.save();
}

export function handleCollateralStrategyRemoved(
  event: CollateralStrategyRemovedEvent
): void {
  let entity = new CollateralStrategyRemove(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.collateral = event.params.collateral;
  entity.strategy = event.params.strategy;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let token = Token.load(event.params.collateral);
  if (!token) {
    token = new Token(event.params.collateral);
    token.isCollateral = true;
    token.srcAllowed = false;
    token.dstAllowed = false;
    token.isLpToken = false;
    token.vaultAmount = BigDecimal.fromString("0");
    token.vaultValue = BigDecimal.fromString("0");
  }
  let collateral = _ERC20.bind(Address.fromBytes(event.params.collateral));
  token.name = collateral.name();
  token.decimals = collateral.decimals();
  token.symbol = collateral.symbol();
  token.strategies = event.params.strategy;
  token.save();
  entity.save();
}

export function handleCollateralStrategyUpdated(
  event: CollateralStrategyUpdatedEvent
): void {
  let entity = new CollateralStrategyUpdate(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.collateral = event.params.collateral;
  entity.strategy = event.params.strategy;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
