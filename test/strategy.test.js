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
  
});
