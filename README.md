Krypt: Simple, Secure, Symmetric Encryption
=====

Krypt uses encryption best practices to produce very secure, portable JSON objects using a simple shared key.

## Install

```
npm install -g krypt
```

## CLI Usage

### Encryption

```
krypt --encrypt ./path/to/file.json --secret someSecretValue --out ./path/to/new/encrypted.out
```

### Decryption

```
krypt --decrypt ./path/to/new/encrypted.out --secret someSecretValue --out ./path/to/file.json
```

## Module Usage

### Encryption

```
var krypt = require('krypt');

var encrypted = krypt.encrypt('Input Value', 'someSecretValue');
```

### Decryption

```
var krypt = require('krypt');

var plainText = krypt.decrypt(encrypted, 'someSecretValue');
```

## Algorithms

Krypt tries to incorporate all the current encryption best practices into a simple to use module. As such, Krypt uses the following:

+ AES 256
+ CBC
+ Key Stretching w/ PBKDF2
+ Random IV / encrypted value
+ Random salt / encrypted value
