const createError = require("http-errors");
const express = require("express");
const { join } = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("express-async-errors");
const errorHandler = require("./middleware/error-handler");
const cookieSession = require("cookie-session");

const userAuthRoute = require("./routes/user-auth");
const prospectsRoute = require("./routes/prospect");
const campaignRoute = require("./routes/campaign");

const { json, urlencoded } = express;

var app = express();

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cookieSession({
    signed: false,
    secure: false
  })
);
app.use(express.static(join(__dirname, "public")));

// User routes
app.use(userAuthRoute);
app.use(prospectsRoute);
app.use(campaignRoute);
app.use(errorHandler);

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
  res.status(err.status || 500);
  res.json({ error: [err] });
});

module.exports = app;
