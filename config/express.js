/**
 * Module dependencies.
 */

var express = require('express'),
  router = express.Router(),
  connect = require('connect'),
  session = require('express-session'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  favicon = require('serve-favicon'),
  compression = require('compression'),
  morgan = require('morgan'),
  methodOverride = require('method-override'),
  mongoStore = require('connect-mongo')(session),
  flash = require('connect-flash'),
  helpers = require('view-helpers');

var async = require('async');
var fs= require('fs');
var path = require('path');
var express = require('express');
var AWS = require('aws-sdk');
var accessKeyId =  process.env.AWS_ACCESS_KEY_ID || "xxxxxx";
var secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "+xxxxxx+B+xxxxxxx";
AWS.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region:'us-west-2'
});

var s3 = new AWS.S3();
var nodeEnv = process.env.NODE_ENV || 'development';

module.exports = function (app, config, passport) {

  app.set('showStackError', true)
  // should be placed before express.static
  app.use(compression({
    filter: function (req, res) {
      return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
    },
    level: 9
  }))
  app.use(favicon(config.root + '/public/favicon.ico'))
  app.use(express.static(config.root + '/public'))

  // don't use logger for test env
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'))
  }

  var allowCrossDomain = function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

      // intercept OPTIONS method
      if ('OPTIONS' == req.method) {
        res.send(200);
      }
      else {
        next();
      }
  };
  app.use(allowCrossDomain);

  // set views path, template engine and default layout
  app.set('views', config.root + '/app/views')
  app.set('view engine', 'jade')

  // enable jsonp
  app.enable("jsonp callback")

  //app.configure(function () {
    // dynamic helpers
    app.use(helpers(config.app.name))

    // cookieParser should be above session
    app.use(cookieParser())

    // bodyParser should be above methodOverride
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))
    //app.use(express.methodOverride())
    // override with different headers; last one takes precedence
    app.use(methodOverride('X-HTTP-Method'))          // Microsoft
    app.use(methodOverride('X-HTTP-Method-Override')) // Google/GData
    app.use(methodOverride('X-Method-Override'))      // IBM

    // express/mongo session storage
    app.use(session({
      secret: 'tesedaApp',
      resave: true,
      saveUninitialized: true,
      store: new mongoStore({
        url: config.db,
        collection : 'sessions'
      })
    }))

    // connect flash for flash messages
    app.use(flash())

    // use passport session
    app.use(passport.initialize())
    app.use(passport.session())

    router.use(function(req,res,next) {
      res.nodeEnv = process.env.NODE_ENV || 'development'
      next()
    })

    // routes should be at the last
    //app.use(app.router)

    // assume "not found" in the error msgs
    // is a 404. this is somewhat silly, but
    // valid, you can do whatever you like, set
    // properties, use instanceof etc.
    router.use(function(err, req, res, next){
      // treat as 404
      if (~err.message.indexOf('not found')) return next()

      // log it
      console.error(err.stack)

      // error page
      res.status(500).render('500', { error: err.stack })
    })

    // assume 404 since no middleware responded
    router.use(function(req, res, next){
      res.status(404).render('404', { url: req.originalUrl, error: 'Not found' })
    })

  //})
}
