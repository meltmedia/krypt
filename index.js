#!/usr/bin/env node

/*!
 * Krypt
 * Copyright(c) 2014 Mike Moulton
 */

'use strict';

var fs = require('fs'),
    path = require('path'),
    krypt = require('./lib/krypt');


/**
 * CLI
 */
function main() {

  var nconf = require('nconf');

  // Load command line options
  nconf.argv();

  var secret = nconf.get('secret');

  if (nconf.get('encrypt')) {

    try {
      var encryptInput = fs.readFileSync(path.resolve(nconf.get('encrypt')), 'utf8'),
          encrypted = krypt.encrypt(encryptInput, secret);

      if (nconf.get('out')) {
        fs.writeFileSync(
          path.join(__dirname, nconf.get('out')),
          JSON.stringify(encrypted, null, '  '),
          'utf8');
      } else {
        console.log(JSON.stringify(encrypted, null, '  '));
      }
    } catch (err) {
      console.error(err);
      process.exit(1);
    }

  } else if (nconf.get('decrypt')) {

    try {
      var decryptInput = fs.readFileSync(path.resolve(nconf.get('decrypt')), 'utf8'),
          decrypted = krypt.decrypt(decryptInput, secret);

      if (nconf.get('out')) {
        fs.writeFileSync(
          path.join(__dirname, nconf.get('out')),
          decrypted,
          'utf8');
      } else {
        console.log(decrypted);
      }
    } catch (err) {
      console.error(err);
      process.exit(1);
    }

  }

}

// If run from the command line, start application
if (require.main === module) {
  main();
} else {
  return krypt;
}
