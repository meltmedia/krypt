var chai = require('chai'),
    expect = chai.expect,
    krypt = require('../lib/krypt');

var PLAIN_TEXT = 'This is my text!',
    SECRET = 'A59C60BCF422D';

describe('Krypt', function () {

  describe('synchronous functions', function () {

    it('should successfuly encrypt a value', function (done) {

      var encrypted = krypt.encryptSync(PLAIN_TEXT, SECRET);
      expect(encrypted).to.have.property('iv');
      expect(encrypted).to.have.property('salt');
      expect(encrypted).to.have.property('value');
      done();

    });

    it('should successfuly decrypt a JSON value', function (done) {

      var encrypted = krypt.encryptSync(PLAIN_TEXT, SECRET),
          decrypted = krypt.decryptSync(encrypted, SECRET);

      expect(decrypted).to.deep.equal(PLAIN_TEXT);
      done();

    });

    it('should successfuly decrypt a string value', function (done) {

      var encrypted = krypt.encryptSync(PLAIN_TEXT, SECRET),
          decrypted = krypt.decryptSync(JSON.stringify(encrypted), SECRET);

      expect(decrypted).to.deep.equal(PLAIN_TEXT);
      done();

    });

    it('should fail to encrypt a string value without input', function (done) {

      var encrypted, err;

      try {
        encrypted = krypt.encryptSync(null, SECRET);
      } catch (e) {
        err = e;
      }

      expect(encrypted).to.not.exist;
      expect(err).to.exist;
      expect(err.message).to.deep.equal('You must provide a value to encrypt');
      done();
    });

    it('should fail to encrypt a string value without a secret', function (done) {

      var encrypted, err;

      try {
        encrypted = krypt.encryptSync(PLAIN_TEXT);
      } catch (e) {
        err = e;
      }

      expect(encrypted).to.not.exist;
      expect(err).to.exist;
      expect(err.message).to.deep.equal('A \'secret\' is required to encrypt');
      done();
    });


    it('should fail to decrypt a string value without input', function (done) {

      var encrypted = krypt.encryptSync(PLAIN_TEXT, SECRET),
          decrypted, err;

      try {
        decrypted = krypt.decryptSync(null, SECRET);
      } catch (e) {
        err = e;
      }

      expect(decrypted).to.not.exist;
      expect(err).to.exist;
      expect(err.message).to.deep.equal('You must provide a value to decrypt');
      done();
    });

    it('should fail to decrypt a string value without a secret', function (done) {

      var encrypted = krypt.encryptSync(PLAIN_TEXT, SECRET),
          decrypted, err;

      try {
        decrypted = krypt.decryptSync(JSON.stringify(encrypted));
      } catch (e) {
        err = e;
      }

      expect(decrypted).to.not.exist;
      expect(err).to.exist;
      expect(err.message).to.deep.equal('A \'secret\' is required to decrypt');
      done();
    });

  });

  describe('asynchronous functions', function () {

    it('should successfuly encrypt a value', function (done) {

      krypt.encryptAsync(PLAIN_TEXT, SECRET, function(err, encrypted) {
        expect(err).to.be.null;
        expect(encrypted).to.have.property('iv');
        expect(encrypted).to.have.property('salt');
        expect(encrypted).to.have.property('value');
        done();
      });

    });

    it('should successfuly decrypt a JSON value', function (done) {

      var encrypted = krypt.encryptSync(PLAIN_TEXT, SECRET);

      krypt.decryptAsync(encrypted, SECRET, function(err, decrypted) {
        expect(err).to.be.null;
        expect(decrypted).to.deep.equal(PLAIN_TEXT);
        done();
      });

    });

    it('should successfuly decrypt a string value', function (done) {

      var encrypted = krypt.encryptSync(PLAIN_TEXT, SECRET);

      krypt.decryptAsync(JSON.stringify(encrypted), SECRET, function(err, decrypted) {
        expect(err).to.be.null;
        expect(decrypted).to.deep.equal(PLAIN_TEXT);
        done();
      });

    });

    it('should fail to encrypt a string value without input', function (done) {

      krypt.encryptAsync(null, SECRET, function (err, encrypted) {
        expect(encrypted).to.not.exist;
        expect(err).to.exist;
        expect(err.message).to.deep.equal('You must provide a value to encrypt');
        done();
      });

    });

    it('should fail to encrypt a string value without a secret', function (done) {

      krypt.encryptAsync(PLAIN_TEXT, null, function (err, encrypted) {
        expect(encrypted).to.not.exist;
        expect(err).to.exist;
        expect(err.message).to.deep.equal('A \'secret\' is required to encrypt');
        done();
      });

    });


    it('should fail to decrypt a string value without input', function (done) {

      var encrypted = krypt.encryptSync(PLAIN_TEXT, SECRET);

      krypt.decryptAsync(null, SECRET, function (err, decrypted) {
        expect(decrypted).to.not.exist;
        expect(err).to.exist;
        expect(err.message).to.deep.equal('You must provide a value to decrypt');
        done();
      });
    });

    it('should fail to decrypt a string value without a secret', function (done) {

      var encrypted = krypt.encryptSync(PLAIN_TEXT, SECRET);

      krypt.decryptAsync(JSON.stringify(encrypted), null, function (err, decrypted) {
        expect(decrypted).to.not.exist;
        expect(err).to.exist;
        expect(err.message).to.deep.equal('A \'secret\' is required to decrypt');
        done();
      });
    });

  });

});
