/*!
 * Krypt
 * Copyright(c) 2014 Mike Moulton
 */

'use strict';

var crypto = require('crypto'),
    _ = require('lodash');

var CIPHER = 'aes-256-cbc',
    KEY_DERIVATION = 'pbkdf2',
    DEFAULT_KEY_LENGTH = 256,
    DEFAULT_ITERATIONS = 128000,
    DEFAULT_DIGEST = 'sha512',
    DEFAULT_DEPRECATED_DIGEST = 'sha1';


module.exports = new Krypt();
exports.Krypt = Krypt;


function Krypt(config) {
  if (!(this instanceof Krypt)) {
    return new Krypt(config);
  }

  config = config || {};

  this.iterations = config.iterations || DEFAULT_ITERATIONS;
  this.keyLength = config.keyLength || DEFAULT_KEY_LENGTH;
  this.digest = config.digest || DEFAULT_DIGEST;
  this.defaultSecret = config.secret;
  this.context = config.context || {};
}

Krypt.prototype.DEFAULT_DIGEST = DEFAULT_DIGEST;
Krypt.prototype.DEFAULT_DEPRECATED_DIGEST = DEFAULT_DEPRECATED_DIGEST;

Krypt.prototype.setSecret = function setSecret(secret) {
  this.defaultSecret = secret;
};


Krypt.prototype.setIterations = function setIterations(iterations) {
  this.iterations = iterations;
};


Krypt.prototype.setKeyLength = function setKeyLength(keyLength) {
  this.keyLength = keyLength;
};


Krypt.prototype.setContext = function setContext(context) {
  this.context = context;
};

Krypt.prototype.setDigest = function setDigest(digest) {
  this.digest = digest;
};


Krypt.prototype.encrypt = function encrypt(input, secret, cb) {

  // Support both async and sync encryption.
  // This has implications primarily in the key stretching as it's very expensive.
  var async = (cb && typeof cb === 'function') || false;

  var self = this;

  if (!input) {
    var inputError = new Error('You must provide a value to encrypt');
    if (async) {
      return cb(inputError);
    } else {
      throw inputError;
    }
  }

  secret = secret || this.defaultSecret;
  if (!secret) {
    var secretError = new Error('A \'secret\' is required to encrypt');
    if (async) {
      return cb(secretError);
    } else {
      throw secretError;
    }
  }

  // Legacy check to deal with old versions that recorded key length in Bytes
  if (this.keyLength === 32) {
    this.keyLength = this.keyLength * 8;
  }

  var salt = crypto.randomBytes(this.keyLength / 8),
      iv = crypto.randomBytes(16);

  function encryptUsingKey(key) {
    var cipher = crypto.createCipheriv(CIPHER, key, iv);

    var encryptedValue = cipher.update(input, 'utf8', 'base64');
    encryptedValue += cipher.final('base64');

    var result = {
      cipher: CIPHER,
      keyDerivation: KEY_DERIVATION,
      keyLength: self.keyLength,
      iterations: self.iterations,
      iv: iv.toString('base64'),
      salt: salt.toString('base64'),
      digest: self.digest,
      value: encryptedValue
    };

    _.defaults(result, self.context);

    return result;
  }

  if (async) {
    crypto.pbkdf2(secret, salt, this.iterations, this.keyLength / 8, this.digest, function (err, key) {
      if (err) {
        return cb(err);
      }

      try {
        var result = encryptUsingKey(key);
        cb(null, result);
      } catch (err) {
        cb(err);
      }
    });
  } else {
    try {
      var key = crypto.pbkdf2Sync(secret, salt, this.iterations, this.keyLength / 8, this.digest);
      return encryptUsingKey(key);
    } catch (err) {
      throw new Error('Unable to encrypt value due to: ' + err);
    }
  }
};


Krypt.prototype.decrypt = function decrypt(input, secret, cb) {

  // Support both async and sync encryption.
  // This has implications primarily in the key stretching as it's very expensive.
  var async = (cb && typeof cb === 'function') || false;

  // Ensure we have something to decrypt
  if (!input) {
    var inputError = new Error('You must provide a value to decrypt');
    if (async) {
      return cb(inputError);
    } else {
      throw inputError;
    }
  }

  // Ensure we have the secret used to encrypt this value
  secret = secret || this.defaultSecret;
  if (!secret) {
    var secretError = new Error('A \'secret\' is required to decrypt');
    if (async) {
      return cb(secretError);
    } else {
      throw secretError;
    }
  }

  // If we get a string as input, turn it into an object
  if (typeof input !== 'object') {
    try {
      input = JSON.parse(input);
    } catch (err) {
      var parseError = new Error('Unable to parse string input as JSON');
      if (async) {
        return cb(parseError);
      } else {
        throw parseError;
      }
    }
  }

  // Ensure our input is a valid object with 'iv', 'salt', and 'value'
  if (!input.iv || !input.salt || !input.value) {
    var validationError = new Error('Input must be a valid object with \'iv\', \'salt\', and \'value\' properties');
    if (async) {
      return cb(validationError);
    } else {
      throw validationError;
    }
  }

  var salt = new Buffer(input.salt, 'base64'),
      iv = new Buffer(input.iv, 'base64'),
      keyLength = input.keyLength || this.keyLength,
      iterations = input.iterations || this.iterations,
      digest = input.digest || DEFAULT_DEPRECATED_DIGEST;

  // Legacy check to deal with old versions that recorded key length in Bytes
  if (keyLength === 32) {
    keyLength = keyLength * 8;
  }

  function decryptUsingKey(key) {
    var decipher = crypto.createDecipheriv(CIPHER, key, iv);

    var decryptedValue = decipher.update(input.value, 'base64', 'utf8');
    decryptedValue += decipher.final('utf8');

    return decryptedValue;
  }

  if (async) {
    crypto.pbkdf2(secret, salt, iterations, keyLength / 8, digest, function (err, key) {
      if (err) {
        return cb(err);
      }

      try {
        var result = decryptUsingKey(key);
        cb(null, result);
      } catch (err) {
        cb(err);
      }
    });
  } else {
    try {
      var key = crypto.pbkdf2Sync(secret, salt, iterations, keyLength / 8, digest);
      return decryptUsingKey(key);
    } catch (err) {
      throw new Error('Unable to decrypt value due to: ' + err);
    }
  }
};


Krypt.prototype.encryptAsync = function encryptAsync(input, secret, cb) {
  this.encrypt(input, secret, cb);
};


Krypt.prototype.decryptAsync = function decryptAsync(input, secret, cb) {
  this.decrypt(input, secret, cb);
};


Krypt.prototype.encryptSync = function encryptSync(input, secret) {
  return this.encrypt(input, secret);
};


Krypt.prototype.decryptSync = function decryptSync(input, secret) {
  return this.decrypt(input, secret);
};
