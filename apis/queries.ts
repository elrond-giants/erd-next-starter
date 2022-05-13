import axios from "axios";
import {network} from "../config";

type OutputType = "query" | "hex" | "string" | "int";

interface QueryOptions {
    args?: any[];
    value?: string;
    outputType?: OutputType;
}

const SUCCESS_CODE = "successful";

export const querySc = async (
    address: string,
    funcName: string,
    {args, value, outputType}: QueryOptions = {}
) => {
    const computeType = outputType ?? "query";
    const {data: {data, error, code}} = await axios.post(
        `${network.gatewayAddress}/vm-values/${computeType}`,
        {
            funcName,
            scAddress: address,
            args: args ?? [],
            value: value ?? "0"
        }
    );

    if (code !== SUCCESS_CODE) {
        throw new Error(error);
    }

    return data;

}