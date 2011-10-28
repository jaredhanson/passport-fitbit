var vows = require('vows');
var assert = require('assert');
var util = require('util');
var fitbit = require('passport-fitbit');


vows.describe('passport-fitbit').addBatch({
  
  'module': {
    'should report a version': function (x) {
      assert.isString(fitbit.version);
    },
  },
  
}).export(module);
