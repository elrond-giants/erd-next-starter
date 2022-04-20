import axios from "axios";


export const egldPrice = async (): Promise<number> => {
    const {data: {price}} = await axios.get('https://api.elrond.com/economics');

    return price;
}

export const getGasEconomics = async (): Promise<{
    erd_gas_per_data_byte: number,
    erd_min_gas_limit: number,
    erd_min_gas_price: number,
    erd_max_gas_per_transaction: number
}> => {
    const {data: {data: {config}}} = await axios.get('https://gateway.elrond.com/network/config');

    return {
        erd_gas_per_data_byte: config.erd_gas_per_data_byte,
        erd_min_gas_limit: config.erd_min_gas_limit,
        erd_min_gas_price: config.erd_min_gas_price,
        erd_max_gas_per_transaction: config.erd_max_gas_per_transaction
    };
}

