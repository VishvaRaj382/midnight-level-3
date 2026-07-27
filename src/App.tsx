import React, { useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
import { MainLayout, Board, WalletConnect, CircuitCall } from './components';
import { useDeployedBoardContext } from './hooks';
import { type BoardDeployment } from './contexts';
import { type Observable } from 'rxjs';

const App: React.FC = () => {
  const boardApiProvider = useDeployedBoardContext();
  const [boardDeployments, setBoardDeployments] = useState<Array<Observable<BoardDeployment>>>([]);

  useEffect(() => {
    const subscription = boardApiProvider.boardDeployments$.subscribe(setBoardDeployments);

    return () => {
      subscription.unsubscribe();
    };
  }, [boardApiProvider]);

  return (
    <Box sx={{ background: '#000', minHeight: '100vh', py: 2 }}>
      <MainLayout>
        <Container maxWidth="lg">
          <WalletConnect />
          <CircuitCall
            contractAddress="020084f7b494665427ecff72bb4bf2b91cbfdcba3b6bd6539bfbc14b62dbb7ed"
            isOccupied={false}
          />
          {boardDeployments.map((boardDeployment, idx) => (
            <div data-testid={`board-${idx}`} key={`board-${idx}`}>
              <Board boardDeployment$={boardDeployment} />
            </div>
          ))}
          <div data-testid="board-start">
            <Board />
          </div>
        </Container>
      </MainLayout>
    </Box>
  );
};

export default App;
