/**
 *  Copyright 2014 Nest Labs Inc. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
'use strict';

var PORT = 3000;

var express = require('express'),
  session = require('express-session'),
  cookieParser = require('cookie-parser'),
  app = express(),
  passport = require('passport'),
  bodyParser = require('body-parser'),
  NestStrategy = require('passport-nest').Strategy,
  constants = require('./src/models/constants.json');

var path = require('path');
var webpack = require('webpack');
var config = require('./webpack.config');
var compiler = webpack(config);

/**
  Setup Passport to use the NestStrategy,
  simply pass in the clientID and clientSecret.

  Here we are pulling those in from ENV variables.
*/
passport.use(new NestStrategy({
  clientID: constants.NEST_ID,
  clientSecret: constants.NEST_SECRET,
  callbackURL: "http://localhost:" + PORT + "/auth/nest/callback"
}));

/**
  No user data is available in the Nest OAuth
  service, just return the empty user object.
*/
passport.serializeUser(function (user, done) {
  done(null, user);
});

/**
  No user data is available in the Nest OAuth
  service, just return the empty user object.
*/
passport.deserializeUser(function (user, done) {
  done(null, user);
});

/**
  Setup the Express app
*/
app.listen(PORT);

if (process.env.NODE_ENV === 'development') {
  /** Webpack dev */
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }));

  app.use(require('webpack-hot-middleware')(compiler));
}

app.use(cookieParser('cookie_secret_shh')); // Change for production apps
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'session_secret_shh', // Change for production apps
  resave: true,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

/**
  Listen for calls and redirect the user to the Nest OAuth
  URL with the correct parameters.
*/
app.get('/auth/nest', passport.authenticate('nest'));

/**
  Upon return from the Nest OAuth endpoint, grab the user's
  accessToken and set a cookie, then
  return the user back to the root app.
*/
app.get(
  '/auth/nest/callback',
  passport.authenticate('nest', {
    failureRedirect: '/login'
  }),
  function (req, res) {
    var token = req.user.accessToken;
    res.cookie('nest_token', token);
    res.redirect('/home?access_token=' + token);
  }
);

app.get(
  '/auth/nest/proxy'
);

app.get('*', (req, res) => {
  console.log(req.url);
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

/**
  Export the app
*/
module.exports = app;
