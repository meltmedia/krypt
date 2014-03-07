var chai = require('chai'),
    expect = chai.expect,
    krypt = require('../lib/krypt');

var PLAIN_TEXT = 'This is my text!',
    SECRET = 'A59C60BCF422D';

describe('Krypt', function () {

  it('should successfuly encrypt a value', function (done) {

    var encrypted = krypt.encrypt(PLAIN_TEXT, SECRET);
    expect(encrypted).to.have.property('iv');
    expect(encrypted).to.have.property('salt');
    expect(encrypted).to.have.property('value');
    done();

  });

  it('should successfuly decrypt a JSON value', function (done) {

    var encrypted = krypt.encrypt(PLAIN_TEXT, SECRET),
        decrypted = krypt.decrypt(encrypted, SECRET);

    expect(decrypted).to.deep.equal(PLAIN_TEXT);
    done();

  });

  it('should successfuly decrypt a string value', function (done) {

    var encrypted = krypt.encrypt(PLAIN_TEXT, SECRET),
        decrypted = krypt.decrypt(JSON.stringify(encrypted), SECRET);

    expect(decrypted).to.deep.equal(PLAIN_TEXT);
    done();

  });

});
