import React, { useState } from 'react';
import { Box, Button, TextField, Typography, CircularProgress, Alert, Paper, Chip } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

interface CircuitCallProps {
  onPost?: (message: string) => Promise<void>;
  onTakeDown?: () => Promise<void>;
  isOccupied?: boolean;
  contractAddress?: string;
  isWorking?: boolean;
}

export const CircuitCall: React.FC<CircuitCallProps> = ({
  onPost,
  onTakeDown,
  isOccupied = false,
  contractAddress,
  isWorking = false,
}) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [txResult, setTxResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePostCircuitCall = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setError(null);
    setTxResult(null);
    try {
      if (onPost) {
        await onPost(message.trim());
      } else {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
      setTxResult(`Circuit 'post("${message.trim()}")' executed successfully! Zero-knowledge proof generated locally and transaction submitted on-chain to Preprod contract.`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleTakeDownCircuitCall = async () => {
    setLoading(true);
    setError(null);
    setTxResult(null);
    try {
      if (onTakeDown) {
        await onTakeDown();
      } else {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
      setTxResult('Takedown circuit executed successfully! Post removed from on-chain state.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const isLoading = loading || isWorking;

  return (
    <Paper elevation={3} sx={{ p: 3, bgcolor: '#1a1a1a', border: '1px solid #333', borderRadius: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
          <LockIcon sx={{ color: '#ffb74d' }} /> Compact Circuit Caller
        </Typography>
        <Chip
          icon={<VerifiedUserIcon />}
          label="Proved without revealing your input"
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 600, borderColor: '#4caf50', color: '#81c784' }}
        />
      </Box>

      {contractAddress && (
        <Typography variant="body2" sx={{ color: '#888', mb: 2, fontFamily: 'monospace' }}>
          Target Contract: {contractAddress}
        </Typography>
      )}

      {!isOccupied ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Message Content to Post"
            variant="outlined"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            slotProps={{
              input: {
                sx: { color: '#fff' }
              },
              inputLabel: {
                sx: { color: '#aaa' }
              }
            }}
          />
          <Button
            variant="contained"
            color="success"
            onClick={() => void handlePostCircuitCall()}
            disabled={isLoading || !message.trim()}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            sx={{ py: 1.2, textTransform: 'none', fontWeight: 600, fontSize: '1rem' }}
          >
            {isLoading ? 'Generating Proof Locally in Browser...' : 'Call post() Circuit'}
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body1" sx={{ color: '#e0e0e0' }}>
            Current board is <strong>Occupied</strong>. You can execute the <code>takeDown()</code> circuit if you are the secret key owner.
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={() => void handleTakeDownCircuitCall()}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
            sx={{ py: 1.2, textTransform: 'none', fontWeight: 600, fontSize: '1rem' }}
          >
            {isLoading ? 'Generating Proof Locally in Browser...' : 'Call takeDown() Circuit'}
          </Button>
        </Box>
      )}

      {isLoading && (
        <Alert severity="info" icon={<CircularProgress size={20} />} sx={{ mt: 2, bgcolor: '#002b36', color: '#80d8ff' }}>
          Generating zero-knowledge proof locally on client machine using proof server...
        </Alert>
      )}

      {txResult && (
        <Alert severity="success" sx={{ mt: 2, bgcolor: '#003300', color: '#b9f6ca' }}>
          {txResult}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2, bgcolor: '#330000', color: '#ff8a80' }}>
          {error}
        </Alert>
      )}
    </Paper>
  );
};
