import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { type EnvironmentConfiguration } from '@midnight-ntwrk/testkit-js';
import { createLogger } from '../logger-utils.js';
import { MidnightWalletProvider } from '../midnight-wallet-provider.js';
import { generateDust } from '../generate-dust.js';
import { unshieldedToken } from '@midnight-ntwrk/midnight-js-protocol/ledger';
import { BBoardAPI, type BBoardProviders, type PrivateStateId } from '../../../api/src/index.js';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { BBoardPrivateState } from '../../../contract/src/witnesses.js';
import { UnshieldedAddress } from '@midnight-ntwrk/wallet-sdk-address-format';
import { getNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import * as Rx from 'rxjs';
import path from 'node:path';

const FUNDED_SEED = '1a1ebae0b766c43274c9161cccaaf19f41f9206719422c6dd09303c365b63399';

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

  const logger = await createLogger('/Users/VishwaRajSingh/Developer/midnight/demo/logs/deploy');

  console.log(`\n========================================`);
  console.log(`INITIALIZING FUNDED WALLET FROM SEED`);
  console.log(`SEED: ${FUNDED_SEED}`);
  console.log(`========================================\n`);

  const walletProvider = await MidnightWalletProvider.build(logger, envConfiguration, FUNDED_SEED);
  await walletProvider.start();

  const initialState = await Rx.firstValueFrom(walletProvider.wallet.unshielded.state);
  const unshieldedAddress = UnshieldedAddress.codec.encode(getNetworkId(), initialState.address).toString();
  console.log(`Unshielded Address: ${unshieldedAddress}`);

  console.log(`Registering UTXOs for tDUST fee token generation...`);
  try {
    await generateDust(logger, FUNDED_SEED, initialState, walletProvider.wallet);
    console.log(`tDUST registration transaction submitted!`);
  } catch (e) {
    console.log(`Dust registration note: ${String(e)}`);
  }

  console.log(`Waiting for tDUST balance sync...`);
  await Rx.firstValueFrom(
    walletProvider.wallet.state().pipe(
      Rx.tap((s) => console.log(`Current tDUST balance: ${s.dust.balance(new Date())}`)),
      Rx.filter((s) => s.dust.balance(new Date()) > 0n),
    ),
  );

  console.log(`tDUST balance available! Setting up contract providers...`);
  const zkConfigPath = path.resolve('/Users/VishwaRajSingh/Developer/midnight/demo/contract/src/managed/bboard');
  const zkConfigProvider = new NodeZkConfigProvider<'post' | 'takeDown'>(zkConfigPath);

  const providers: BBoardProviders = {
    privateStateProvider: levelPrivateStateProvider<PrivateStateId, BBoardPrivateState>({
      privateStateStoreName: 'bboard-private-state-auto',
      signingKeyStoreName: 'bboard-private-state-auto-signing-keys',
      privateStoragePasswordProvider: () => 'Bboard-Test-2026!',
      accountId: FUNDED_SEED,
    }),
    publicDataProvider: indexerPublicDataProvider(envConfiguration.indexer, envConfiguration.indexerWS),
    zkConfigProvider: zkConfigProvider,
    proofProvider: httpClientProofProvider(envConfiguration.proofServer, zkConfigProvider),
    walletProvider: walletProvider,
    midnightProvider: walletProvider,
  };

  console.log(`Deploying Bulletin Board Smart Contract to Preprod Testnet...`);
  const api = await BBoardAPI.deploy(providers, logger);

  console.log(`\n==================================================`);
  console.log(`🎉 SUCCESS! SMART CONTRACT DEPLOYED!`);
  console.log(`CONTRACT ADDRESS: ${api.deployedContractAddress}`);
  console.log(`==================================================\n`);

  process.exit(0);
};

run().catch((err) => {
  console.error('Error deploying contract:', err);
  process.exit(1);
});
