import { Client } from '@stomp/stompjs';

let stompClient = null;
let messageHandlers = {
  deliveries: null,
  users: null,
  porters: null,
  admin: null
};

export function connectWebSocket(onDeliveryMessage, onUserMessage, onPorterMessage, onAdminMessage) {
  messageHandlers.deliveries = onDeliveryMessage;
  messageHandlers.users = onUserMessage;
  messageHandlers.porters = onPorterMessage;
  messageHandlers.admin = onAdminMessage;

  stompClient = new Client({
    webSocketFactory: () => new WebSocket('ws://localhost:8080/ws/websocket'),
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    onConnect: () => {
      console.log('WebSocket connected successfully');
      
      stompClient.subscribe('/topic/deliveries', (message) => {
        console.log('Received delivery update:', message.body);
        if (messageHandlers.deliveries) {
          try {
            messageHandlers.deliveries(JSON.parse(message.body));
          } catch (err) {
            console.error('Error parsing delivery message:', err, message.body);
          }
        }
      });

      stompClient.subscribe('/topic/users', (message) => {
        console.log('Received user update:', message.body);
        if (messageHandlers.users) {
          try {
            messageHandlers.users(JSON.parse(message.body));
          } catch (err) {
            console.error('Error parsing user message:', err, message.body);
          }
        }
      });

      stompClient.subscribe('/topic/porters', (message) => {
        console.log('Received porter update:', message.body);
        if (messageHandlers.porters) {
          try {
            messageHandlers.porters(JSON.parse(message.body));
          } catch (err) {
            console.error('Error parsing porter message:', err, message.body);
          }
        }
      });

      stompClient.subscribe('/topic/admin', (message) => {
        console.log('Received admin update:', message.body);
        if (messageHandlers.admin) {
          try {
            messageHandlers.admin(JSON.parse(message.body));
          } catch (err) {
            console.error('Error parsing admin message:', err, message.body);
          }
        }
      });
    },
    onDisconnect: () => {
      console.log('WebSocket disconnected');
    },
    onStompError: (frame) => {
      console.error('WebSocket STOMP error:', frame);
    },
    onWebSocketError: (error) => {
      console.error('WebSocket error:', error);
    },
    onWebSocketClose: (event) => {
      console.warn('WebSocket closed:', event);
    },
    onUnhandledFrame: (frame) => {
      console.warn('Unhandled STOMP frame:', frame);
    },
    onUnhandledMessage: (message) => {
      console.warn('Unhandled STOMP message:', message);
    },
    onUnhandledReceipt: (receipt) => {
      console.warn('Unhandled STOMP receipt:', receipt);
    },
    onChangeState: (state) => {
      console.log('STOMP client state changed:', state);
    },
    debug: (str) => {
      console.debug('STOMP debug:', str);
    }
  });
  
  stompClient.activate();
}

export function disconnectWebSocket() {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
}

export function isConnected() {
  return stompClient && stompClient.connected;
} 