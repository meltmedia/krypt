/*!
 * Krypt
 * Copyright(c) 2014 Mike Moulton
 */

'use strict';

var crypto = require('crypto');

var CIPHER = 'aes-256-cbc',
    KEY_DERIVATION = 'pbkdf2',
    DEFAULT_KEY_LENGTH = 32,
    DEFAULT_ITERATIONS = 64000;


module.exports = new Krypt();
exports.Krypt = Krypt;


function Krypt(config) {
  if (!(this instanceof Krypt)) {
    return new Krypt(config);
  }

  config = config || {};

  this.iterations = config.iterations || DEFAULT_ITERATIONS;
  this.keyLength = config.keyLength || DEFAULT_KEY_LENGTH;
  this.defaultSecret = config.secret;
}


Krypt.prototype.setSecret = function setSecret(secret) {
  this.defaultSecret = secret;
};


Krypt.prototype.setIterations = function setIterations(iterations) {
  this.iterations = iterations;
};

Krypt.prototype.setKeyLength = function setKeyLength(keyLength) {
  this.keyLength = keyLength;
};


Krypt.prototype.encrypt = function encrypt(input, secret) {

  if (!input) {
    throw new Error('You must provide a value to encrypt');
  }

  secret = secret || this.defaultSecret;
  if (!secret) {
    throw new Error('A \'secret\' is required to encrypt');
  }

  var salt = crypto.randomBytes(this.keyLength),
      iv = crypto.randomBytes(16);

  try {

    var key = crypto.pbkdf2Sync(secret, salt, this.iterations, this.keyLength),
        cipher = crypto.createCipheriv(CIPHER, key, iv);

    var encryptedValue = cipher.update(input, 'utf8', 'base64');
    encryptedValue += cipher.final('base64');

    return {
      cipher: CIPHER,
      keyDerivation: KEY_DERIVATION,
      keyLength: this.keyLength,
      iterations: this.iterations,
      iv: iv.toString('base64'),
      salt: salt.toString('base64'),
      value: encryptedValue
    };

  } catch (err) {
    throw new Error('Unable to encrypt value due to: ' + err);
  }

};


Krypt.prototype.decrypt = function decrypt(input, secret) {

  // Ensure we have something to decrypt
  if (!input) {
    throw new Error('You must provide a value to decrypt');
  }

  // Ensure we have the secret used to encrypt this value
  secret = secret || this.defaultSecret;
  if (!secret) {
    throw new Error('A \'secret\' is required to decrypt');
  }

  // If we get a string as input, turn it into an object
  if (typeof input !== 'object') {
    try {
      input = JSON.parse(input);
    } catch (err) {
      throw new Error('Unable to parse string input as JSON');
    }
  }

  // Ensure our input is a valid object with 'iv', 'salt', and 'value'
  if (!input.iv || !input.salt || !input.value) {
    throw new Error('Input must be a valid object with \'iv\', \'salt\', and \'value\' properties');
  }

  var salt = new Buffer(input.salt, 'base64'),
      iv = new Buffer(input.iv, 'base64'),
      keyLength = input.keyLength || this.keyLength,
      iterations = input.iterations || this.iterations;

  try {

    var key = crypto.pbkdf2Sync(secret, salt, iterations, keyLength),
        decipher = crypto.createDecipheriv(CIPHER, key, iv);

    var decryptedValue = decipher.update(input.value, 'base64', 'utf8');
    decryptedValue += decipher.final('utf8');

    return decryptedValue;

  } catch (err) {
    throw new Error('Unable to decrypt value due to: ' + err);
  }

};
