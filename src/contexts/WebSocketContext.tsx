import { createContext, useContext, ReactNode } from 'react';

export interface WebSocketContextType {
  sendMessage: (data: any) => void;
}

// Mock implementation for GitHub Pages
const mockSendMessage = (data: any) => {
  console.log('Mock WebSocket message:', data);
};

const WebSocketContext = createContext<WebSocketContextType>({
  sendMessage: mockSendMessage,
});

export const useWebSocketContext = () => useContext(WebSocketContext);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  return (
    <WebSocketContext.Provider value={{ sendMessage: mockSendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
}; 