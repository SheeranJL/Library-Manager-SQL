var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();
var db = require('./models');


(async () => {
  await db.sequelize.sync({force:true});

  try {
    db.sequelize.authenticate();
    console.log('connection successful');
  } catch(error) {
    console.log('there was an errorr');
  }
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes'));
app.use('/books', require('./routes/books'));


// catch 404 and forward to error handler
app.use( (req, res, next) => {
    // const err = new Error('Whoopsy! The page you requested cannot be found here!');
    // err.status = 404;
    next(createError(404))
});

// error handler
app.use( (err, req, res, next) => {

  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};
  // if (err) {
  //   console.log('Global error handler called', err)
  // }

  if (err.status === 404) {
    console.log('A 404 Error occured');
    const errorMessage = "Oh no! We couldn't find what you were looking for. It's probably lost within this picture somewhere. Go back and search again while we clean up.";
    res.status(404).render('page-not-found', {errorMessage, err})
  } else {
    console.log('A 500 error occured.', err)
    err.message = err.message || 'Oh no! Something on our end went wrong. If this error persists, please contact site admin.'
    res.status(err.status || 500).render('error', {message, err})
  }
});



module.exports = app;
