import { useEffect, useCallback } from 'react';
import { wsManager } from '@/utils/websocket';

export const useWebSocket = (onMessage?: (data: any) => void) => {
  const sendMessage = useCallback((data: any) => {
    wsManager.sendMessage(data);
  }, []);

  useEffect(() => {
    if (onMessage) {
      wsManager.addMessageHandler(onMessage);
    }

    // Connect when the component mounts
    wsManager.connect();

    return () => {
      if (onMessage) {
        wsManager.removeMessageHandler(onMessage);
      }
    };
  }, [onMessage]);

  return { sendMessage };
}; 