const dotenv = require("dotenv");
dotenv.config();
var createError = require("http-errors");
var express = require("express");

var path = require("path");
var cookieParser = require("cookie-parser");
var expressLayouts = require("express-ejs-layouts");
var partials = require("express-partials");
var mongoose = require("mongoose");
var fileUpload = require("express-fileupload");
//var validationResult = require("express-validator");
var session = require("express-session");
var flash = require("connect-flash");
const cors = require("cors");
var logger = require("morgan");
var methodOverride = require("method-override");

//Routes
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

//1. PORT
const PORT = process.env.PORT || 5000;

var sessionStore = new session.MemoryStore();
// enable files upload
app.use(
  fileUpload({
    createParentPath: true,
  })
);

//add other middleware
app.use(cors());

//Bring the Database

var config = require("./config/database");
//3.
//mongoose.connect(process.env. || config.database, {
mongoose.connect(process.env.MONGODB_URL || config.database, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

let db = mongoose.connection;

// Check database connection
db.once("open", function () {
  console.log("Connected to local database");
});

//1st, Check for database errors
db.on("error", function (err) {
  console.log(err);
});

// view engine setup
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
// app.use(methodOverride("X-HTTP-Method-Override"));

//Express Session
app.use(
  session({
    cookie: { maxAge: 60000 },
    store: sessionStore,
    secret: "secretforever",
    saveUninitialized: true,
    resave: true,
  })
);
app.use(flash());

// Custom flash middleware -- from Ethan Brown's book, 'Web Development with Node & Express'
app.use(function (req, res, next) {
  // if there's a flash message in the session request, make it available in the response, then delete it
  res.locals.sessionFlash = req.session.sessionFlash;
  delete req.session.sessionFlash;
  next();
});

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 5000);
  res.render("error");
});

//4
if (process.env.NODE_ENV === "production") {
  app.use(express.static("/build"));
}

//2.
app.listen(PORT, console.log(`Application is running on port ${PORT}`));

module.exports = app;
