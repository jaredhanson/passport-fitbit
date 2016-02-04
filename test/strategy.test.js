var chai = require('chai')
  , FitBitStrategy = require('../lib/strategy');


describe('Strategy', function() {
  
  describe('constructed', function() {
    var strategy = new FitBitStrategy({
      consumerKey: 'ABC123',
      consumerSecret: 'secret'
    }, function(){});
    
    it('should be named fitbit', function() {
      expect(strategy.name).to.equal('fitbit');
    });
  })
  
  describe('constructed with undefined options', function() {
    it('should throw', function() {
      expect(function() {
        var strategy = new FitBitStrategy(undefined, function(){});
      }).to.throw(Error);
    });
  })
  
  describe('authorization request', function() {
    var strategy = new FitBitStrategy({
        consumerKey: 'ABC123',
        consumerSecret: 'secret'
      }, function(){});
    
    strategy._oauth.getOAuthRequestToken = function(extraParams, callback) {
      callback(null, 'hh5s93j4hdidpola', 'hdhd0244k9j7ao03', {});
    }
    
    
    var url;
  
    before(function(done) {
      chai.passport.use(strategy)
        .redirect(function(u) {
          url = u;
          done();
        })
        .req(function(req) {
          req.session = {};
        })
        .authenticate();
    });
  
    it('should be redirected', function() {
      expect(url).to.equal('https://www.fitbit.com/oauth/authorize?oauth_token=hh5s93j4hdidpola');
    });
  });
  
  describe('authorization request with parameters', function() {
    var strategy = new FitBitStrategy({
        consumerKey: 'ABC123',
        consumerSecret: 'secret'
      }, function(){});
    
    strategy._oauth.getOAuthRequestToken = function(extraParams, callback) {
      callback(null, 'hh5s93j4hdidpola', 'hdhd0244k9j7ao03', {});
    }
    
    
    var url;
  
    before(function(done) {
      chai.passport.use(strategy)
        .redirect(function(u) {
          url = u;
          done();
        })
        .req(function(req) {
          req.session = {};
        })
        .authenticate({ locale: 'de_DE', display: 'touch', requestCredentials: true });
    });
  
    it('should be redirected', function() {
      expect(url).to.equal('https://www.fitbit.com/oauth/authorize?oauth_token=hh5s93j4hdidpola&locale=de_DE&display=touch&requestCredentials=true');
    });
  });
  
  describe('error caused by invalid consumer secret sent to request token URL', function() {
    var strategy = new FitBitStrategy({
      consumerKey: 'ABC123',
      consumerSecret: 'invalid-secret'
    }, function verify(){});
    
    strategy._oauth.getOAuthRequestToken = function(params, callback) {
      callback({ statusCode: 401, data: '{"errors":[{"errorType":"oauth","fieldName":"oauth_signature","message":"Invalid signature: XXXXXXXXXXXXXXXXXXXXXXXXXXX="}],"success":false}' });
    }
    
    
    var err;
  
    before(function(done) {
      chai.passport.use(strategy)
        .error(function(e) {
          err = e;
          done();
        })
        .req(function(req) {
          req.session = {};
        })
        .authenticate();
    });
  
    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.constructor.name).to.equal('APIError');
      expect(err.message).to.equal("Invalid signature: XXXXXXXXXXXXXXXXXXXXXXXXXXX=");
      expect(err.type).to.equal('oauth');
      expect(err.field).to.equal('oauth_signature');
    });
  });
  
  describe('error caused by invalid consumer secret sent to request token URL, formatted as unexpected JSON', function() {
    var strategy = new FitBitStrategy({
      consumerKey: 'ABC123',
      consumerSecret: 'invalid-secret'
    }, function verify(){});
    
    strategy._oauth.getOAuthRequestToken = function(params, callback) {
      callback({ statusCode: 401, data: '{"foo":"bar"}' });
    }
    
    
    var err;
  
    before(function(done) {
      chai.passport.use(strategy)
        .error(function(e) {
          err = e;
          done();
        })
        .req(function(req) {
          req.session = {};
        })
        .authenticate();
    });
  
    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.constructor.name).to.equal('InternalOAuthError');
      expect(err.message).to.equal('Failed to obtain request token');
    });
  });
  
  describe('error caused by invalid request token sent to access token URL', function() {
    var strategy = new FitBitStrategy({
      consumerKey: 'ABC123',
      consumerSecret: 'invalid-secret',
      callbackURL: 'http://www.example.test/callback'
    }, function verify(){});
    
    strategy._oauth.getOAuthAccessToken = function(token, tokenSecret, verifier, callback) {
      callback({ statusCode: 401, data: '{"errors":[{"errorType":"oauth","fieldName":"oauth_access_token","message":"Invalid signature or token \'XXXXXXXXXXXXXXXXXXXXXXXXXXX=\' or token \'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\'"}],"success":false}' });
    }
    
    
    var err;
  
    before(function(done) {
      chai.passport.use(strategy)
        .error(function(e) {
          err = e;
          done();
        })
        .req(function(req) {
          req.query = {};
          req.query['oauth_token'] = 'x-hh5s93j4hdidpola';
          req.query['oauth_verifier'] = 'hfdp7dh39dks9884';
          req.session = {};
          req.session['oauth:fitbit'] = {};
          req.session['oauth:fitbit']['oauth_token'] = 'x-hh5s93j4hdidpola';
          req.session['oauth:fitbit']['oauth_token_secret'] = 'hdhd0244k9j7ao03';
        })
        .authenticate();
    });
  
    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.constructor.name).to.equal('APIError');
      expect(err.message).to.equal("Invalid signature or token 'XXXXXXXXXXXXXXXXXXXXXXXXXXX=' or token 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'");
      expect(err.type).to.equal('oauth');
      expect(err.field).to.equal('oauth_access_token');
    });
  });
  
  describe('error caused by invalid verifier sent to access token URL', function() {
    var strategy = new FitBitStrategy({
      consumerKey: 'ABC123',
      consumerSecret: 'secret',
      callbackURL: 'http://www.example.test/callback'
    }, function verify(){});
    
    strategy._oauth.getOAuthAccessToken = function(token, tokenSecret, verifier, callback) {
      callback({ statusCode: 401, data: 'oauth_problem=permission_denied' });
    }
    
    
    var err;
  
    before(function(done) {
      chai.passport.use(strategy)
        .error(function(e) {
          err = e;
          done();
        })
        .req(function(req) {
          req.query = {};
          req.query['oauth_token'] = 'hh5s93j4hdidpola';
          req.query['oauth_verifier'] = 'x-hfdp7dh39dks9884';
          req.session = {};
          req.session['oauth:fitbit'] = {};
          req.session['oauth:fitbit']['oauth_token'] = 'hh5s93j4hdidpola';
          req.session['oauth:fitbit']['oauth_token_secret'] = 'hdhd0244k9j7ao03';
        })
        .authenticate();
    });
  
    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.message).to.equal("Failed to obtain access token");
    });
  });
  
});
