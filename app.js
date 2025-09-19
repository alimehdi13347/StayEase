if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Core modules
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const http = require("http");
const { Server } = require("socket.io");

// Models & utilities
const User = require("./models/user");
const Listing = require("./models/listing");
const Review = require("./models/review");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const Message = require('./models/message');

// Routes
const listingRoute = require("./routes/listing");
const reviewRoute = require("./routes/review");
const userRoute = require("./routes/user");
const searchRoute = require("./routes/search");
const categoryRoute = require("./routes/category");
const chatRoutes = require('./routes/chat');

// Create Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080", // Adjust if needed
    methods: ["GET", "POST"]
  }
});

// MongoDB connection
const dbUrl = process.env.ATLASDB_URL;
main()
  .then(() => console.log("Connected successfully to MongoDB"))
  .catch((err) => console.log("Mongo connection error:", err));

async function main() {
  await mongoose.connect(dbUrl);
}

// Session store
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: { secret: process.env.SECRET },
  touchAfter: 24 * 3600
});
store.on("error", (err) => {
  console.log("Error in Mongo Session Store", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
};

// Middleware
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash + current user middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Routes
app.use("/listings", listingRoute);
app.use("/listings/:id/review", reviewRoute);
app.use("/", userRoute);
app.use("/search", searchRoute);
app.use("/category", categoryRoute);
app.use('/listings', chatRoutes);


// Root redirect
app.get("/", (req, res) => {
  res.redirect("/listings");
});

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", ({ roomId }) => {
    socket.join(roomId);
    console.log(`Joined room: ${roomId}`);
  })

socket.on("sendMessage", async (data) => {
  io.to(data.roomId).emit("receiveMessage", data);
  await Message.create(data); // Save to DB
});

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


// Error handling
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// Start server
server.listen(8080, () => {
  console.log("App is listening on port 8080");
});