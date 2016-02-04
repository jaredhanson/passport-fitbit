/**
 * `APIError` error.
 *
 * @constructor
 * @param {string} [message]
 * @param {string} [type]
 * @param {string} [field]
 * @access public
 */
function APIError(message, type, field) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'APIError';
  this.message = message;
  this.type = type;
  this.field = field;
}

// Inherit from `Error`.
APIError.prototype.__proto__ = Error.prototype;


// Expose constructor.
module.exports = APIError;
