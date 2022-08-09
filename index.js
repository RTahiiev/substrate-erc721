// Import
import { ApiPromise, WsProvider } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';
import metadata from 'path/to/metadata' assert {type: "json"};

async function main () {
    /* INTERACTION WITH CHAIN VIA CODE
     */
    // Construct
    // ---------------------------------- rpc address of chain 
    const wsProvider = new WsProvider('wss://rococo-contracts-rpc.polkadot.io');
    const api = await ApiPromise.create({ provider: wsProvider });

    // Do something
    console.log(api.genesisHash.toHex());

    // The actual address that we will use
    const OWNER_ADDR = 'your_address';
    const CONTRACT_ADDR = 'contract_address';

    // Retrieve the last timestamp
    const now = await api.query.timestamp.now();

    // Retrieve the account balance & nonce via the system module
    const { nonce, data: balance } = await api.query.system.account(OWNER_ADDR);

    console.log(`${now}: balance of ${balance.free} and a nonce of ${nonce}`);
    /* INTERACTION WITH SMART CONTRACT VIA CODE
     */
    // The address is the actual on-chain address as ss58 or AccountId object.
    const contract = new ContractPromise(api, metadata, CONTRACT_ADDR);

    // test user address
    const TEST_ADDR = 'test_address';

    // (We perform the send from an account, here using owner address)
    const { gasRequired, storageDeposit, result, output } = await contract.query.balanceOf(
        OWNER_ADDR, // caller seed
        {
            gasLimit: -1
        },
        TEST_ADDR
    );

    // The actual result from RPC as `ContractExecResult`
    console.log(result.toHuman());

    // the gas consumed for contract execution
    console.log(gasRequired.toHuman());

    // check if the call was successful
    if (result.isOk) {
        // output the return value
        console.log('Success', output.toHuman());
    } else {
        console.error('Error', result.asErr);
    }
}

main().catch(console.error).finally(() => process.exit());
