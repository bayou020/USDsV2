import {
  BigInt,
  ethereum,
  Address,
  BigDecimal,
  Bytes,
  DataSourceContext,
  store,
} from "@graphprotocol/graph-ts";
import {
  Approval as ApprovalEvent,
  EIP712DomainChanged as EIP712DomainChangedEvent,
  Initialized as InitializedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Paused as PausedEvent,
  TotalSupplyUpdated as TotalSupplyUpdatedEvent,
  Transfer as TransferEvent,
  VaultUpdated as VaultUpdatedEvent,
  USDsV2 as USDsV2Contract,
} from "../generated/USDsV2/USDsV2";
import { _ERC20 } from "../generated/CollateralManager/_ERC20";
import { MasterpriceOracle } from "../generated/MasterpriceOracle/MasterpriceOracle";
import { Strategy } from "../generated/templates/Strategy/Strategy";
import {
  Approval,
  // EIP712DomainChange,
  Initialize,
  Pause,
  TotalSupplyUpdate,
  Transfer,
  totalSupplyUsd,
  TransactionData,
  Token,
  usdsStrategy,
  TotalCollateral,
  Collateral,
  DailyCollateral,
} from "../generated/schema";
import { timestampConvertDate } from "../src/utils/utils";
import { digitsConvert } from "../src/utils/utils";
import { Strategy as StrategyContract } from "../generated/templates/Strategy/Strategy";

export function handleTotalSupply(block: ethereum.Block): void {
  let vaultAddress = Address.fromString(
    "0x6Bbc476Ee35CBA9e9c3A59fc5b10d7a0BC6f74Ca"
  );
  let oracle = MasterpriceOracle.bind(
    Address.fromString("0x14D99412dAB1878dC01Fe7a1664cdE85896e8E50")
  );
  let collateralsArray = new Array<Bytes>();
  let vaultAmountArray = new Array<BigDecimal>();
  let vaultValueArray = new Array<BigDecimal>();
  let totalInStrategiesValue = BigDecimal.fromString("0");
  let totalInStrategiesAmt = BigDecimal.fromString("0");
  let totalInVaultAmt = BigDecimal.fromString("0");
  let price = BigDecimal.fromString("0");
  let totalCollateral = TotalCollateral.load(Bytes.fromI32(1));
  if (!totalCollateral) {
    totalCollateral = new TotalCollateral(Bytes.fromI32(1));
    totalCollateral.collaterals = new Array<Bytes>();
    totalCollateral.vaultAmounts = new Array<BigDecimal>();
    totalCollateral.vaultValues = new Array<BigDecimal>();
  }

  let entity = new totalSupplyUsd(timestampConvertDate(block.timestamp));
  let transaction = new TransactionData(block.number.toHexString());
  let usdsAddress = Address.fromString(
    "0xD74f5255D557944cf7Dd0E45FF521520002D5748"
  );
  let USDsV2 = USDsV2Contract.bind(usdsAddress);
  entity.totalInVault = BigDecimal.fromString("0");
  entity.totalInStrategies = BigDecimal.fromString("0");
  let totalSupply = USDsV2.totalSupply();
  entity.totalSupplyAmt = digitsConvert(totalSupply);
  let usdsPrice = oracle
    .getPrice(usdsAddress)
    .price.toBigDecimal()
    .div(BigDecimal.fromString("100000000"));
  entity.totalSupply = digitsConvert(totalSupply).times(usdsPrice);
  entity.nonRebasingSupply = digitsConvert(USDsV2.nonRebasingSupply());
  entity.rebasingSupply = digitsConvert(totalSupply).minus(
    digitsConvert(USDsV2.nonRebasingSupply())
  );

  entity.transactionData = transaction.id;
  collateralsArray = totalCollateral.collaterals;

  for (let i = 0; i < collateralsArray.length; i++) {
    let strategyBalanceArray = new Array<BigDecimal>();
    let strategyValueArray = new Array<BigDecimal>();

    // Load Vault balances

    let tkn = Collateral.load(collateralsArray[i]);
    if (!tkn) {
      tkn = new Collateral(collateralsArray[i]);
    }
    let collateralDay = DailyCollateral.load(
      collateralsArray[i]
        .toHexString()
        .concat("-")
        .concat(timestampConvertDate(block.timestamp))
    );
    if (!collateralDay) {
      collateralDay = new DailyCollateral(
        collateralsArray[i]
          .toHexString()
          .concat("-")
          .concat(timestampConvertDate(block.timestamp))
      );
      collateralDay.collateral = Bytes.empty();
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
      collateralDay.blockTimestamp = BigInt.fromI32(0);
    }
    collateralDay.collateral = collateralsArray[i];
    collateralDay.symbol = tkn.symbol;
    collateralDay.name = tkn.name;
    collateralDay.decimals = tkn.decimals;
    collateralDay.strategiesAddresses = tkn.strategiesAddresses;
    collateralDay.strategiesNames = tkn.strategiesNames;

    let collateral = _ERC20.bind(Address.fromBytes(collateralsArray[i]));
    let vaultAmount = collateral
      .balanceOf(vaultAddress)
      .toBigDecimal()
      .div(
        BigInt.fromI32(10)
          .pow(collateral.decimals().toU32() as u8)
          .toBigDecimal()
      );
    vaultAmountArray.push(vaultAmount);
    let priceCall = oracle.try_getPrice(Address.fromBytes(collateralsArray[i]));

    if (priceCall.reverted) {
      price = BigDecimal.fromString("1");
    } else {
      price = priceCall.value.price
        .toBigDecimal()
        .div(BigDecimal.fromString("100000000"));
    }
    tkn.price = price;
    collateralDay.price = price;
    let vaultValue = vaultAmount.times(price);
    vaultValueArray.push(vaultValue);
    entity.totalInVault = entity.totalInVault.plus(vaultValue);
    tkn.vaultAmount = vaultAmount;
    collateralDay.vaultAmount = tkn.vaultAmount;
    tkn.vaultValue = vaultValue;
    collateralDay.vaultValue = tkn.vaultValue;
    // Load Strategy balances
    tkn.totalStrategyValue = BigDecimal.fromString("0");
    for (let j = 0; j < tkn.strategiesAddresses.length; j++) {
      let strategy = StrategyContract.bind(
        Address.fromBytes(tkn.strategiesAddresses[j])
      );

      let strategyBalance = strategy
        .checkBalance(Address.fromBytes(collateralsArray[i]))
        .toBigDecimal()
        .div(
          BigInt.fromI32(10)
            .pow(tkn.decimals.toU32() as u8)
            .toBigDecimal()
        );
      strategyBalanceArray.push(strategyBalance);
      tkn.strategiesAmounts = strategyBalanceArray;
      collateralDay.strategiesAmounts = tkn.strategiesAmounts;
      tkn.totalStrategyValue = tkn.totalStrategyValue
        .plus(strategyBalance)
        .times(price);
      collateralDay.totalStrategyValue = tkn.totalStrategyValue;
      strategyValueArray.push(strategyBalance.times(price));
      tkn.strategiesValues = strategyValueArray;
      collateralDay.strategiesValues = tkn.strategiesValues;

      totalInStrategiesAmt = totalInStrategiesAmt.plus(strategyBalance);
    }
    totalInStrategiesValue = totalInStrategiesValue.plus(
      tkn.totalStrategyValue
    );
    totalInVaultAmt = totalInVaultAmt.plus(tkn.vaultAmount);

    tkn.totalValue = tkn.vaultValue.plus(tkn.totalStrategyValue);
    collateralDay.totalValue = tkn.totalValue;
    collateralDay.blockTimestamp = block.timestamp;
    tkn.save();

    if (collateralDay.blockTimestamp >= BigInt.fromI32(1705276800)) {
      collateralDay.save();
    }
  }
  entity.collateralsAmt = totalInVaultAmt.plus(totalInStrategiesAmt);
  entity.collateralStrategyAmt = totalInStrategiesAmt;
  entity.totalInStrategies = totalInStrategiesValue;
  totalCollateral.vaultAmounts = vaultAmountArray;
  totalCollateral.vaultValues = vaultValueArray;
  totalCollateral.blockNumber = block.number;
  transaction.blockNumber = block.number;
  transaction.blockTimestamp = block.timestamp;
  transaction.transactionHash = block.hash;
  entity.TVL = entity.totalInVault.plus(entity.totalInStrategies);
  entity.ratio = entity.collateralsAmt.div(entity.totalSupplyAmt);
  totalCollateral.save();
  transaction.save();
  entity.save();
}

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.owner = event.params.owner;
  entity.spender = event.params.spender;
  entity.value = digitsConvert(event.params.value);

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleEIP712DomainChanged(
  event: EIP712DomainChangedEvent
): void {
  // let entity = new EIP712DomainChange(
  //   event.transaction.hash.concatI32(event.logIndex.toI32())
  // )
  // entity.blockNumber = event.block.number
  // entity.blockTimestamp = event.block.timestamp
  // entity.transactionHash = event.transaction.hash
  // entity.save()
}

export function handleInitialized(event: InitializedEvent): void {
  let entity = new Initialize(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.version = event.params.version;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  // let entity = new OwnershipTransfer(
  //   event.transaction.hash.concatI32(event.logIndex.toI32())
  // )
  // entity.previousOwner = event.params.previousOwner
  // entity.newOwner = event.params.newOwner
  // entity.blockNumber = event.block.number
  // entity.blockTimestamp = event.block.timestamp
  // entity.transactionHash = event.transaction.hash
  // entity.save()
}

export function handlePaused(event: PausedEvent): void {
  let entity = new Pause(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.isPaused = event.params.isPaused;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleTotalSupplyUpdated(event: TotalSupplyUpdatedEvent): void {
  let entity = new TotalSupplyUpdate(
    event.transaction.hash
  );
  entity.totalSupply = event.params.totalSupply;
  entity.rebasingCredits = event.params.rebasingCredits;
  entity.rebasingCreditsPerToken = event.params.rebasingCreditsPerToken;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.from = event.params.from;
  entity.to = event.params.to;
  entity.value = digitsConvert(event.params.value);

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleVaultUpdated(event: VaultUpdatedEvent): void {
  // let entity = new VaultUpdate(
  //   event.transaction.hash.concatI32(event.logIndex.toI32())
  // )
  // entity.newVault = event.params.newVault
  // entity.blockNumber = event.block.number
  // entity.blockTimestamp = event.block.timestamp
  // entity.transactionHash = event.transaction.hash
  // entity.save()
}
