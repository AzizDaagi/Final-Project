const io = require("socket.io-client");

// Create a socket instance
const socket = io("http://localhost:5252", {
  // Enable automatic reconnect
  reconnection: true,
  // Set the maximum number of reconnect attempts
  maxReconnectionAttempts: 10,
});

// Handle errors
socket.on("error", (error) => {
  console.error("Error occurred:", error);
});

// Handle disconnections
socket.on("disconnect", () => {
  console.log("Disconnected from the server");
});

// Listen for new messages
socket.on("receiveMessage", (message) => {
  console.log(`Received message: ${message}`);
});

// When the socket connects, emit the events
socket.on("connect", () => {
  console.log("Connected to the server");

  // Join a conversation
  socket.emit("joinConversation", "conv1");
  console.log("Joined conversation conv1");

  // Send a new message
  socket.emit("newMessage", "conv1", "Hello, world!");
  console.log("Sent message: Hello, world!");

  // Leave the conversation after 5 seconds
  setTimeout(() => {
    socket.emit("leaveConversation", "conv1");
    console.log("Left conversation conv1");

    // Disconnect the socket
    socket.disconnect();
    console.log("Disconnected the socket");
  }, 5000);
});

// Close the socket properly when the process exits
process.on("exit", () => {
  socket.close();
});
