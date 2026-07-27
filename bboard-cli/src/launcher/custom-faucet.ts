import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { type EnvironmentConfiguration, FaucetClient } from '@midnight-ntwrk/testkit-js';
import { createLogger } from '../logger-utils.js';
import { MidnightWalletProvider } from '../midnight-wallet-provider.js';
import { waitForUnshieldedFunds } from '../wallet-utils.js';
import { unshieldedToken } from '@midnight-ntwrk/midnight-js-protocol/ledger';
import { toHex } from '@midnight-ntwrk/midnight-js-utils';
import { randomBytes } from 'node:crypto';

const run = async () => {
  setNetworkId('preprod');

  const envConfiguration: EnvironmentConfiguration = {
    walletNetworkId: 'preprod',
    networkId: 'preprod',
    indexer: 'https://indexer.preprod.midnight.network/api/v4/graphql',
    indexerWS: 'wss://indexer.preprod.midnight.network/api/v4/graphql/ws',
    node: 'https://rpc.preprod.midnight.network',
    nodeWS: 'wss://rpc.preprod.midnight.network',
    faucet: 'https://midnight-tmnight-preprod.nethermind.dev/',
    proofServer: 'http://127.0.0.1:6300',
  };

  const configLogDir = '/Users/VishwaRajSingh/Developer/midnight/demo/logs/custom';
  const logger = await createLogger(configLogDir);

  const seed = toHex(randomBytes(32));
  console.log(`\n========================================`);
  console.log(`GENERATING NEW PREPROD WALLET`);
  console.log(`SEED: ${seed}`);
  console.log(`========================================\n`);

  const walletProvider = await MidnightWalletProvider.build(logger, envConfiguration, seed);
  await walletProvider.start();

  console.log(`Requesting tokens from Midnight Preprod Faucet...`);

  const unshieldedState = await waitForUnshieldedFunds(
    logger,
    walletProvider.wallet,
    envConfiguration,
    unshieldedToken(),
    true, // fundFromFaucet = true
  );

  const balance = unshieldedState.balances[unshieldedToken().raw] ?? 0n;
  console.log(`\n========================================`);
  console.log(`WALLET FUNDED SUCCESSFULLY!`);
  console.log(`SEED: ${seed}`);
  console.log(`BALANCE: ${balance.toString()} tNIGHT`);
  console.log(`========================================\n`);

  process.exit(0);
};

run().catch((err) => {
  console.error('Error funding wallet:', err);
  process.exit(1);
});
