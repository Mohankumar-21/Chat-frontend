import io from 'socket.io-client';

let socket;

export const connectSocket = () => {
  if (!socket) {
    socket = io(process.env.REACT_APP_BACKEND_URL, {
      auth: {
        token: localStorage.getItem('token'),
      },
    });
  }
  return socket;
};

export const getSocket = () => {
  return socket;
};
