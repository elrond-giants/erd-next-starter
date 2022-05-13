import BigNumber from "bignumber.js";
import {egldPrice, getGasEconomics} from "../apis/economics";
import {Balance, TransactionPayload} from "@elrondnetwork/erdjs/out";

export const usdToCurrentEgld = async (usdAmount: number | BigNumber): Promise<number> => {
    const egldValue = await egldPrice();

    return usdToEgld(usdAmount, egldValue);

};

export const usdToEgld = (usdAmount: number | BigNumber, egldValue: number | BigNumber): number => {
    if (!(egldValue instanceof BigNumber)) {
        egldValue = new BigNumber(egldValue);
    }

    if (!(usdAmount instanceof BigNumber)) {
        usdAmount = new BigNumber(usdAmount);
    }

    const total = usdAmount.div(egldValue);

    return total.toNumber();
}
/**
 * Estimates gas used by value movement and data handling
 */
export const estimateGasLimit = async (data: TransactionPayload): Promise<number> => {
    const {
        erd_gas_per_data_byte,
        erd_min_gas_limit,
        erd_max_gas_per_transaction
    } = await getGasEconomics();


    const dataLength = data.length();
    const gasLimit = erd_min_gas_limit + erd_gas_per_data_byte * dataLength;

    if (gasLimit > erd_max_gas_per_transaction) {
        return erd_max_gas_per_transaction;
    }

    return gasLimit;

}

export const denominate = (value: Balance | number) => {
    // todo: do proper denomination
    let strVal: string;
    if (value instanceof Balance) {
        strVal = value.toDenominated();
    }else {
        strVal = value.toString();
    }

    // @ts-ignore
    const [intPart, decPart] = strVal.split(".");
    const formattedDecPart = decPart ? decPart.substring(0, 3) : "000";

    return `${intPart}.${formattedDecPart}`;
};
