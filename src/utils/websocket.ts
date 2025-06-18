type WebSocketMessageHandler = (data: any) => void;

class WebSocketManager {
  private static instance: WebSocketManager;
  private ws: WebSocket | null = null;
  private messageHandlers: Set<WebSocketMessageHandler> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  private constructor() {
    // Handle page visibility changes
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    // Handle bfcache events
    window.addEventListener('pageshow', this.handlePageShow);
    window.addEventListener('pagehide', this.handlePageHide);
  }

  public static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  private handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      this.connect();
    } else {
      this.disconnect();
    }
  };

  private handlePageShow = (event: PageTransitionEvent) => {
    // Check if the page is being loaded from bfcache
    if (event.persisted) {
      this.connect();
    }
  };

  private handlePageHide = () => {
    // Clean up before the page enters bfcache
    this.disconnect();
  };

  public connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    try {
      this.ws = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:3000');
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.messageHandlers.forEach(handler => handler(data));
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        this.handleDisconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.handleDisconnect();
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      this.handleDisconnect();
    }
  }

  private handleDisconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.reconnectTimeout = setTimeout(() => {
        this.connect();
      }, Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000));
    }
  }

  public disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  public addMessageHandler(handler: WebSocketMessageHandler) {
    this.messageHandlers.add(handler);
  }

  public removeMessageHandler(handler: WebSocketMessageHandler) {
    this.messageHandlers.delete(handler);
  }

  public sendMessage(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }
}

export const wsManager = WebSocketManager.getInstance(); 