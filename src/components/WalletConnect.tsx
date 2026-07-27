import React from 'react';
import { Box, Button, Typography, Chip, Alert, CircularProgress, Tooltip } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useMidnight } from '../hooks/useMidnight';

export const WalletConnect: React.FC = () => {
  const { isConnected, isConnecting, walletAddress, networkId, error, connectWallet, disconnectWallet } = useMidnight();

  const shortenAddress = (addr: string) => {
    if (!addr || addr.length < 16) return addr;
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
  };

  return (
    <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#121212', border: '1px solid #333', mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <AccountBalanceWalletIcon sx={{ color: isConnected ? '#4caf50' : '#888' }} />
          <Typography variant="h6" sx={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600 }}>
            Lace Wallet (Preprod)
          </Typography>
          <Chip
            label={isConnected ? 'Connected' : 'Disconnected'}
            color={isConnected ? 'success' : 'default'}
            size="small"
            icon={isConnected ? <CheckCircleIcon /> : undefined}
            sx={{ fontWeight: 500 }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isConnected && walletAddress && (
            <Tooltip title={walletAddress}>
              <Typography variant="body2" sx={{ color: '#aaa', fontFamily: 'monospace', bgcolor: '#1a1a1a', px: 1.5, py: 0.5, borderRadius: 1 }}>
                Address: {shortenAddress(walletAddress)}
              </Typography>
            </Tooltip>
          )}

          {!isConnected ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => void connectWallet()}
              disabled={isConnecting}
              startIcon={isConnecting ? <CircularProgress size={16} color="inherit" /> : <AccountBalanceWalletIcon />}
              sx={{ textTransform: 'none', fontWeight: 600, px: 2.5 }}
            >
              {isConnecting ? 'Connecting Lace...' : 'Connect Lace Wallet'}
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="error"
              onClick={disconnectWallet}
              startIcon={<PowerSettingsNewIcon />}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Disconnect
            </Button>
          )}
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2, bgcolor: '#2c0000', color: '#ff8a80' }}>
          {error}
        </Alert>
      )}

      {isConnected && networkId && (
        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#666' }}>
          Connected to Midnight Network: <strong>{networkId.toUpperCase()}</strong>
        </Typography>
      )}
    </Box>
  );
};
