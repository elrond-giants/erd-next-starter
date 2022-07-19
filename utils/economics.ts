import BigNumber from "bignumber.js";
import {egldPrice} from "../apis/economics";
import {denomination} from "../config";


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

export const denominate = (value: number | string, decimalPlaces = 3): BigNumber => {
    const bigValue =  new BigNumber(value)

    return bigValue
        .shiftedBy(-(denomination ?? 18))
        .decimalPlaces(decimalPlaces);

};
