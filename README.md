# Passport-Fitbit

[Passport](https://github.com/jaredhanson/passport) strategy for authenticating
with [Fitbit](http://www.fitbit.com/) using the OAuth 1.0a API.

This module lets you authenticate using Fitbit in your Node.js applications.
By plugging into Passport, Fitbit authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-fitbit

## Usage

#### Configure Strategy

The Fitbit authentication strategy authenticates users using a Fitbit account
and OAuth tokens.  The strategy requires a `verify` callback, which accepts
these credentials and calls `done` providing a user, as well as `options`
specifying a consumer key, consumer secret, and callback URL.

    passport.use(new FitbitStrategy({
        consumerKey: FITBIT_CONSUMER_KEY,
        consumerSecret: FITBIT_CONSUMER_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/fitbit/callback"
      },
      function(token, tokenSecret, profile, done) {
        User.findOrCreate({ fitbitId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'fitbit'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/fitbit',
      passport.authenticate('fitbit'));

    app.get('/auth/fitbit/callback', 
      passport.authenticate('fitbit', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Examples

For a complete, working example, refer to the [login example](https://github.com/jaredhanson/passport-fitbit/tree/master/examples/login).

## Tests

    $ npm install --dev
    $ make test

[![Build Status](https://secure.travis-ci.org/jaredhanson/passport-fitbit.png)](http://travis-ci.org/jaredhanson/passport-fitbit)

## Credits

  - [Jared Hanson](http://github.com/jaredhanson)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2011-2013 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>
