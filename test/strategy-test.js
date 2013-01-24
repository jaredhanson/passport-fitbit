var vows = require('vows');
var assert = require('assert');
var util = require('util');
var FitbitStrategy = require('passport-fitbit/strategy');


vows.describe('FitbitStrategy').addBatch({
  
  'strategy': {
    topic: function() {
      return new FitbitStrategy({
        consumerKey: 'ABC123',
        consumerSecret: 'secret'
      },
      function() {});
    },
    
    'should be named fitbit': function (strategy) {
      assert.equal(strategy.name, 'fitbit');
    },
  },
  
  'strategy when loading user profile': {
    topic: function() {
      var strategy = new FitbitStrategy({
        consumerKey: 'ABC123',
        consumerSecret: 'secret'
      },
      function() {});
      
      // mock
      strategy._oauth.get = function(url, token, tokenSecret, callback) {
        var body = '{"user":{"avatar":"http://www.fitbit.com/images/profile/defaultProfile_100_male.gif","city":"Oakland","country":"US","dateOfBirth":"1981-02-05","displayName":"Jared H.","encodedId":"22B7NF","fullName":"Jared Hanson","gender":"MALE","height":193.10000000000002,"offsetFromUTCMillis":-25200000,"state":"CA","strideLengthRunning":0,"strideLengthWalking":0,"timezone":"America/Los_Angeles","weight":79.38}}';
        
        callback(null, body, undefined);
      }
      
      return strategy;
    },
    
    'when told to load user profile': {
      topic: function(strategy) {
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }
        
        process.nextTick(function () {
          strategy.userProfile('token', 'token-secret', {}, done);
        });
      },
      
      'should not error' : function(err, req) {
        assert.isNull(err);
      },
      'should load profile' : function(err, profile) {
        assert.equal(profile.provider, 'fitbit');
        assert.equal(profile.id, '22B7NF');
        assert.equal(profile.displayName, 'Jared H.');
      },
      'should set raw property' : function(err, profile) {
        assert.isString(profile._raw);
      },
      'should set json property' : function(err, profile) {
        assert.isObject(profile._json);
      },
    },
  },
  
  'strategy when loading user profile and encountering an error': {
    topic: function() {
      var strategy = new FitbitStrategy({
        consumerKey: 'ABC123',
        consumerSecret: 'secret'
      },
      function() {});
      
      // mock
      strategy._oauth.get = function(url, token, tokenSecret, callback) {
        callback(new Error('something went wrong'));
      }
      
      return strategy;
    },
    
    'when told to load user profile': {
      topic: function(strategy) {
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }
        
        process.nextTick(function () {
          strategy.userProfile('token', 'token-secret', {}, done);
        });
      },
      
      'should error' : function(err, req) {
        assert.isNotNull(err);
      },
      'should wrap error in InternalOAuthError' : function(err, req) {
        assert.equal(err.constructor.name, 'InternalOAuthError');
      },
      'should not load profile' : function(err, profile) {
        assert.isUndefined(profile);
      },
    },
  },
  
}).export(module);
