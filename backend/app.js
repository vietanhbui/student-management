const createError = require('http-errors');
const express = require('express');
const socketio = require('socket.io');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs')
const cors = require('cors');
const passport = require('passport');
require('./middleware/passport');

const app = express();
const io = socketio();
app.io = io;

const authRouter = require('./routes/auth.router');
const adminRouter = require('./routes/admin.router');
const studentRouter = require('./routes/student.router');
const classRouter = require('./routes/class.router');
const chatRouter = require('./routes/chat.router')(io);

// database
require('./database/mongoose');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// api
app.get('/api', (req, res) => {
  fs.readFile('docs/apiDocs.json', (err, data) => {
    if (err) {
      res.status(400).json({ error: err });
    }
    const docs = JSON.parse(data);
    res.json({ docs })
  })
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(passport.initialize());

app.use('/api', authRouter);
app.use('/api', studentRouter);
app.use('/api', adminRouter);
app.use('/api', classRouter);
app.use('/', chatRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
