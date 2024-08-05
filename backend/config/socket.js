const { Server } = require("socket.io");

const setupSocket = (server) => {
  const io = new Server(server);
  const conversation = {};

  io.on("connection", (socket) => {
    console.log("New connection established");

    socket.on("joinConversation", (conversationId) => {
      console.log(`Joining conversation ${conversationId}`);

      if (!conversation[conversationId]) {
        conversation[conversationId] = [];
      }

      conversation[conversationId].push(socket);

      socket.on("leaveConversation", (conversationId) => {
        console.log(`Leaving conversation ${conversationId}`);

        const index = conversation[conversationId].indexOf(socket);
        if (index !== -1) {
          conversation[conversationId].splice(index, 1);
        }
      });

      socket.on("newMessage", (conversationId, message) => {
        console.log(
          `New message in conversation ${conversationId}: ${message}`
        );

        conversation[conversationId].forEach((sock) => {
          sock.emit("receiveMessage", message);
        });
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected");

        Object.keys(conversation).forEach((conversationId) => {
          const index = conversation[conversationId].indexOf(socket);
          if (index !== -1) {
            conversation[conversationId].splice(index, 1);
          }
        });
      });
    });
  });

  return io;
};

module.exports = setupSocket;