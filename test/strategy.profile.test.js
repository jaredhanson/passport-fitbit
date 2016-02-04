var FitBitStrategy = require('../lib/strategy')
  , fs = require('fs');


describe('Strategy#userProfile', function() {
  
  describe('fetched from default endpoint', function() {
    var strategy = new FitBitStrategy({
      consumerKey: 'ABC123',
      consumerSecret: 'secret'
    }, function verify(){});
    
    strategy._oauth.get = function(url, token, tokenSecret, callback) {
      if (url != 'https://api.fitbit.com/1/user/-/profile.json') { return callback(new Error('incorrect url argument')); }
      if (token != 'token') { return callback(new Error('incorrect token argument')); }
      if (tokenSecret != 'token-secret') { return callback(new Error('incorrect tokenSecret argument')); }
    
      var body = '{"user":{"avatar":"http://www.fitbit.com/images/profile/defaultProfile_100_male.gif","city":"Oakland","country":"US","dateOfBirth":"1981-02-05","displayName":"Jared H.","encodedId":"22B7NF","fullName":"Jared Hanson","gender":"MALE","height":193.10000000000002,"offsetFromUTCMillis":-25200000,"state":"CA","strideLengthRunning":0,"strideLengthWalking":0,"timezone":"America/Los_Angeles","weight":79.38}}';
      var response = {headers:{'x-access-level': 'read'}};
      callback(null, body, response);
    }
    
    
    var profile;
  
    before(function(done) {
      strategy.userProfile('token', 'token-secret', { user_id: '6253282' }, function(err, p) {
        if (err) { return done(err); }
        profile = p;
        done();
      });
    });
  
    it('should parse profile', function() {
      expect(profile.provider).to.equal('fitbit');
      expect(profile.id).to.equal('22B7NF');
      expect(profile.displayName).to.equal('Jared H.');
    });
  
    it('should set raw property', function() {
      expect(profile._raw).to.be.a('string');
    });
  
    it('should set json property', function() {
      expect(profile._json).to.be.an('object');
    });
  }); // fetched from default endpoint
  
});
