**DEPRECATED:** Fitbit's support for OAuth 1.0a is [deprecated](https://community.fitbit.com/t5/Web-API/OAuth-2-0-is-official-OAuth-1-0a-is-deprecated/m-p/983800)
and will no longer function as of April 12, 2016.  You are encouraged to migrate
to OAuth 2.0 and [passport-fitbit-oauth2](https://github.com/thegameofcode/passport-fitbit-oauth2)
as soon as possible.


# passport-fitbit

[![Build](https://img.shields.io/travis/jaredhanson/passport-fitbit.svg)](https://travis-ci.org/jaredhanson/passport-fitbit)
[![Coverage](https://img.shields.io/coveralls/jaredhanson/passport-fitbit.svg)](https://coveralls.io/r/jaredhanson/passport-fitbit)
[![Quality](https://img.shields.io/codeclimate/github/jaredhanson/passport-fitbit.svg?label=quality)](https://codeclimate.com/github/jaredhanson/passport-fitbit)
[![Dependencies](https://img.shields.io/david/jaredhanson/passport-fitbit.svg)](https://david-dm.org/jaredhanson/passport-fitbit)


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

#### Create an Application

Before using `passport-fitbit`, you must register an application with Fitbit.
If you have not already done so, a new application can be created at
[Fitbit Developers](https://dev.fitbit.com/).  Your application will be issued a
consumer key and consumer secret, which need to be provided to the strategy.
You will also need to configure a callback URL which matches the route in your
application.

#### Configure Strategy

The Fitbit authentication strategy authenticates users using a Fitbit account
and OAuth tokens.  The consumer key and consumer secret obtained when creating
an application are supplied as options when creating the strategy.  The strategy
also requires a `verify` callback, which receives the access token and
corresponding secret as arguments, as well as `profile` which contains the
authenticated user's Fitbit profile.   The `verify` callback must call `cb`
providing a user to complete authentication.

    passport.use(new FitbitStrategy({
        consumerKey: FITBIT_CONSUMER_KEY,
        consumerSecret: FITBIT_CONSUMER_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/fitbit/callback"
      },
      function(token, tokenSecret, profile, cb) {
        User.findOrCreate({ fitbitId: profile.id }, function (err, user) {
          return cb(err, user);
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

Developers using the popular [Express](http://expressjs.com/) web framework can
refer to an [example](https://github.com/passport/express-4.x-twitter-example)
as a starting point for their own web applications.  The example shows how to
authenticate users using Twitter.  However, because both Twitter and Fitbit
use OAuth 1.0, the code is similar.  Simply replace references to Twitter with
corresponding references to Fitbit.

## Contributing

#### Tests

The test suite is located in the `test/` directory.  All new features are
expected to have corresponding test cases.  Ensure that the complete test suite
passes by executing:

```bash
$ make test
```

#### Coverage

All new feature development is expected to have test coverage.  Patches that
increse test coverage are happily accepted.  Coverage reports can be viewed by
executing:

```bash
$ make test-cov
$ make view-cov
```

## Support

#### Funding

This software is provided to you as open source, free of charge.  The time and
effort to develop and maintain this project is dedicated by [@jaredhanson](https://github.com/jaredhanson).
If you (or your employer) benefit from this project, please consider a financial
contribution.  Your contribution helps continue the efforts that produce this
and other open source software.

Funds are accepted via [PayPal](https://paypal.me/jaredhanson), [Venmo](https://venmo.com/jaredhanson),
and [other](http://jaredhanson.net/pay) methods.  Any amount is appreciated.

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2011-2016 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>
