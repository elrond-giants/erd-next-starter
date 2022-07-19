# Elrond Giants dapp template

<img src=https://giants.fra1.cdn.digitaloceanspaces.com/dapp-template-os.jpg  width="550px" alt="elrond giants dapp template banner"/>

This is a dapp template based on [Next.js](https://nextjs.org/)
and [erd-react-hooks](https://github.com/Elrond-Giants/erd-react-hooks).

It offers authentication with Maiar App, Web Wallet, Extension, and Ledger. It also includes methods to easily sign and
make
transactions, query smart contracts, and a few utility methods.

This template is used as a starting point for many of the [Elrond Giants](https://elrondgiants.com/) projects, so it's
very opinionated.

## Getting Started

#### Get the template

Start by creating a repository from this template.

![use repository template](https://docs.github.com/assets/cb-36544/images/help/repository/use-this-template-button.png)

Click on **Use this template** and then clone your newly created repository.

#### Install the dependencies

```bash
npm install
```

#### Set the .env file

We have included the .env.development and .env.production files, which contain just elrond-specific environment
variables. If you don't use a smart contract you don't need to do anything.

If you need to interact with a smart contract, create your .env file and set the `NEXT_PUBLIC_CONTRACT_ADDRESS`
variable.

#### Launch and explore

```bash
npm run dev
```

Open your browser, go to [http://localhost:3000](http://localhost:3000) and start exploring.

## How To's

#### Sign and send transaction

To make a transaction, simply use the hook `useTransction` and everything will be taken care for, from signing the
transaction to
status notifications.

Simple egld transaction:

```typescript
import {useTransaction} from "../hooks/useTransaction";


const {makeTransaction} = useTransaction();

await makeTransaction({
    receiver: "erd...",
    data: txData,
    value: 0.01,
});
```

Smart contract call:

```typescript
import {useTransaction} from "../hooks/useTransaction";
import {TransactionPayload} from "@elrondnetwork/erdjs/out";


const {makeTransaction} = useTransaction();
const txData = TransactionPayload.contractCall()
    .setFunction(new ContractFunction("SomeFunction"))
    .addArg(new BigUIntValue(10))
    .build();


await makeTransaction({
    receiver: "erd...",
    data: txData,
    value: 0.01,
});
```

#### Make query

```typescript
export const getTotalTokensLeft = async (): Promise<number> => {
    const {data: data} = await querySc(
        contractAddress,
        "getTotalTokensLeft",
        {outputType: "int"}
    );

    return parseInt(data, 10);
};
```

## Deploy

Checkout the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for details.


## Projects that use this template

* [MyERD](https://myerd.live)
* [Elrond Print](https://elrondprint.com)
* [Giants Raffle](https://raffle.elrondgiants.com/)