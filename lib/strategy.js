// Load modules.
var OAuthStrategy = require('passport-oauth1')
  , util = require('util')
  , Profile = require('./profile')
  , InternalOAuthError = require('passport-oauth1').InternalOAuthError
  , APIError = require('./errors/apierror');


/**
 * `Strategy` constructor.
 *
 * The Fitbit authentication strategy authenticates requests by delegating to
 * Fitbit using the OAuth protocol.
 *
 * Applications must supply a `verify` callback which accepts a `token`,
 * `tokenSecret` and service-specific `profile`, and then calls the `cb`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `consumerKey`     identifies client to Fitbit
 *   - `consumerSecret`  secret used to establish ownership of the consumer key
 *   - `callbackURL`     URL to which Fitbit will redirect the user after obtaining authorization
 *
 * Examples:
 *
 *     passport.use(new FitbitStrategy({
 *         consumerKey: '123-456-789',
 *         consumerSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/fitbit/callback'
 *       },
 *       function(token, tokenSecret, profile, cb) {
 *         User.findOrCreate(..., function (err, user) {
 *           cb(err, user);
 *         });
 *       }
 *     ));
 *
 * @constructor
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.requestTokenURL = options.requestTokenURL || 'https://api.fitbit.com/oauth/request_token';
  options.accessTokenURL = options.accessTokenURL || 'https://api.fitbit.com/oauth/access_token';
  options.userAuthorizationURL = options.userAuthorizationURL || 'https://www.fitbit.com/oauth/authorize';
  options.sessionKey = options.sessionKey || 'oauth:fitbit';

  OAuthStrategy.call(this, options, verify);
  this.name = 'fitbit';
}

// Inherit from `OAuthStrategy`.
util.inherits(Strategy, OAuthStrategy);


/**
 * Retrieve user profile from Fitbit.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `id`
 *   - `displayName`
 *
 * @param {String} token
 * @param {String} tokenSecret
 * @param {Object} params
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(token, tokenSecret, params, done) {
  this._oauth.get('https://api.fitbit.com/1/user/-/profile.json', token, tokenSecret, function (err, body, res) {
    var json;
    
    if (err) {
      if (err.data) {
        try {
          json = JSON.parse(err.data);
        } catch (_) {}
      }
      
      if (json && json.errors && json.errors.length) {
        var e = json.errors[0];
        return done(new APIError(e.message, e.errorType, e.fieldName));
      }
      return done(new InternalOAuthError('Failed to fetch user profile', err));
    }
    
    try {
      json = JSON.parse(body);
    } catch (ex) {
      return done(new Error('Failed to parse user profile'));
    }
    
    var profile = Profile.parse(json);
    profile.provider = 'fitbit';
    profile._raw = body;
    profile._json = json;
    
    done(null, profile);
  });
}

/**
 * Return extra parameters to be included in the user authorization request.
 *
 * Fitbit allows 3 optional params to be included in the user auth request:
 * locale=(en_US, de_DE, etc) this will force locale preference. 
 * display=touch This forces a mobile friendly view
 * requestCredentials=true This forces a login regardless of user 
 *   already being logged in or not. Useful for sites that allow multiple
 *   fitbit accounts to be connected to 1 user.
 *
 * @param {Object} options
 * @return {Object}
 * @api protected
 */
Strategy.prototype.userAuthorizationParams = function(options) {
  var params = {};
  if (options.locale) params.locale = options.locale;
  if (options.display) params.display = options.display;
  if (options.requestCredentials) params.requestCredentials = 'true';
  return params;
}

/**
 * Parse error response from Fitbit OAuth endpoint.
 *
 * @param {string} body
 * @param {number} status
 * @return {Error}
 * @access protected
 */
Strategy.prototype.parseErrorResponse = function(body, status) {
  var json;
  
  try {
    json = JSON.parse(body);
    if (Array.isArray(json.errors) && json.errors.length > 0) {
      return new APIError(json.errors[0].message, json.errors[0].errorType, json.errors[0].fieldName);
    }
  } catch (_) {}
};


// Expose constructor.
module.exports = Strategy;
