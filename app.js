const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const logger = require("morgan");
const expbs = require("express-handlebars");
const Handlebars = require("handlebars");
const { allowInsecurePrototypeAccess } = require("@handlebars/allow-prototype-access");

const homeRouter = require("./routes/home");
const usersRouter = require("./routes/users");
const adminRouter = require("./routes/admin");
const orderRouter = require('./routes/order')
const mongoose = require("moongoose");
const authRouter = require("./routes/auth");

const app = express();

// view engine setup
const hbs = expbs.create({
  extname: "hbs",
  defaultLayout: "layout",
  layoutsDir: __dirname + "/views/layouts",
  partialsDir: __dirname + "/views/partials",
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  helpers: {
    sum: function (price) {
      return price + 50 * 1;
    },
    check: function (length) {
      if (length == 0) {
        return true
      } else {
        return false
      }
    }
  }
})

app.set("views", path.join(__dirname, "views"));
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");





app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", (req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});
app.use("/", homeRouter);
app.use("/users", usersRouter);
app.use("/", authRouter);
app.use("/admin", adminRouter);
app.use('/order', orderRouter)
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
  res.render("error");
});

module.exports = app;
