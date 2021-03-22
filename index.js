const { ApiPromise, WsProvider } = require('@polkadot/api');
const { encodeAddress } = require('@polkadot/keyring');
const { options } = require('@chainx-v2/api');
const url = 'wss://chainx.elara.patract.io';
const wsProvider = new WsProvider(url);
const { Keyring } = require('@polkadot/keyring')
const { cryptoWaitReady, mnemonicGenerate }=  require('@polkadot/util-crypto');



const mnemonic = mnemonicGenerate();
// eslint-disable-next-line no-void
async function excuteTransfer() {
    
    const api = await ApiPromise.create(options({ provider: wsProvider }));

    await cryptoWaitReady();

    const systemProperties = await api.rpc.system.properties()
    properties = systemProperties.toJSON()

    const keyring = new Keyring({ type: 'sr25519', ss58Format: properties.ss58Format })
    
    // create an sr25519 pair from the mnemonic (keyring defaults)
    const sp = keyring.createFromUri('0xb79017552da1b79c630fb2ed82d111350f6157a75d3076a2d4c4adfb0ed4d605', { name: 'test-account' });
   
    console.log('address:' + sp.address);

    const balance = await api.query.system.account(sp.publicKey);

    console.log('balance', balance.data.free.toString());

    const toAddress = '5TJqoHR8U4ktWdfRceZ3vhB6AwUaSMDAkxkkHZ4emu8wUNBP';

    const transfer = api.tx.balances.transfer(toAddress, 0.01 * Math.pow(10, 8));
    // Sign and send the transaction using our account
    const hash = await transfer.signAndSend(sp);

   console.log('Transfer sent with hash', hash.toHex());

  process.exit();
}

async function main() {
    await excuteTransfer();
}
main();