import {
  BigInt,
  BigDecimal,
  Bytes,
  TypedMap,
  TypedMapEntry,
  Address,
  log,
  ethereum
} from "@graphprotocol/graph-ts";
import { _ERC20 } from "../../generated/CollateralManager/_ERC20";
import { Strategy } from "../../generated/templates/Strategy/Strategy";

export function erc20BalanceCheck(token: _ERC20, address: Bytes): BigDecimal {
  let balance = token.try_balanceOf(Address.fromBytes(address));
  if (balance.reverted) {
    log.info("balance Revert", []);
    return BigDecimal.fromString("0");
  } else {
    return balance.value
      .toBigDecimal()
      .div(BigDecimal.fromString("1000000000000000000"));
  }
  
}
//Convert timestamp to Date
export function timestampConvertDateTime(time: BigInt): string {
  let date = new Date(1000 * time.toI32());
  let dateConverted = date
    .toDateString()
    .concat("_")
    .concat(date.toTimeString());

  return dateConverted;
}
export function timestampConvertDate(time: BigInt): string {
  let date = new Date(1000 * time.toI32());
  let dateConverted = date.toDateString();

  return dateConverted;
}
export function timestampConvertWeek(time: BigInt): string {
  let date = new Date(1000 * time.toI32());
  let year = date.getUTCFullYear();
  let timestampYear = (year - 1970) * 86400 * 365 + 13 * 86400;

  return year
    .toString()
    .concat("_")
    .concat(
      Math.ceil(((time.toI32() - timestampYear) / 86400 + 1) / 7).toString()
    );
}
export function digitsConvert(value: BigInt): BigDecimal {
  let converted = value
    .toBigDecimal()
    .div(BigDecimal.fromString("1000000000000000000"));

  return converted;
}
export function collateralConvert(value: BigInt): BigDecimal {
  let converted = value.toBigDecimal().div(BigDecimal.fromString("1000000"));

  return converted;
}

export function getTokenNames(erc: _ERC20): string {
  let contract = erc.try_symbol();
  if (contract.reverted) {
    log.warning("Token Name Reverted", []);
    return "No-Token";
  } else {
    return contract.value;
  }
}
export function getTokenDecimals(erc: _ERC20): string {
  let contract = erc.try_decimals();
  if (contract.reverted) {
    log.warning("Token Decimals Reverted", []);
    return "No-Decimals";
  } else {
    return contract.value.toString();
  }
}
// export function getAmountPrecision(erc: _ERC20,value:BigInt): BigDecimal {
//   let contract = erc.try_decimals();
//   if (contract.reverted) {
//     log.warning("Token Decimals Reverted", []);
//     return BigDecimal.fromString('0');
//   } else {
//     return value.div(BigInt.fromI32(10).pow(contract.value as u8)).toBigDecimal()  ;
//   }
// }
export function actionTypeConverter(actionType: u32): string {
  let actionTypeConverted: string = "";
  switch (actionType) {
    case 0:
      actionTypeConverted = "Deposit For";
      break;
    case 1:
      actionTypeConverted = "Create Lock";
      break;
    case 2:
      actionTypeConverted = "Increase Amount";
      break;
    case 3:
      actionTypeConverted = "Increase Lock Time";
      break;
    case 4:
      actionTypeConverted = "Initiate Cooldown";
      break;
  }

  return actionTypeConverted;
}

export function strategyCheckBalance(
  contract: Strategy,
  address: string
): BigDecimal {
  // let strategy = contract.bind(
  //   Address.fromString("0x61Dec207Bb0dEEdcD7A56d7b76B2692580692Fd5")
  // );
  let strategyBalance = contract.try_checkBalance(Address.fromString(address));
  if (strategyBalance.reverted) {
    log.info("Strategy Balance Revert", []);
    return BigDecimal.fromString("0");
  } else {
    return digitsConvert(strategyBalance.value);
  }
}
// let mapped = new TypedMap<string, BigDecimal>();

// export function getHolders(address:string,balance:BigDecimal):BigDecimal{
//   let mappedEntry = new TypedMapEntry<string, BigDecimal>(address,balance);

//   mapped.entries.push(mappedEntry)

//  let size= BigInt.fromI32(mapped.entries.length).toBigDecimal()
//   return size
// }
