if(process.env.NODE_ENV != "production"){
require('dotenv').config()
}
 


// Import dependencies
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const {listingSchema,reviewSchema}=require("./schema.js");
const listingRoute=require("./routes/listing.js");
const reviewRoute=require("./routes/review.js");
const userRoute=require("./routes/user.js");
const searchRoute=require("./routes/search.js");
const categoryRoute=require("./routes/category.js");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js")




// Models & utilities
const Listing = require("./models/listing");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const Review=require("./models/review.js")

// Create Express app
const app = express();

// EJS & Views setup
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate); // Use ejs-mate for layouts
app.set("view engine", "ejs");

// Middleware
app.use(express.static(path.join(__dirname, "public"))); // Serve static files
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(methodOverride("_method")); // Support PUT/DELETE from forms


const dbUrl=process.env.ATLASDB_URL;
// MongoDB Connection
main()
  .then(() => {
    console.log("Connected successfully to MongoDB");
  })
  .catch((err) => {
    console.log("Mongo connection error:", err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET
  },
  touchAfter:24*3600,
})
store.on("error",()=>{
 console.log("Error in Mongo Session Store",err);
});

const sesssionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie :{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true
  },
};

//session 
app.use(session(sesssionOptions));

//flash 
app.use(flash());


//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// This middleware makes flash messages available in all templates
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currUser=req.user;
  next();
});



app.use("/listings",listingRoute);
app.use("/listings/:id/review",reviewRoute)
app.use("/",userRoute);
app.use("/search",searchRoute)
app.use("/category",categoryRoute)

// ===================== ERROR HANDLING ===================== //

// Catch-all for unmatched routes (404)
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// Central error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs",{message})
});

// Start server
app.listen(8080, () => {
  console.log("App is listening on port 8080");
});
