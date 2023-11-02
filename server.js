const { log, info, warn, error } = require("console");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  allowEIO3: true,
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    transports: ["websocket", "polling"],
    credentials: true,
  },
});

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  info(
    "[" + socket.id + "] new connection",
    socket.request.connection.remoteAddress
  );

  socket.on("message", (data) => {
    log(`message from ${data.clientID} via socket id: ${socket.id}`);
    socket.broadcast.emit("message", data);
  });

  socket.on("changeMode", (data) => {
    log(`mode change to ${data}`);
    socket.broadcast.emit("changeMode", data);
  });

  socket.on("changeState1", (data) => {
    log(`state1 change to ${data}`);
    socket.broadcast.emit("changeState1", data);
  });

  socket.on("changeState2", (data) => {
    log(`state2 change to ${data}`);
    socket.broadcast.emit("changeState2", data);
  });
  /**************************** */
  //xu ly chung
  socket.on("reconnect", function () {
    warn("[" + socket.id + "] reconnect.");
  });
  socket.on("disconnect", () => {
    error("[" + socket.id + "] disconnect.");
  });
  socket.on("connect_error", (err) => {
    error(err.stack);
  });
});

//doi port khac di
server.listen(3000, () => {
  log("server is listening on port doi port di");
});

