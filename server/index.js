// setup config
require("dotenv").config();

// setup logger
const util = require("util");
const winston = require("winston");
const { format } = winston;

const logger = winston.createLogger({
  level: "debug",
  format: format.simple(),
  transports: [
    new winston.transports.File({
      filename: "log.json",
      format: format.combine(format.timestamp(), format.json())
    })
  ]
});

if (process.env.NODE_ENV !== "production") {
  logger.add(new winston.transports.Console());
}

// setup socket
const port = process.env.PORT;
const io = require("socket.io")();
io.listen(port);
logger.info(`Listening on port ${port}`);

io.on("connection", socket => {
  logger.info(`Added 1 socket connection with id ${socket.id}`);
  socket.on("subscribeToChat", user => {
    logger.info(
      `Added 1 user with name ${user.name} and publicKey: ${user.publicKey}`
    );
    socket.emit("connected", {});
  });
  socket.on("package", package => {
    logger.info(`Broadcast package ${util.inspect(package)}`);
    io.sockets.emit("package", package);
  });
  socket.on("disconnect", () =>
    logger.info(`Closed connection with id ${socket.id}`)
  );
});
