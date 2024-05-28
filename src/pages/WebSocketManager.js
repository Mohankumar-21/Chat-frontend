import io from 'socket.io-client';
import { store } from '../redux/store'; 
import { setOnlineUser } from '../redux/userSlice'; 

class WebSocketManager {
  constructor() {
    this.socket = null;
  }

  connect(userId) {
    this.socket = io(process.env.REACT_APP_BACKEND_URL, {
      auth: {
        token: localStorage.getItem('token')
      }
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.socket.emit('sidebar', userId);
    });

    this.socket.on('onlineusers', (data) => {
      store.dispatch(setOnlineUser(data));
    });

    this.socket.on('conversation', (data) => {
      const conversationUserData = data.map((convuser) => {
        if (convuser?.sender?._id === convuser?.receiver?._id) {
          return {
            ...convuser,
            userDetails: convuser?.sender
          };
        } else if (convuser?.receiver?._id !== userId) {
          return {
            ...convuser,
            userDetails: convuser?.receiver
          };
        } else {
          return {
            ...convuser,
            userDetails: convuser?.sender
          };
        }
      });
      this.setAllUser(conversationUserData);
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  setAllUser(data) {
    // This method should handle setting the conversation data appropriately
    store.dispatch({ type: 'SET_ALL_USER', payload: data });
  }
}

export const webSocketManager = new WebSocketManager();
