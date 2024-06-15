const express = require("express");
const { createServer } = require("node:http");
const initializeSocket = require("./services/socket.service");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const sharedSession = require("express-socket.io-session");
require("dotenv").config();
const app = express();
const port = 3000;
const server = createServer(app);
const io = initializeSocket(server);

if (!process.env.SESSION_SECRET) {
  console.log("SESSION_SECRET is not set!");
}

app.use(express.static("public"));
app.use(morgan("combined"));
app.set("views", "./views");
app.set("view engine", "pug");
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(flash());
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL
  }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    secure: "auto",
    httpOnly: true
  },
});
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
io.use(sharedSession(sessionMiddleware, {
  autoSave:true
}));
app.use("/uploads", express.static("uploads"));

const router = require("./routes/index.route");
const database = require("./config/data");
const initializePassport = require("./middlewares/passport");
initializePassport(passport, database.getUserByEmail, database.getUserById);

database.connect();
router(app);

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});