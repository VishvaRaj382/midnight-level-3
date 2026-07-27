import { createLogger } from './logger-utils.js';
import { PreprodRemoteConfig } from './config.js';
import { MidnightWalletProvider } from './midnight-wallet-provider.js';
import { waitForUnshieldedFunds } from './wallet-utils.js';
import { unshieldedToken } from '@midnight-ntwrk/midnight-js-protocol/ledger';
import { toHex } from '@midnight-ntwrk/midnight-js-utils';
import { randomBytes } from 'node:crypto';

const run = async () => {
  const config = new PreprodRemoteConfig();
  const logger = await createLogger(config.logDir);
  const testEnv = config.getEnvironment(logger);
  const envConfiguration = await testEnv.start();

  const seed = toHex(randomBytes(32));
  console.log(`\n========================================`);
  console.log(`NEW WALLET GENERATED`);
  console.log(`SEED: ${seed}`);
  console.log(`========================================\n`);

  const walletProvider = await MidnightWalletProvider.build(logger, envConfiguration, seed);
  await walletProvider.start();

  console.log(`Requesting funds automatically from Preprod Faucet...`);
  const unshieldedState = await waitForUnshieldedFunds(
    logger,
    walletProvider.wallet,
    envConfiguration,
    unshieldedToken(),
    true, // fundFromFaucet = true
  );

  const balance = unshieldedState.balances[unshieldedToken().raw] ?? 0n;
  console.log(`\n========================================`);
  console.log(`SUCCESS! WALLET FUNDED`);
  console.log(`BALANCE: ${balance.toString()} tNIGHT`);
  console.log(`========================================\n`);

  process.exit(0);
};

run().catch((err) => {
  console.error('Error generating funded wallet:', err);
  process.exit(1);
});
