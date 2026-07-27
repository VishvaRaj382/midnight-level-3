import { useState, useEffect, useCallback } from 'react';
import type { InitialAPI, ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';
import semver from 'semver';

const COMPATIBLE_CONNECTOR_API_VERSION = '4.x';

export interface UseMidnightState {
  isConnected: boolean;
  isConnecting: boolean;
  walletAddress: string | null;
  networkId: string | null;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const getFirstCompatibleWallet = (): InitialAPI | undefined => {
  if (typeof window === 'undefined' || !window.midnight) return undefined;
  return Object.values(window.midnight).find(
    (wallet): wallet is InitialAPI =>
      !!wallet &&
      typeof wallet === 'object' &&
      'apiVersion' in wallet &&
      semver.satisfies(wallet.apiVersion, COMPATIBLE_CONNECTOR_API_VERSION),
  );
};

export const useMidnight = (): UseMidnightState => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [networkId, setNetworkIdState] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkConnection = useCallback(async () => {
    try {
      const wallet = getFirstCompatibleWallet();
      if (!wallet) return;

      const targetNetwork = (import.meta.env.VITE_NETWORK_ID as string) || 'preprod';
      let api: ConnectedAPI;
      try {
        api = await wallet.connect(targetNetwork);
      } catch {
        api = await wallet.connect('Preprod');
      }
      const addrObj = await api.getUnshieldedAddress();
      if (addrObj?.unshieldedAddress) {
        setWalletAddress(addrObj.unshieldedAddress);
        setNetworkIdState(targetNetwork);
        setIsConnected(true);
      }
    } catch (err) {
      console.warn('Check connection error:', err);
    }
  }, []);

  useEffect(() => {
    void checkConnection();
  }, [checkConnection]);

  const connectWallet = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const wallet = getFirstCompatibleWallet();
      if (!wallet) {
        throw new Error('Lace wallet extension is not installed in your browser. Please install Lace extension for Midnight.');
      }
      const targetNetwork = (import.meta.env.VITE_NETWORK_ID as string) || 'preprod';
      let api: ConnectedAPI;
      try {
        api = await wallet.connect(targetNetwork);
      } catch (err: unknown) {
        try {
          api = await wallet.connect('Preprod');
        } catch {
          throw new Error('Failed to connect to Lace wallet or network mismatch. Please check your Lace wallet setting.');
        }
      }
      const addrObj = await api.getUnshieldedAddress();
      setWalletAddress(addrObj.unshieldedAddress);
      setNetworkIdState(targetNetwork);
      setIsConnected(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setIsConnected(false);
    setWalletAddress(null);
    setNetworkIdState(null);
    setError(null);
  }, []);

  return {
    isConnected,
    isConnecting,
    walletAddress,
    networkId,
    error,
    connectWallet,
    disconnectWallet,
  };
};
