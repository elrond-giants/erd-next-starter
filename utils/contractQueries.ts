import {querySc} from "../apis/queries";
import {contractAddress} from "../config";

export const getTotalTokensLeft = async (): Promise<number> => {
    const {data: data} = await querySc(
        contractAddress as string,
        'getTotalTokensLeft',
        {outputType: "int"}
    );

    return parseInt(data, 10);
};